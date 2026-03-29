import type { UIMessage } from "ai"

export type ToolMessageState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied"

export type TextMessagePart = {
  type: "text"
  text: string
  state?: "streaming" | "done"
}

export type ReasoningPart = {
  type: "reasoning"
  text: string
  state?: "streaming" | "done"
}

export type ToolPart = {
  type: "tool"
  toolName: string
  toolCallId: string
  state: ToolMessageState
  input?: unknown
  output?: unknown
  errorText?: string
  preliminary?: boolean
}

export type MessagePart = TextMessagePart | ReasoningPart | ToolPart

type StoredPartRecord = Record<string, unknown>

function ensureSentence(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return ""
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object"
}

function normalizeLegacyToolState(state: unknown): ToolMessageState {
  if (state === "partial-call") return "input-streaming"
  if (state === "call") return "input-available"
  if (state === "result") return "output-available"
  return "input-available"
}

function normalizeStoredToolState(
  type: unknown,
  state: unknown
): ToolMessageState {
  if (
    state === "input-streaming" ||
    state === "input-available" ||
    state === "approval-requested" ||
    state === "approval-responded" ||
    state === "output-available" ||
    state === "output-error" ||
    state === "output-denied"
  ) {
    return state
  }

  return type === "tool-result" ? "output-available" : "input-available"
}

function isToolUiPartType(type: unknown): type is string {
  return typeof type === "string" && type.startsWith("tool-")
}

function getToolNameFromUiPart(type: string): string {
  return type.slice(5)
}

function upsertStoredToolPart(
  parts: MessagePart[],
  toolIndexes: Map<string, number>,
  rawPart: StoredPartRecord
) {
  const toolCallId = typeof rawPart.toolCallId === "string" ? rawPart.toolCallId : null
  const toolName = typeof rawPart.toolName === "string" ? rawPart.toolName : null
  const rawType = rawPart.type

  if (!toolCallId || !toolName) return

  const normalizedState = normalizeStoredToolState(rawType, rawPart.state)
  const nextPart: ToolPart = {
    type: "tool",
    toolCallId,
    toolName,
    state: normalizedState,
    input: rawPart.input ?? rawPart.args,
    output: rawPart.output ?? rawPart.result,
    errorText: typeof rawPart.errorText === "string" ? rawPart.errorText : undefined,
    preliminary: typeof rawPart.preliminary === "boolean" ? rawPart.preliminary : undefined,
  }

  const existingIndex = toolIndexes.get(toolCallId)
  if (existingIndex === undefined) {
    toolIndexes.set(toolCallId, parts.length)
    parts.push(nextPart)
    return
  }

  const existing = parts[existingIndex]
  if (existing?.type !== "tool") return

  parts[existingIndex] = {
    ...existing,
    ...nextPart,
    input: nextPart.input ?? existing.input,
    output: nextPart.output ?? existing.output,
    errorText: nextPart.errorText ?? existing.errorText,
    preliminary: nextPart.preliminary ?? existing.preliminary,
  }
}

