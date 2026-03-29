import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FeedbackChatRecord } from "@/components/tickets/types"

interface FeedbackChatHistoryProps {
  chats: FeedbackChatRecord[]
  activeChatId: string | null
  onSelect: (chatId: string) => void
  onDelete: (chatId: string) => void
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "Active", variant: "outline" },
  ready: { label: "Ready", variant: "secondary" },
  analysis_triggered: { label: "Analyzing", variant: "default" },
  completed: { label: "Done", variant: "secondary" },
}

export function FeedbackChatHistory({
  chats,
  activeChatId,
  onSelect,
  onDelete,
}: FeedbackChatHistoryProps) {
  if (chats.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No previous chat sessions
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {chats.map((chat) => {
        const isActive = chat.id === activeChatId
        const statusInfo = statusLabels[chat.status] ?? statusLabels.active

        return (
          <button
            key={chat.id}
            type="button"
            onClick={() => onSelect(chat.id)}
            className={cn(
              "group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">
                {chat.title || "Untitled chat"}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {formatDistanceToNow(new Date(chat.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <Badge variant={statusInfo.variant} className="px-1 py-0 text-[10px]">
                  {statusInfo.label}
                </Badge>
                {chat.readinessScore > 0 && (
                  <span className="tabular-nums">{chat.readinessScore}%</span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(chat.id)
              }}
            >
              <Trash2 className="size-3 text-muted-foreground" />
            </Button>
          </button>
        )
      })}
    </div>
  )
}
