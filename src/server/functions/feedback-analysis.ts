import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import type { FeedbackItemSeverity } from "./feedback-domain"
import {
  feedbackClusterAnalysisSchema,
  feedbackItemAnalysisSchema,
  type FeedbackClusterAnalysis,
  type FeedbackItemAnalysis,
} from "./feedback-domain"

type TeamCandidate = {
  id: string
  slug: string
  name: string
}

export type AnalyzableFeedbackItem = {
  id: string
  title?: string | null
  normalizedText: string
}

export type ClusterableFeedbackItem = {
  id: string
  importId: string
  title?: string | null
  originalText: string
  normalizedText: string
  summary: string | null
  featureArea: string | null
  problemType: string | null
  severity: FeedbackItemSeverity | null
  requestedCapability: string | null
  suggestedTeamId: string | null
  tags: string[]
  dedupeKeys: string[]
  createdAt: string
}

export type DeterministicFeedbackCluster = {
  clusterKey: string
  suggestedTeamId: string | null
  featureArea: string | null
  problemType: string | null
  items: ClusterableFeedbackItem[]
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

function sanitizeKeyword(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function extractKeywords(text: string): string[] {
  return uniqueStrings(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter((word) => word.length >= 4)
      .slice(0, 20)
  )
}

function inferSeverity(text: string): FeedbackItemSeverity {
  if (/(blocked|outage|crash|data loss|urgent|broken|can't|cannot)/i.test(text)) {
    return "high"
  }
  if (/(slow|annoying|confusing|friction|missing|difficult)/i.test(text)) {
    return "medium"
  }
  return "low"
}

function inferProblemType(text: string): string {
  if (/(bug|broken|crash|error|fail)/i.test(text)) return "bug"
  if (/(slow|latency|performance)/i.test(text)) return "performance"
  if (/(confusing|hard to|discover|find|ux|ui)/i.test(text)) return "ux"
  if (/(integration|import|export|api|webhook)/i.test(text)) return "integration"
  return "feature-gap"
}

function inferFeatureArea(text: string): string {
  const lower = text.toLowerCase()
  if (/(ticket|issue|backlog|triage|assign)/.test(lower)) return "tickets"
  if (/(editor|compose|markdown|comment|write)/.test(lower)) return "editor"
  if (/(dashboard|report|analytics|metric|chart)/.test(lower)) return "dashboard"
  if (/(search|find|filter|command palette)/.test(lower)) return "search"
  if (/(settings|workspace|team|member|permission)/.test(lower)) return "workspace-management"
  if (/(notification|inbox|mention)/.test(lower)) return "notifications"
  return "general"
}

function inferRequestedCapability(text: string, featureArea: string): string {
  if (/(need|want|wish|should|please|could)/i.test(text)) {
    return text.slice(0, 180)
  }

  switch (featureArea) {
    case "tickets":
      return "Improve ticket triage and workflow management."
    case "dashboard":
      return "Provide clearer reporting and recommendation surfaces."
    case "search":
      return "Make information easier to find and act on."
    default:
      return "Address the recurring friction described in this feedback."
  }
}

function inferSuggestedTeam(text: string, teams: TeamCandidate[]): string | undefined {
  const lower = text.toLowerCase()
  const exact = teams.find((team) =>
    lower.includes(team.slug.toLowerCase()) || lower.includes(team.name.toLowerCase())
  )
  if (exact) return exact.slug

  if (/(ui|ux|design)/.test(lower)) {
    return teams.find((team) => /(design|product)/i.test(team.name))?.slug
  }

  if (/(api|sync|integration|dashboard|performance|ticket|issue|search)/.test(lower)) {
    return teams.find((team) => /(platform|engineering|core)/i.test(team.name))?.slug
  }

  return teams[0]?.slug
}

function heuristicItemAnalysis(item: AnalyzableFeedbackItem, teams: TeamCandidate[]): FeedbackItemAnalysis {
  const text = item.normalizedText.trim()
  const featureArea = inferFeatureArea(text)
  const problemType = inferProblemType(text)
  const keywords = extractKeywords(text)

  return {
    summary: item.title?.trim() || text.slice(0, 140),
    tags: uniqueStrings([featureArea, problemType, ...keywords.slice(0, 4)]).slice(0, 8),
    featureArea,
    problemType,
    severity: inferSeverity(text),
    requestedCapability: inferRequestedCapability(text, featureArea),
    suggestedTeamSlug: inferSuggestedTeam(text, teams),
    dedupeKeys: uniqueStrings([
      sanitizeKeyword(featureArea),
      sanitizeKeyword(problemType),
      ...keywords.slice(0, 4).map(sanitizeKeyword),
    ]).slice(0, 8),
  }
}

function heuristicClusterAnalysis(cluster: DeterministicFeedbackCluster): FeedbackClusterAnalysis {
  const representative = cluster.items[0]
  const title =
    representative?.featureArea && representative?.problemType
      ? `${titleCase(representative.featureArea)} ${titleCase(representative.problemType)}`
      : representative?.summary || "Feedback cluster"

  const highSeverityCount = cluster.items.filter((item) => item.severity === "high").length
  const confidence = Math.min(
    95,
    45 + cluster.items.length * 8 + highSeverityCount * 6 + (cluster.items.length >= 3 ? 10 : 0)
  )

  return {
    title,
    reason: `Grouped by recurring ${cluster.problemType ?? "product"} feedback in ${cluster.featureArea ?? "the app"}.`,
    painSummary: cluster.items
      .slice(0, 3)
      .map((item) => item.summary || item.originalText.slice(0, 140))
      .join(" "),
    proposedDirection:
      representative?.requestedCapability ||
      "Investigate the repeated complaints and turn them into a scoped product improvement.",
    confidence,
  }
}

function canUseOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY)
}

export async function analyzeFeedbackItem(
  item: AnalyzableFeedbackItem,
  teams: TeamCandidate[]
): Promise<FeedbackItemAnalysis> {
  if (!canUseOpenAI()) {
    return heuristicItemAnalysis(item, teams)
  }

  try {
    const result = await generateObject({
      model: openai(process.env.FEEDBACK_ANALYSIS_ITEM_MODEL ?? "gpt-5.3-chat-latest"),
      schema: feedbackItemAnalysisSchema,
      system:
        "You classify product feedback into stable structured fields. Keep categories compact, concrete, and implementation-friendly.",
      prompt: [
        "Analyze this feedback item for a product team.",
        `Available teams: ${teams.map((team) => `${team.slug} (${team.name})`).join(", ")}`,
        "Return concise categories. Use a suggestedTeamSlug only if one of the available teams is a good fit.",
        "",
        item.title ? `Title: ${item.title}` : "",
        `Feedback: ${item.normalizedText}`,
      ]
        .filter(Boolean)
        .join("\n"),
    })

    return result.object
  } catch {
    return heuristicItemAnalysis(item, teams)
  }
}

function overlapScore(a: ClusterableFeedbackItem, b: ClusterableFeedbackItem): number {
  const dedupeOverlap = a.dedupeKeys.filter((key) => b.dedupeKeys.includes(key)).length
  const tagOverlap = a.tags.filter((tag) => b.tags.includes(tag)).length
  return dedupeOverlap * 2 + tagOverlap
}

export function clusterFeedbackItems(items: ClusterableFeedbackItem[]): DeterministicFeedbackCluster[] {
  const byBaseKey = new Map<string, ClusterableFeedbackItem[]>()

  for (const item of items) {
    const baseKey = [
      item.suggestedTeamId ?? "unassigned",
      slugify(item.featureArea ?? "general"),
      slugify(item.problemType ?? "general"),
    ].join("|")

    const current = byBaseKey.get(baseKey) ?? []
    current.push(item)
    byBaseKey.set(baseKey, current)
  }

  const clusters: DeterministicFeedbackCluster[] = []

  for (const [baseKey, baseItems] of Array.from(byBaseKey.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    const stableItems = [...baseItems].sort((left, right) => left.id.localeCompare(right.id))
    const groupClusters: Array<DeterministicFeedbackCluster> = []

    for (const item of stableItems) {
      const existing = groupClusters.find((cluster) =>
        cluster.items.some((clusterItem) => overlapScore(clusterItem, item) >= 2)
      )

      if (existing) {
        existing.items.push(item)
        continue
      }

      groupClusters.push({
        clusterKey: baseKey,
        suggestedTeamId: item.suggestedTeamId,
        featureArea: item.featureArea,
        problemType: item.problemType,
        items: [item],
      })
    }

    for (const cluster of groupClusters) {
      const seedKey = uniqueStrings(cluster.items.flatMap((item) => item.dedupeKeys)).slice(0, 3)
      const suffix = seedKey.length > 0 ? seedKey.join("-") : cluster.items[0]?.id ?? "cluster"
      clusters.push({
        ...cluster,
        clusterKey: `${baseKey}|${suffix}`,
        items: cluster.items.sort((left, right) => left.id.localeCompare(right.id)),
      })
    }
  }

  return clusters.sort((left, right) => left.clusterKey.localeCompare(right.clusterKey))
}

export async function analyzeFeedbackCluster(
  cluster: DeterministicFeedbackCluster
): Promise<FeedbackClusterAnalysis> {
  if (!canUseOpenAI()) {
    return heuristicClusterAnalysis(cluster)
  }

  try {
    const result = await generateObject({
      model: openai(process.env.FEEDBACK_ANALYSIS_CLUSTER_MODEL ?? "gpt-5.3-chat-latest"),
      schema: feedbackClusterAnalysisSchema,
      system:
        "You synthesize grouped user feedback into a product direction. Be concise, practical, and avoid generic language.",
      prompt: [
        `Feature area: ${cluster.featureArea ?? "general"}`,
        `Problem type: ${cluster.problemType ?? "general"}`,
        `Signal count: ${cluster.items.length}`,
        "Representative signals:",
        ...cluster.items.slice(0, 8).map((item, index) =>
          `${index + 1}. ${item.summary ?? item.originalText.slice(0, 180)}`
        ),
      ].join("\n"),
    })

    return result.object
  } catch {
    return heuristicClusterAnalysis(cluster)
  }
}

export function computeImpactScore(cluster: DeterministicFeedbackCluster): number {
  const severityWeight = cluster.items.reduce((total, item) => {
    switch (item.severity) {
      case "high":
        return total + 3
      case "medium":
        return total + 2
      default:
        return total + 1
    }
  }, 0)

  return severityWeight * 10 + cluster.items.length * 8
}

export function computePriorityScore(input: {
  impactScore: number
  confidence: number
  evidenceCount: number
  sourceDiversity: number
  lastTouchedAt: string
}): number {
  const recencyBoost = Math.max(
    0,
    15 - Math.floor((Date.now() - new Date(input.lastTouchedAt).getTime()) / (1000 * 60 * 60 * 24))
  )

  return (
    input.impactScore +
    Math.round(input.confidence * 0.5) +
    input.evidenceCount * 4 +
    input.sourceDiversity * 6 +
    recencyBoost
  )
}
