import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Issue, IssueStatus } from "./types"

const statusColorMap: Record<IssueStatus, string> = {
  backlog: "bg-on-surface-variant/40",
  todo: "bg-on-surface-variant/60",
  "in-progress": "bg-amber-500",
  "in-review": "bg-purple-500",
  done: "bg-green-500",
  cancelled: "bg-red-500/50",
}

const statusRingMap: Record<IssueStatus, string> = {
  backlog: "border-on-surface-variant/30",
  todo: "border-on-surface-variant/50",
  "in-progress": "border-amber-500",
  "in-review": "border-purple-500",
  done: "border-green-500",
  cancelled: "border-red-500/40",
}

const labelColorMap: Record<string, string> = {
  blue: "bg-blue-500/15 text-blue-400",
  red: "bg-red-500/15 text-red-400",
  green: "bg-green-500/15 text-green-400",
  purple: "bg-purple-500/15 text-purple-400",
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const month = date.toLocaleString("en-US", { month: "short" })
  const day = date.getDate()
  const year = date.getFullYear()

  if (Math.abs(year - now.getFullYear()) > 0) {
    return `${month} ${year}`
  }
  return `${month} ${day}`
}

export function IssueRow({ issue }: { issue: Issue }) {
  return (
    <div className="group flex h-11 items-center gap-2 px-4 hover:bg-surface-container/60 transition-colors cursor-pointer">
      {/* Kebab menu - visible on hover */}
      <button className="flex size-5 shrink-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-on-surface">
        <MoreHorizontal className="size-4" strokeWidth={1.5} />
      </button>

      {/* Priority / status indicator */}
      <div className={cn(
        "size-4 shrink-0 rounded-full border-2",
        statusRingMap[issue.status]
      )}>
        {(issue.status === "in-progress" || issue.status === "done") && (
          <div className={cn(
            "size-full rounded-full scale-50",
            statusColorMap[issue.status]
          )} />
        )}
      </div>

      {/* Issue ID */}
      <span className="shrink-0 text-xs text-on-surface-variant font-mono w-16">
        {issue.identifier}
      </span>

      {/* Status dot */}
      <span className={cn(
        "size-2 shrink-0 rounded-full",
        statusColorMap[issue.status]
      )} />

      {/* Title */}
      <span className="min-w-0 flex-1 truncate text-sm text-on-surface">
        {issue.title}
      </span>

      {/* Labels */}
      {issue.labels.length > 0 && (
        <div className="flex items-center gap-1 shrink-0">
          {issue.labels.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className={cn(
                "rounded-full border-0 px-2 py-0 text-[10px] font-medium h-5",
                labelColorMap[label.color] ?? "bg-muted text-muted-foreground"
              )}
            >
              {label.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Priority score */}
      <span className="shrink-0 text-xs text-on-surface-variant tabular-nums w-8 text-right">
        {issue.priorityScore}
      </span>

      {/* Assignees */}
      <div className="flex shrink-0 -space-x-1">
        {issue.assignees.map((user) => (
          <Avatar key={user.id} className="size-5 ring-1 ring-surface-low">
            <AvatarFallback className="text-[8px] bg-surface-high text-on-surface-variant font-medium">
              {user.initials}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>

      {/* Date */}
      <span className="shrink-0 text-xs text-on-surface-variant tabular-nums w-16 text-right">
        {formatDate(issue.createdAt)}
      </span>
    </div>
  )
}