function normalizeRawUiPart(rawPart: Record<string, unknown>): MessagePart | null {
  const type = rawPart.type

  if (type === "text" && typeof rawPart.text === "string") {
    return {
      type: "text",
      text: rawPart.text,
      state: rawPart.state === "streaming" ? "streaming" : "done",
    }
  }

  if (type === "reasoning" && typeof rawPart.text === "string") {
    return {
      type: "reasoning",
      text: rawPart.text,
      state: rawPart.state === "streaming" ? "streaming" : "done",
    }
  }

  if (type === "tool") {
    if (
      typeof rawPart.toolName === "string" &&
      typeof rawPart.toolCallId === "string" &&
      typeof rawPart.state === "string"
    ) {
      return {
        type: "tool",
        toolName: rawPart.toolName,
        toolCallId: rawPart.toolCallId,
        state: normalizeStoredToolState(type, rawPart.state),
        input: rawPart.input,
        output: rawPart.output,
        errorText:
          typeof rawPart.errorText === "string" ? rawPart.errorText : undefined,
        preliminary:
          typeof rawPart.preliminary === "boolean"
            ? rawPart.preliminary
            : undefined,
      }
    }
    return null
  }

  if (type === "dynamic-tool") {
    if (
      typeof rawPart.toolName !== "string" ||
      typeof rawPart.toolCallId !== "string"
    ) {
      return null
    }

    return {
      type: "tool",
      toolName: rawPart.toolName,
      toolCallId: rawPart.toolCallId,
      state: normalizeStoredToolState(type, rawPart.state),
      input: rawPart.input,
      output: rawPart.output,
      errorText:
        typeof rawPart.errorText === "string" ? rawPart.errorText : undefined,
      preliminary:
        typeof rawPart.preliminary === "boolean"
          ? rawPart.preliminary
          : undefined,
    }
  }

  if (isToolUiPartType(type)) {
    if (typeof rawPart.toolCallId !== "string") return null

    return {
      type: "tool",
      toolName: getToolNameFromUiPart(type),
      toolCallId: rawPart.toolCallId,
      state: normalizeStoredToolState(type, rawPart.state),
      input: rawPart.input,
      output: rawPart.output,
      errorText:
        typeof rawPart.errorText === "string" ? rawPart.errorText : undefined,
      preliminary:
        typeof rawPart.preliminary === "boolean"
          ? rawPart.preliminary
          : undefined,
    }
  }

  if (type === "tool-invocation" && isRecord(rawPart.toolInvocation)) {
    const toolInvocation = rawPart.toolInvocation
    if (
      typeof toolInvocation.toolCallId !== "string" ||
      typeof toolInvocation.toolName !== "string"
    ) {
      return null
    }

    return {
      type: "tool",
      toolName: toolInvocation.toolName,
      toolCallId: toolInvocation.toolCallId,
      state: normalizeLegacyToolState(toolInvocation.state),
      input: toolInvocation.args,
      output: toolInvocation.result,
    }
  }

  return null
}

export function formatMessageContent(parts: MessagePart[]): string {
  return parts
    .filter((part): part is TextMessagePart => part.type === "text")
    .map((part) => part.text)
    .join("\n")
}

export function getToolParts(parts: MessagePart[]): ToolPart[] {
  return parts.filter((part): part is ToolPart => part.type === "tool")
}

export function normalizeMessageParts(parts: unknown[] | null | undefined): MessagePart[] {
  if (!Array.isArray(parts) || parts.length === 0) return []

  const normalizedParts: MessagePart[] = []
  const toolIndexes = new Map<string, number>()

  for (const rawPart of parts) {
    if (!isRecord(rawPart)) continue

    if (rawPart.type === "tool-call" || rawPart.type === "tool-result") {
      upsertStoredToolPart(normalizedParts, toolIndexes, rawPart)
      continue
    }

    const normalized = normalizeRawUiPart(rawPart)
    if (normalized) normalizedParts.push(normalized)
  }

  return normalizedParts
}

export function normalizeLegacyMessageParts(
  content: string,
  toolResultJson?: unknown[] | null,
  toolCallsJson?: unknown[] | null
): MessagePart[] {
  const parts: MessagePart[] = []

  if (content) {
    parts.push({ type: "text", text: content, state: "done" })
  }

  const toolCalls = Array.isArray(toolCallsJson) ? toolCallsJson : []
  const toolResults = Array.isArray(toolResultJson) ? toolResultJson : []

  for (const [index, call] of toolCalls.entries()) {
    if (!isRecord(call) || typeof call.toolName !== "string") continue

    parts.push({
      type: "tool",
      toolName: call.toolName,
      toolCallId:
        typeof call.toolCallId === "string"
          ? call.toolCallId
          : `legacy-${call.toolName}-${index}`,
      state: "input-available",
      input: call.args,
    })
  }

  for (const [index, result] of toolResults.entries()) {
    if (!isRecord(result) || typeof result.toolName !== "string") continue

    parts.push({
      type: "tool",
      toolName: result.toolName,
      toolCallId:
        typeof result.toolCallId === "string"
          ? result.toolCallId
          : `legacy-${result.toolName}-${index}`,
      state: "output-available",
      output: result.result,
    })
  }

  return normalizeMessageParts(parts)
}

