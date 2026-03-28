import type { IssueStatus } from "./types"

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
