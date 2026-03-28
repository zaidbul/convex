export type IssueStatus =
  | "backlog"
  | "todo"
  | "in-progress"
  | "in-review"
  | "done"
  | "cancelled"

export type IssuePriority = "urgent" | "high" | "medium" | "low" | "none"

export interface User {
  id: string
  name: string
  initials: string
  avatarUrl?: string
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface Issue {
  id: string
  identifier: string
  title: string
  status: IssueStatus
  priority: IssuePriority
  priorityScore: number
  labels: Label[]
  assignees: User[]
  cycleId: string | null
  createdAt: string
  updatedAt: string
}

export interface Cycle {
  id: string
  name: string
  number: number
  startDate: string
  endDate: string
  status: "active" | "upcoming" | "completed"
}

export interface Team {
  id: string
  slug: string
  name: string
  identifier: string
  color: string
}

export interface Workspace {
  id: string
  name: string
}

export type IssueFilter =
  | "all"
  | "active"
  | "backlog"
  | "backlog-not-estimated"
  | "backlog-graded"
  | "recently-added"