export function rehydrateStoredMessagePartsToUi(
  partsJson: unknown[] | null | undefined,
  fallbackContent: string,
  toolResultJson?: unknown[] | null,
  toolCallsJson?: unknown[] | null
): UIMessage["parts"] {
  const normalizedFromPartsJson = normalizeMessageParts(partsJson)
  const normalizedParts =
    normalizedFromPartsJson.length > 0
      ? normalizedFromPartsJson
      : normalizeLegacyMessageParts(fallbackContent, toolResultJson, toolCallsJson)

  if (normalizedParts.length === 0 && fallbackContent) {
    return [{ type: "text", text: fallbackContent, state: "done" }]
  }

  return normalizedParts.map((part) => {
    if (part.type === "text") {
      return { type: "text", text: part.text, state: part.state ?? "done" }
    }

    if (part.type === "reasoning") {
      return {
        type: "reasoning",
        text: part.text,
        state: part.state ?? "done",
      }
    }

    const toolPart = {
      type: "dynamic-tool" as const,
      toolName: part.toolName,
      toolCallId: part.toolCallId,
      state: part.state,
      input: part.input,
      preliminary: part.preliminary,
    } as Record<string, unknown>

    if (part.state === "output-available") {
      return {
        ...toolPart,
        output: part.output,
      }
    }

    if (part.state === "output-error") {
      return {
        ...toolPart,
        errorText: part.errorText ?? "Tool failed",
      }
    }

    if (part.state === "output-denied") {
      return toolPart
    }

    return toolPart
  }) as UIMessage["parts"]
}

export function synthesizeAssistantNarration(parts: MessagePart[]): string[] {
  const hasMeaningfulText = parts.some(
    (part) => part.type === "text" && part.text.trim().length > 0
  )
  if (hasMeaningfulText) return []

  const narration: string[] = []
  const seenTexts = new Set<string>()

  for (const part of getToolParts(parts)) {
    let text = ""

    if (
      part.toolName === "processUploadedFile" &&
      part.state === "output-available"
    ) {
      const payload = part.output as
        | {
            success?: boolean
            itemCount?: number
            fileName?: string
            message?: string
          }
        | undefined

      if (payload?.success) {
        const itemCount = payload.itemCount ?? 0
        const fileName = payload.fileName ?? "the uploaded file"
        text = `Imported ${itemCount} feedback items from ${fileName}.`
      } else if (payload?.message) {
        text = ensureSentence(payload.message)
      }
    }

    if (
      part.toolName === "askStructuredQuestions" &&
      (part.state === "input-available" || part.state === "output-available")
    ) {
      text =
        "Before I run analysis, I need a bit more context. Please answer these questions."
    }

    if (
      part.toolName === "updateReadinessScore" &&
      part.state === "output-available"
    ) {
      const payload = part.output as { score?: number } | undefined
      if (typeof payload?.score === "number" && payload.score >= 50) {
        text =
          "This feedback is ready for analysis. Use Run Analysis below to start."
      }
    }

    if (!text || seenTexts.has(text)) continue
    seenTexts.add(text)
    narration.push(text)
  }

  return narration
}

export function getReasoningParts(parts: MessagePart[]): ReasoningPart[] {
  return parts.filter((part): part is ReasoningPart => part.type === "reasoning")
}

export function synthesizePartsFromLegacy(
  content: string,
  toolResultJson?: unknown[] | null,
  toolCallsJson?: unknown[] | null
): MessagePart[] {
  return normalizeLegacyMessageParts(content, toolResultJson, toolCallsJson)
}

export function getToolDisplayName(toolName: string): string {
  switch (toolName) {
    case "processUploadedFile":
      return "Process File"
    case "askStructuredQuestions":
      return "Questions"
    case "updateReadinessScore":
      return "Readiness Score"
    case "getExistingFeedbackContext":
      return "Check Existing Feedback"
    default:
      return toolName
  }
}
