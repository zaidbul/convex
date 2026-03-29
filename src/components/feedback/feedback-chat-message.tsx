import { Bot, User, FileText, CheckCircle2, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant" | "system"
  content: string
  toolResultJson?: unknown | null
  attachmentsJson?: Array<{
    id: string
    fileName: string
    fileType: string
    fileSize: number
  }> | null
  isStreaming?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ToolResultBadges({ results }: { results: unknown[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {results.map((result, i) => {
        const r = result as { toolName?: string; result?: unknown }
        if (!r.toolName) return null

        if (r.toolName === "processUploadedFile") {
          const res = r.result as { success?: boolean; fileName?: string; itemCount?: number } | undefined
          return (
            <Badge key={i} variant="secondary" className="gap-1 text-xs">
              <CheckCircle2 className="size-3 text-emerald-500" />
              {res?.fileName ?? "File"}: {res?.itemCount ?? 0} items imported
            </Badge>
          )
        }

        if (r.toolName === "updateReadinessScore") {
          const res = r.result as { score?: number; reason?: string } | undefined
          return (
            <Badge key={i} variant="outline" className="gap-1 text-xs">
              Readiness: {res?.score ?? 0}%
            </Badge>
          )
        }

        if (r.toolName === "askStructuredQuestions") {
          return (
            <Badge key={i} variant="outline" className="gap-1 text-xs">
              <HelpCircle className="size-3" />
              Questions asked
            </Badge>
          )
        }

        return null
      })}
    </div>
  )
}

export function FeedbackChatMessage({
  role,
  content,
  toolResultJson,
  attachmentsJson,
  isStreaming,
}: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
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

      <div
        className={cn(
          "max-w-[80%] space-y-1",
          isUser ? "items-end" : "items-start"
        )}
      >
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
        {content && (
          <div
            className={cn(
              "rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            <p className="whitespace-pre-wrap">{content}</p>
            {isStreaming && (
              <span className="ml-1 inline-block size-1.5 animate-pulse rounded-full bg-current" />
            )}
          </div>
        )}

        {/* Tool results */}
        {Array.isArray(toolResultJson) && toolResultJson.length > 0 ? (
          <ToolResultBadges results={toolResultJson as Record<string, unknown>[]} />
        ) : null}
      </div>
    </div>
  )
}
