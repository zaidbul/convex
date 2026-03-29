import { memo, useMemo } from "react"
import { Bot, User, FileText, Lightbulb } from "lucide-react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  type MessagePart,
  synthesizePartsFromLegacy,
} from "./feedback-chat-types"
import { FeedbackToolRenderer } from "./tools/feedback-tool-renderer"
import type { AskQuestionsOutput } from "./tools/ask-questions-tool"

// --- Types ---

interface ChatMessageProps {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  partsJson?: unknown[] | null
  toolCallsJson?: unknown[] | null
  toolResultJson?: unknown | null
  attachmentsJson?: Array<{
    id: string
    fileName: string
    fileType: string
    fileSize: number
  }> | null
  isStreaming?: boolean
  onToolOutput?: (toolCallId: string, output: AskQuestionsOutput) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// --- Parts Renderer ---

function MessagePartsRenderer({
  parts,
  isStreaming,
  onToolOutput,
}: {
  parts: MessagePart[]
  isStreaming?: boolean
  onToolOutput?: (toolCallId: string, output: AskQuestionsOutput) => void
}) {
  // Group tool-call and tool-result parts by toolCallId for paired rendering
  const toolCallMap = useMemo(() => {
    const map = new Map<string, { call?: MessagePart; result?: MessagePart }>()
    for (const part of parts) {
      if (part.type === "tool-call" && part.toolCallId) {
        const entry = map.get(part.toolCallId) ?? {}
        entry.call = part
        map.set(part.toolCallId, entry)
      }
      if (part.type === "tool-result" && part.toolCallId) {
        const entry = map.get(part.toolCallId) ?? {}
        entry.result = part
        map.set(part.toolCallId, entry)
      }
    }
    return map
  }, [parts])

  // Track which toolCallIds we've already rendered
  const renderedToolCallIds = new Set<string>()

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        // Text parts — render with Markdown
        if (part.type === "text") {
          const text = part.text?.trim()
          if (!text) return null
          return (
            <div
              key={`text-${index}`}
              className="prose prose-sm dark:prose-invert max-w-none break-words prose-p:my-1 prose-p:leading-relaxed"
            >
              <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
              {isStreaming && index === parts.length - 1 && (
                <span className="ml-1 inline-block size-1.5 animate-pulse rounded-full bg-current" />
              )}
            </div>
          )
        }

        // Reasoning parts — lightbulb + amber italic
        if (part.type === "reasoning") {
          const reasoningText = part.text ?? ""
          if (!reasoningText) return null
          return (
            <div
              key={`reasoning-${index}`}
              className="flex items-start gap-2 py-1.5 text-sm text-amber-600 dark:text-amber-400"
            >
              <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
              <span className="italic">{reasoningText}</span>
            </div>
          )
        }

        // Tool-call parts — render paired with their result
        if (part.type === "tool-call" && part.toolCallId) {
          if (renderedToolCallIds.has(part.toolCallId)) return null
          renderedToolCallIds.add(part.toolCallId)

          const pair = toolCallMap.get(part.toolCallId)
          return (
            <FeedbackToolRenderer
              key={part.toolCallId}
              callPart={pair?.call}
              resultPart={pair?.result}
              onToolOutput={onToolOutput}
            />
          )
        }

        // Tool-result parts — render only if we haven't already rendered them via their call
        if (part.type === "tool-result" && part.toolCallId) {
          if (renderedToolCallIds.has(part.toolCallId)) return null
          renderedToolCallIds.add(part.toolCallId)

          const pair = toolCallMap.get(part.toolCallId)
          return (
            <FeedbackToolRenderer
              key={part.toolCallId}
              callPart={pair?.call}
              resultPart={pair?.result}
              onToolOutput={onToolOutput}
            />
          )
        }

        return null
      })}
    </div>
  )
}

// --- Main Component ---

function FeedbackChatMessageInner({
  role,
  content,
  partsJson,
  toolCallsJson,
  toolResultJson,
  attachmentsJson,
  isStreaming,
  onToolOutput,
}: ChatMessageProps) {
  const isUser = role === "user"

  // Use partsJson if available, otherwise synthesize from legacy fields
  const parts: MessagePart[] = useMemo(() => {
    if (partsJson && Array.isArray(partsJson) && partsJson.length > 0) {
      return partsJson as MessagePart[]
    }
    return synthesizePartsFromLegacy(
      content,
      toolResultJson as unknown[] | null | undefined,
      toolCallsJson
    )
  }, [partsJson, content, toolResultJson, toolCallsJson])

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full border",
          isUser
            ? "border-primary/20 bg-primary/10"
            : "border-muted-foreground/20 bg-muted"
        )}
      >
        {isUser ? (
          <User className="size-3.5 text-primary" />
        ) : (
          <Bot className="size-3.5 text-muted-foreground" />
        )}
      </div>

      <div className={cn("max-w-[85%] space-y-1", isUser ? "items-end" : "items-start")}>
        {/* Attachments */}
        {attachmentsJson && attachmentsJson.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-1">
            {attachmentsJson.map((att) => (
              <Badge key={att.id} variant="secondary" className="gap-1 text-xs">
                <FileText className="size-3" />
                {att.fileName}
                <span className="text-muted-foreground">
                  ({formatFileSize(att.fileSize)})
                </span>
              </Badge>
            ))}
          </div>
        )}

        {/* Message content */}
        {isUser ? (
          // User messages: bubble style
          <div className="rounded-xl bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-primary-foreground">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        ) : (
          // Assistant messages: flat layout with parts renderer
          <div className="text-sm">
            <MessagePartsRenderer
              parts={parts}
              isStreaming={isStreaming}
              onToolOutput={onToolOutput}
            />
            {/* Streaming indicator when no content yet */}
            {isStreaming && parts.length === 0 && (
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-muted-foreground" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const FeedbackChatMessage = memo(FeedbackChatMessageInner)
