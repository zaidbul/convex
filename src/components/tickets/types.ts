import type { issueStatuses, issuePriorities, cycleStatuses } from "@/db/schema"

export type IssueStatus = (typeof issueStatuses)[number]

export type IssuePriority = (typeof issuePriorities)[number]

export type CycleStatus = (typeof cycleStatuses)[number]

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

export interface IssueDetail extends Issue {
  description: string | null
  creator: User
}

export interface Cycle {
  id: string
  name: string
  number: number
  startDate: string
  endDate: string
  status: CycleStatus
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
