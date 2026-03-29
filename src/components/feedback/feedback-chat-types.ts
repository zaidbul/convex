// Shared types and helpers for the feedback chat message parts system

export type MessagePart = {
  type: string
  text?: string
  toolName?: string
  toolCallId?: string
  state?: string
  input?: unknown
  output?: unknown
  args?: unknown
  result?: unknown
}

export type ReasoningPart = {
  type: "reasoning"
  text?: string
}

export type ToolPart = MessagePart & {
  toolName: string
  toolCallId: string
}

/** Extract all text content from message parts */
export function formatMessageContent(parts: MessagePart[]): string {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("\n")
}

/** Get all tool-related parts (tool-call, tool-result, or tool-* prefixed) */
export function getToolParts(parts: MessagePart[]): ToolPart[] {
  return parts.filter(
    (p) => p.type === "tool-call" || p.type === "tool-result" || p.type.startsWith("tool-")
  ) as ToolPart[]
}

/** Get reasoning/thinking parts */
export function getReasoningParts(parts: MessagePart[]): ReasoningPart[] {
  return parts.filter((p) => p.type === "reasoning") as ReasoningPart[]
}

/**
 * Synthesize a parts array from legacy message data (messages without partsJson).
 * This ensures old messages render correctly with the new parts-based renderer.
 */
export function synthesizePartsFromLegacy(
  content: string,
  toolResultJson?: unknown[] | null,
  toolCallsJson?: unknown[] | null
): MessagePart[] {
  const parts: MessagePart[] = []

  if (content) {
    parts.push({ type: "text", text: content })
  }

  // Add tool calls as parts
  if (Array.isArray(toolCallsJson)) {
    for (const tc of toolCallsJson) {
      const typed = tc as { toolName?: string; args?: unknown; toolCallId?: string }
      if (typed.toolName) {
        parts.push({
          type: "tool-call",
          toolName: typed.toolName,
          toolCallId: typed.toolCallId ?? `legacy-${typed.toolName}`,
          args: typed.args,
          state: "output-available",
        })
      }
    }
  }

  // Add tool results as parts
  if (Array.isArray(toolResultJson)) {
    for (const tr of toolResultJson) {
      const typed = tr as { toolName?: string; result?: unknown; toolCallId?: string }
      if (typed.toolName) {
        parts.push({
          type: "tool-result",
          toolName: typed.toolName,
          toolCallId: typed.toolCallId ?? `legacy-${typed.toolName}`,
          result: typed.result,
          state: "output-available",
        })
      }
    }
  }

  return parts
}

/** Display-friendly name for a tool */
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
