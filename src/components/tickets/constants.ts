import type { IssueStatus, IssuePriority } from "./types"

export const teamColorMap: Record<string, string> = {
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
}

export const labelColorMap: Record<string, string> = {
  blue: "bg-blue-500/15 text-blue-400",
  red: "bg-red-500/15 text-red-400",
  green: "bg-green-500/15 text-green-400",
  purple: "bg-purple-500/15 text-purple-400",
}

export const statusColorMap: Record<IssueStatus, string> = {
  backlog: "bg-on-surface-variant/40",
  todo: "bg-on-surface-variant/60",
  "in-progress": "bg-amber-500",
  "in-review": "bg-purple-500",
  done: "bg-green-500",
  cancelled: "bg-red-500/50",
}

export const statusConfig: Record<IssueStatus, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "bg-muted-foreground/40" },
  todo: { label: "Todo", color: "bg-muted-foreground/60" },
  "in-progress": { label: "In Progress", color: "bg-amber-500" },
  "in-review": { label: "In Review", color: "bg-purple-500" },
  done: { label: "Done", color: "bg-green-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500/50" },
}

export const priorityConfig: Record<IssuePriority, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: "text-red-500" },
  high: { label: "High", color: "text-orange-500" },
  medium: { label: "Medium", color: "text-amber-500" },
  low: { label: "Low", color: "text-blue-500" },
  none: { label: "None", color: "text-muted-foreground" },
}
