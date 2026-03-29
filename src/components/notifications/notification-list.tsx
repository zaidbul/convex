import { formatDistanceToNow } from "date-fns"
import { Bell, CheckCircle2, Flame, MessageSquare, UserRoundPlus, Workflow } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NotificationListItem } from "@/server/functions/notifications-data"

export type NotificationItem = NotificationListItem

export const notificationTypeOptions = [
  { value: "all", label: "All" },
  { value: "assignment", label: "Assignments" },
  { value: "status", label: "Status" },
  { value: "comment", label: "Comments" },
  { value: "mention", label: "Mentions" },
  { value: "cycle", label: "Cycles" },
] as const

function getNotificationTypeLabel(type: NotificationItem["type"]): string {
  switch (type) {
    case "issue_assigned":
      return "Assignment"
    case "issue_status_changed":
      return "Status"
    case "issue_commented":
      return "Comment"
    case "issue_mentioned":
      return "Mention"
    case "cycle_started":
      return "Cycle start"
    case "cycle_completed":
      return "Cycle done"
  }
}

function getNotificationIcon(type: NotificationItem["type"]) {
  switch (type) {
    case "issue_assigned":
      return UserRoundPlus
    case "issue_status_changed":
      return Workflow
    case "issue_commented":
      return MessageSquare
    case "issue_mentioned":
      return Bell
    case "cycle_started":
    case "cycle_completed":
      return Flame
  }
}

function NotificationRow({
  notification,
  compact = false,
  onSelect,
  onMarkAsRead,
}: {
  notification: NotificationItem
  compact?: boolean
  onSelect: (notification: NotificationItem) => void
  onMarkAsRead?: (notificationId: string) => void
}) {
  const Icon = getNotificationIcon(notification.type)
  const actorName = notification.actor?.name ?? "System"
  const timestamp = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  })

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border border-outline-variant/10 bg-surface px-3 py-3 text-left transition-colors hover:bg-accent/35",
        !notification.readAt && "border-primary/20 bg-primary/5",
        compact && "rounded-lg px-3 py-2.5",
      )}
    >
      <div className="relative shrink-0">
        <Avatar className={cn(compact ? "size-8" : "size-9")}>
          <AvatarImage src={notification.actor?.avatarUrl} />
          <AvatarFallback className="text-[10px]">
            {notification.actor?.initials ?? "SY"}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -right-1 -bottom-1 rounded-full border border-background bg-background p-1">
          <Icon className="size-3 text-muted-foreground" strokeWidth={1.75} />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate text-sm",
                notification.readAt ? "text-foreground" : "font-medium text-foreground",
              )}
            >
              {notification.title}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {actorName}
              {notification.body ? ` · ${notification.body}` : ""}
            </p>
          </div>
          {!notification.readAt && (
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>

        {!compact && notification.metadata.commentPreview && (
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
            {notification.metadata.commentPreview}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className="rounded-full text-[10px]">
            {getNotificationTypeLabel(notification.type)}
          </Badge>
          <span className="text-[11px] text-muted-foreground">{timestamp}</span>
        </div>
      </div>

      {!compact && !notification.readAt && onMarkAsRead && (
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={(event) => {
            event.stopPropagation()
            onMarkAsRead(notification.id)
          }}
          title="Mark as read"
        >
          <CheckCircle2 className="size-4" />
        </Button>
      )}
    </button>
  )
}

export function NotificationList({
  notifications,
  compact = false,
  emptyMessage,
  onSelect,
  onMarkAsRead,
}: {
  notifications: NotificationItem[]
  compact?: boolean
  emptyMessage: string
  onSelect: (notification: NotificationItem) => void
  onMarkAsRead?: (notificationId: string) => void
}) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant/20 px-4 py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      {notifications.map((notification) => (
        <NotificationRow
          key={notification.id}
          notification={notification}
          compact={compact}
          onSelect={onSelect}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  )
}
