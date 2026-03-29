import type {
  cycleStatuses,
  feedbackChatStatuses,
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

export type FeedbackImportKind =
  | "paste"
  | "txt"
  | "md"
  | "csv"
  | "json"

export type FeedbackItemSeverity = "low" | "medium" | "high"
export type FeedbackSuggestionStatus =
  | "new"
  | "reviewing"
  | "accepted"
  | "issue_created"
  | "dismissed"

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

export interface FeedbackImport {
  id: string
  kind: FeedbackImportKind
  sourceName: string
  sourceDescription: string | null
  itemCount: number
  createdAt: string
  updatedAt: string
}

export interface FeedbackItem {
  id: string
  importId: string
  importSourceName: string
  title: string | null
  summary: string | null
  featureArea: string | null
  problemType: string | null
  severity: FeedbackItemSeverity | null
  requestedCapability: string | null
  suggestedTeam: Team | null
  tags: string[]
  analyzedAt: string | null
  createdAt: string
}

export interface FeedbackCluster {
  id: string
  title: string
  featureArea: string | null
  problemType: string | null
  suggestedTeam: Team | null
  signalCount: number
  confidence: number
  impactScore: number
  lastAnalyzedAt: string
}

export interface FeedbackSuggestion {
  id: string
  clusterId: string
  title: string
  summary: string
  proposedSolution: string
  aiRationale: string | null
  status: FeedbackSuggestionStatus
  suggestedTeam: Team | null
  selectedTeam: Team | null
  confidence: number
  impactScore: number
  evidenceCount: number
  sourceDiversity: number
  priorityScore: number
  issueId: string | null
  updatedAt: string
}

export interface FeedbackSuggestionDetail extends FeedbackSuggestion {
  cluster: FeedbackCluster | null
  evidence: Array<{
    id: string
    importSourceName: string
    title: string | null
    summary: string | null
    originalText: string
    createdAt: string
  }>
}

export type IssueFilter =
  | "all"
  | "active"
  | "backlog"
  | "backlog-not-estimated"
  | "backlog-graded"
  | "recently-added"
  | "my-issues"

// ── Feedback Chat types ────────────────────────────────────────────

export type FeedbackChatStatus = (typeof feedbackChatStatuses)[number]

export interface FeedbackChatRecord {
  id: string
  title: string | null
  status: FeedbackChatStatus
  readinessScore: number
  linkedImportIds: string[]
  createdAt: string
  updatedAt: string
}

export interface FeedbackChatMessageRecord {
  id: string
  chatId: string
  role: "user" | "assistant" | "system"
  content: string
  toolCallsJson: unknown[] | null
  toolResultJson: unknown | null
  attachmentsJson: Array<{
    id: string
    fileName: string
    fileType: string
    fileSize: number
  }> | null
  messageIndex: number
  createdAt: string
}

export interface FeedbackChatAttachmentRecord {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  importId: string | null
  processedAt: string | null
}
