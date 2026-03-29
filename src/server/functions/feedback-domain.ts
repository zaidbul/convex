import { z } from "zod"
import type {
  feedbackImportKinds,
  feedbackItemSeverities,
  feedbackSuggestionStatuses,
} from "@/db/schema"

export type FeedbackImportKind = (typeof feedbackImportKinds)[number]
export type FeedbackItemSeverity = (typeof feedbackItemSeverities)[number]
export type FeedbackSuggestionStatus = (typeof feedbackSuggestionStatuses)[number]

export type CreateFeedbackImportInput = {
  kind: FeedbackImportKind
  sourceName: string
  sourceDescription?: string
  rawContent?: string
  rawPayloadJson?: unknown
}

export type NormalizedFeedbackChunk = {
  sourceIndex: number
  title?: string
  originalText: string
  normalizedText: string
  rawPayloadJson?: unknown
}

export const feedbackItemAnalysisSchema = z.object({
  summary: z.string().min(1).max(280),
  tags: z.array(z.string().min(1).max(40)).max(8),
  featureArea: z.string().min(1).max(80),
  problemType: z.string().min(1).max(80),
  severity: z.enum(["low", "medium", "high"]),
  requestedCapability: z.string().min(1).max(200),
  suggestedTeamSlug: z.string().min(1).max(80).optional(),
  dedupeKeys: z.array(z.string().min(1).max(80)).min(1).max(8),
})

export type FeedbackItemAnalysis = z.infer<typeof feedbackItemAnalysisSchema>

export const feedbackClusterAnalysisSchema = z.object({
  title: z.string().min(1).max(120),
  reason: z.string().min(1).max(240),
  painSummary: z.string().min(1).max(400),
  proposedDirection: z.string().min(1).max(600),
  confidence: z.number().int().min(0).max(100),
})

export type FeedbackClusterAnalysis = z.infer<typeof feedbackClusterAnalysisSchema>

const MAX_CHUNK_LENGTH = 1800
const MIN_CHUNK_LENGTH = 80

function normalizeWhitespace(input: string): string {
  return input.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
}

function clampText(input: string): string {
  if (input.length <= MAX_CHUNK_LENGTH) {
    return input
  }
  return `${input.slice(0, MAX_CHUNK_LENGTH - 1).trimEnd()}…`
}

function mergeSmallSegments(segments: string[]): string[] {
  const merged: string[] = []

  for (const segment of segments) {
    const clean = normalizeWhitespace(segment)
    if (!clean) continue

    const last = merged.at(-1)
    if (clean.length < MIN_CHUNK_LENGTH && last) {
      merged[merged.length - 1] = clampText(`${last}\n\n${clean}`)
      continue
    }

    merged.push(clampText(clean))
  }

  return merged
}

function splitTextContent(content: string): NormalizedFeedbackChunk[] {
  const normalized = normalizeWhitespace(content)
  if (!normalized) return []

  const blocks = normalized
    .split(/\n(?=#)|\n{2,}/g)
    .map((block) => block.trim())
    .filter(Boolean)

  return mergeSmallSegments(blocks).map((block, index) => {
    const headingMatch = block.match(/^#{1,6}\s+(.+)\n([\s\S]+)$/)
    return {
      sourceIndex: index,
      title: headingMatch?.[1]?.trim(),
      originalText: block,
      normalizedText: headingMatch ? clampText(headingMatch[2].trim()) : block,
    }
  })
}

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === "\"") {
      if (inQuotes && nextChar === "\"") {
        current += "\""
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = normalizeWhitespace(content)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const headers = parseCsvLine(lines[0]).map((header, index) => header || `column_${index + 1}`)
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? ""
      return acc
    }, {})
  })
}

function extractStringValues(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") {
    return value.trim() ? [`${prefix}${value.trim()}`] : []
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return [`${prefix}${String(value)}`]
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => extractStringValues(entry, prefix))
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, entry]) =>
      extractStringValues(entry, prefix ? `${prefix}${key}: ` : `${key}: `)
    )
  }

  return []
}

function chunksFromObjects(rows: unknown[]): NormalizedFeedbackChunk[] {
  const mapped = rows
    .map((row, index) => {
      const strings = extractStringValues(row)
      const normalizedText = clampText(strings.join("\n"))
      if (!normalizedText) return null

      const rowObject =
        row && typeof row === "object" && !Array.isArray(row)
          ? (row as Record<string, unknown>)
          : { value: row }

      const titleCandidate = ["title", "subject", "summary", "name"].find(
        (key) => typeof rowObject[key] === "string" && String(rowObject[key]).trim()
      )

      return {
        sourceIndex: index,
        title: titleCandidate ? String(rowObject[titleCandidate]).trim() : undefined,
        originalText: normalizedText,
        normalizedText,
        rawPayloadJson: row,
      } satisfies NormalizedFeedbackChunk
    })
  return mapped.filter((entry) => entry !== null)
}

export function normalizeFeedbackImport(input: CreateFeedbackImportInput): NormalizedFeedbackChunk[] {
  switch (input.kind) {
    case "paste":
    case "txt":
    case "md":
      return splitTextContent(input.rawContent ?? "")
    case "csv":
      return chunksFromObjects(parseCsv(input.rawContent ?? ""))
    case "json": {
      const parsed = input.rawPayloadJson ?? JSON.parse(input.rawContent ?? "[]")
      const rows = Array.isArray(parsed) ? parsed : [parsed]
      return chunksFromObjects(rows)
    }
    default:
      return []
  }
}

export function buildFeedbackIssueDescription(input: {
  suggestionTitle: string
  summary: string
  proposedSolution: string
  aiRationale?: string | null
  evidence: Array<{ title?: string | null; summary?: string | null; originalText: string }>
}): string {
  const sections = [
    `# ${input.suggestionTitle}`,
    "",
    "## Problem summary",
    input.summary,
    "",
    "## Proposed solution",
    input.proposedSolution,
  ]

  if (input.aiRationale) {
    sections.push("", "## AI rationale", input.aiRationale)
  }

  sections.push("", "## Supporting feedback")

  for (const [index, evidence] of input.evidence.entries()) {
    sections.push(
      `- Signal ${index + 1}${evidence.title ? `: ${evidence.title}` : ""}`,
      evidence.summary ? `  Summary: ${evidence.summary}` : "  Summary: n/a",
      `  Evidence: ${evidence.originalText.replace(/\n+/g, " ").trim()}`
    )
  }

  return sections.join("\n").trim()
}
