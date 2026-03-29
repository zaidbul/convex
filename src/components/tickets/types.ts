import type {
  cycleStatuses,
  issueActivityTypes,
  issuePriorities,
  issueStatuses,
} from "@/db/schema"

export type IssueStatus = (typeof issueStatuses)[number]

export type IssuePriority = (typeof issuePriorities)[number]

export type CycleStatus = (typeof cycleStatuses)[number]
export type IssueActivityType = (typeof issueActivityTypes)[number]

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
  dueDate: string | null
  createdAt: string
  updatedAt: string
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

export interface IssueDetail extends Issue {
  description: string | null
  creator: User
  teamId: string
  completedAt: string | null
  cancelledAt: string | null
}

export interface ActivityEntry {
  id: string
  type: IssueActivityType
  actor: User | null
  data: Record<string, string | number | boolean | null | string[]>
  createdAt: string
}

export interface IssueCommentDetail {
  id: string
  author: User
  body: string
  createdAt: string
  updatedAt: string
}

export type FilterLogic = "and" | "or"

export interface IssueAdvancedFilters {
  logic: FilterLogic
  statuses: IssueStatus[]
  priorities: IssuePriority[]
  assigneeIds: string[]
  labelIds: string[]
  cycleIds: string[]
  dueFrom?: string
  dueTo?: string
}

export interface IssueQueryFilters {
  presetFilter?: IssueFilter
  advancedFilters?: IssueAdvancedFilters
}

export interface SavedView {
  id: string
  name: string
  teamId: string
  teamSlug: string
  teamName: string
  teamColor: string
  createdAt: string
  updatedAt: string
  presetFilter?: IssueFilter
  advancedFilters?: IssueAdvancedFilters
}

export type IssueFilter =
  | "all"
  | "active"
  | "backlog"
  | "backlog-not-estimated"
  | "backlog-graded"
  | "recently-added"
  | "my-issues"
