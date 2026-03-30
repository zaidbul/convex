import type {
  ActivityEntry,
  CycleStatus,
  Cycle as TicketCycle,
  Issue as TicketIssue,
  IssueCommentDetail,
  IssueDetail as TicketIssueDetail,
  IssueAdvancedFilters,
  IssueFilter,
  IssuePriority,
  IssueQueryFilters,
  IssueStatus,
  Label as TicketLabel,
  SavedView as TicketSavedView,
  Team as TicketTeam,
  User as TicketUser,
  Workspace as TicketWorkspace,
} from "@/components/tickets/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TicketsDatabase = any

export type SyncedViewerInput = {
  auth: {
    userId: string
    orgId: string | null
    orgRole: string | null
    orgSlug: string | null
  }
  clerkUser: {
    id: string
    firstName: string | null
    lastName: string | null
    username?: string | null
    imageUrl?: string | null
    emailAddresses?: Array<{ emailAddress?: string | null }>
  }
  organization: {
    id: string
    name: string
    slug: string | null
  } | null
}

export type ViewerContext = {
  userId: string
  workspaceId: string | null
}

export type CrossTeamIssue = TicketIssue & { teamSlug: string }

export type ActiveCycleWithProgress = {
  cycle: TicketCycle
  teamName: string
  teamSlug: string
  totalIssues: number
  completedIssues: number
}

// ── Mock Constants ──────────────────────────────────────────────────

const WORKSPACE_ID = "demo-workspace-001"
const DEMO_USER_ID = "demo-user-001"

function nowIso(): string {
  return new Date().toISOString()
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

// ── Mock Users ──────────────────────────────────────────────────────

const MOCK_USERS: TicketUser[] = [
  { id: "demo-user-001", name: "Alex Chen", initials: "AC", avatarUrl: undefined },
  { id: "demo-user-002", name: "Jordan Rivera", initials: "JR", avatarUrl: undefined },
  { id: "demo-user-003", name: "Sam Taylor", initials: "ST", avatarUrl: undefined },
  { id: "demo-user-004", name: "Morgan Lee", initials: "ML", avatarUrl: undefined },
]

// ── Mock Teams ──────────────────────────────────────────────────────

const MOCK_TEAMS: TicketTeam[] = [
  { id: "team-eng-001", slug: "engineering", name: "Engineering", identifier: "ENG", color: "#6366f1" },
  { id: "team-des-001", slug: "design", name: "Design", identifier: "DES", color: "#ec4899" },
  { id: "team-prd-001", slug: "product", name: "Product", identifier: "PRD", color: "#f59e0b" },
]

// ── Mock Labels ─────────────────────────────────────────────────────

const MOCK_LABELS: TicketLabel[] = [
  { id: "label-001", name: "Bug", color: "#ef4444" },
  { id: "label-002", name: "Feature", color: "#3b82f6" },
  { id: "label-003", name: "Improvement", color: "#10b981" },
  { id: "label-004", name: "Documentation", color: "#8b5cf6" },
  { id: "label-005", name: "Performance", color: "#f97316" },
  { id: "label-006", name: "Security", color: "#dc2626" },
]

// ── Mock Cycles ─────────────────────────────────────────────────────

const MOCK_CYCLES: (TicketCycle & { teamId: string })[] = [
  // Engineering cycles
  { id: "cycle-eng-1", name: "Sprint 12", number: 12, startDate: daysAgo(21), endDate: daysAgo(7), status: "completed", teamId: "team-eng-001" },
  { id: "cycle-eng-2", name: "Sprint 13", number: 13, startDate: daysAgo(7), endDate: daysFromNow(7), status: "active", teamId: "team-eng-001" },
  { id: "cycle-eng-3", name: "Sprint 14", number: 14, startDate: daysFromNow(7), endDate: daysFromNow(21), status: "upcoming", teamId: "team-eng-001" },
  // Design cycles
  { id: "cycle-des-1", name: "Design Sprint 6", number: 6, startDate: daysAgo(14), endDate: daysAgo(1), status: "completed", teamId: "team-des-001" },
  { id: "cycle-des-2", name: "Design Sprint 7", number: 7, startDate: daysAgo(1), endDate: daysFromNow(13), status: "active", teamId: "team-des-001" },
  { id: "cycle-des-3", name: "Design Sprint 8", number: 8, startDate: daysFromNow(14), endDate: daysFromNow(28), status: "upcoming", teamId: "team-des-001" },
  // Product cycles
  { id: "cycle-prd-1", name: "Q1 Planning", number: 1, startDate: daysAgo(30), endDate: daysAgo(5), status: "completed", teamId: "team-prd-001" },
  { id: "cycle-prd-2", name: "Q2 Planning", number: 2, startDate: daysAgo(5), endDate: daysFromNow(25), status: "active", teamId: "team-prd-001" },
  { id: "cycle-prd-3", name: "Q3 Planning", number: 3, startDate: daysFromNow(25), endDate: daysFromNow(55), status: "upcoming", teamId: "team-prd-001" },
]

// ── Mock Issues ─────────────────────────────────────────────────────

type MockIssueRow = TicketIssue & { teamId: string; description: string | null; creatorUserId: string; completedAt: string | null; cancelledAt: string | null }

const MOCK_ISSUES: MockIssueRow[] = [
  // Engineering issues
  {
    id: "issue-001", identifier: "ENG-101", title: "Fix authentication race condition on session refresh",
    status: "in-progress", priority: "urgent", priorityScore: 4,
    labels: [MOCK_LABELS[0]!, MOCK_LABELS[5]!],
    assignees: [MOCK_USERS[0]!], cycleId: "cycle-eng-2", dueDate: daysFromNow(3),
    createdAt: daysAgo(5), updatedAt: daysAgo(1),
    teamId: "team-eng-001", description: "Users are experiencing intermittent logouts when their session token refreshes. The race condition occurs between the token refresh request and ongoing API calls.", creatorUserId: DEMO_USER_ID, completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-002", identifier: "ENG-102", title: "Implement real-time notifications via WebSocket",
    status: "todo", priority: "high", priorityScore: 3,
    labels: [MOCK_LABELS[1]!],
    assignees: [MOCK_USERS[1]!], cycleId: "cycle-eng-2", dueDate: daysFromNow(10),
    createdAt: daysAgo(4), updatedAt: daysAgo(2),
    teamId: "team-eng-001", description: "Replace polling-based notification system with WebSocket connections for real-time updates.", creatorUserId: "demo-user-002", completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-003", identifier: "ENG-103", title: "Optimize database queries for issue listing page",
    status: "in-review", priority: "high", priorityScore: 3,
    labels: [MOCK_LABELS[4]!],
    assignees: [MOCK_USERS[2]!], cycleId: "cycle-eng-2", dueDate: null,
    createdAt: daysAgo(8), updatedAt: daysAgo(1),
    teamId: "team-eng-001", description: "The issue listing page takes 2+ seconds to load for workspaces with >1000 issues. Need to add proper indices and pagination.", creatorUserId: "demo-user-003", completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-004", identifier: "ENG-104", title: "Add CSV export for issue data",
    status: "backlog", priority: "medium", priorityScore: 2,
    labels: [MOCK_LABELS[1]!],
    assignees: [], cycleId: null, dueDate: null,
    createdAt: daysAgo(12), updatedAt: daysAgo(12),
    teamId: "team-eng-001", description: "Allow users to export filtered issue lists as CSV files.", creatorUserId: DEMO_USER_ID, completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-005", identifier: "ENG-105", title: "Migrate to edge runtime for API routes",
    status: "backlog", priority: "low", priorityScore: 1,
    labels: [MOCK_LABELS[4]!, MOCK_LABELS[2]!],
    assignees: [], cycleId: null, dueDate: null,
    createdAt: daysAgo(20), updatedAt: daysAgo(15),
    teamId: "team-eng-001", description: null, creatorUserId: "demo-user-002", completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-006", identifier: "ENG-106", title: "Set up end-to-end test suite with Playwright",
    status: "done", priority: "high", priorityScore: 3,
    labels: [MOCK_LABELS[2]!],
    assignees: [MOCK_USERS[0]!], cycleId: "cycle-eng-1", dueDate: daysAgo(8),
    createdAt: daysAgo(25), updatedAt: daysAgo(7),
    teamId: "team-eng-001", description: "Created E2E tests covering the main user flows: login, issue creation, status changes, and search.", creatorUserId: DEMO_USER_ID, completedAt: daysAgo(7), cancelledAt: null,
  },
  {
    id: "issue-007", identifier: "ENG-107", title: "Fix memory leak in dashboard polling",
    status: "done", priority: "urgent", priorityScore: 4,
    labels: [MOCK_LABELS[0]!, MOCK_LABELS[4]!],
    assignees: [MOCK_USERS[2]!], cycleId: "cycle-eng-1", dueDate: daysAgo(10),
    createdAt: daysAgo(18), updatedAt: daysAgo(9),
    teamId: "team-eng-001", description: "Dashboard polling interval was not being cleared on component unmount.", creatorUserId: "demo-user-003", completedAt: daysAgo(9), cancelledAt: null,
  },
  // Design issues
  {
    id: "issue-008", identifier: "DES-201", title: "Redesign issue detail panel with improved hierarchy",
    status: "in-progress", priority: "high", priorityScore: 3,
    labels: [MOCK_LABELS[2]!],
    assignees: [MOCK_USERS[3]!], cycleId: "cycle-des-2", dueDate: daysFromNow(5),
    createdAt: daysAgo(6), updatedAt: daysAgo(1),
    teamId: "team-des-001", description: "The current issue detail panel has too many competing visual elements. Redesign with clearer content hierarchy and better use of whitespace.", creatorUserId: "demo-user-004", completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-009", identifier: "DES-202", title: "Create dark mode color tokens",
    status: "todo", priority: "medium", priorityScore: 2,
    labels: [MOCK_LABELS[1]!],
    assignees: [MOCK_USERS[3]!], cycleId: "cycle-des-2", dueDate: daysFromNow(12),
    createdAt: daysAgo(3), updatedAt: daysAgo(3),
    teamId: "team-des-001", description: "Define a complete set of dark mode color tokens that map to our existing light mode design system.", creatorUserId: "demo-user-004", completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-010", identifier: "DES-203", title: "Design onboarding flow for new workspaces",
    status: "backlog", priority: "medium", priorityScore: 2,
    labels: [MOCK_LABELS[1]!],
    assignees: [], cycleId: null, dueDate: null,
    createdAt: daysAgo(10), updatedAt: daysAgo(10),
    teamId: "team-des-001", description: null, creatorUserId: "demo-user-004", completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-011", identifier: "DES-204", title: "Update component library documentation",
    status: "done", priority: "low", priorityScore: 1,
    labels: [MOCK_LABELS[3]!],
    assignees: [MOCK_USERS[3]!], cycleId: "cycle-des-1", dueDate: daysAgo(2),
    createdAt: daysAgo(15), updatedAt: daysAgo(2),
    teamId: "team-des-001", description: "Updated Storybook with latest component variants and usage examples.", creatorUserId: "demo-user-004", completedAt: daysAgo(2), cancelledAt: null,
  },
  // Product issues
  {
    id: "issue-012", identifier: "PRD-301", title: "Write PRD for feedback analysis feature",
    status: "in-progress", priority: "high", priorityScore: 3,
    labels: [MOCK_LABELS[3]!, MOCK_LABELS[1]!],
    assignees: [MOCK_USERS[1]!], cycleId: "cycle-prd-2", dueDate: daysFromNow(7),
    createdAt: daysAgo(4), updatedAt: daysAgo(1),
    teamId: "team-prd-001", description: "Document the product requirements for the AI-powered feedback analysis and clustering feature.", creatorUserId: "demo-user-002", completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-013", identifier: "PRD-302", title: "Conduct user interviews for cycle planning UX",
    status: "todo", priority: "medium", priorityScore: 2,
    labels: [],
    assignees: [MOCK_USERS[1]!], cycleId: "cycle-prd-2", dueDate: daysFromNow(14),
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
    teamId: "team-prd-001", description: "Interview 5-8 users about their experience with sprint/cycle planning in the tool.", creatorUserId: "demo-user-002", completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-014", identifier: "PRD-303", title: "Define success metrics for notification system",
    status: "backlog", priority: "low", priorityScore: 1,
    labels: [MOCK_LABELS[3]!],
    assignees: [], cycleId: null, dueDate: null,
    createdAt: daysAgo(9), updatedAt: daysAgo(9),
    teamId: "team-prd-001", description: null, creatorUserId: "demo-user-002", completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-015", identifier: "PRD-304", title: "Competitive analysis: Linear vs Jira vs Shortcut",
    status: "done", priority: "medium", priorityScore: 2,
    labels: [MOCK_LABELS[3]!],
    assignees: [MOCK_USERS[0]!], cycleId: "cycle-prd-1", dueDate: daysAgo(6),
    createdAt: daysAgo(28), updatedAt: daysAgo(6),
    teamId: "team-prd-001", description: "Completed analysis comparing feature sets, pricing, and UX patterns across major project management tools.", creatorUserId: DEMO_USER_ID, completedAt: daysAgo(6), cancelledAt: null,
  },
  {
    id: "issue-016", identifier: "ENG-108", title: "Add rate limiting to public API endpoints",
    status: "todo", priority: "high", priorityScore: 3,
    labels: [MOCK_LABELS[5]!, MOCK_LABELS[2]!],
    assignees: [MOCK_USERS[0]!], cycleId: "cycle-eng-2", dueDate: daysFromNow(5),
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
    teamId: "team-eng-001", description: "Implement token-bucket rate limiting for all public API endpoints to prevent abuse.", creatorUserId: DEMO_USER_ID, completedAt: null, cancelledAt: null,
  },
  {
    id: "issue-017", identifier: "ENG-109", title: "Refactor state management to use TanStack Query",
    status: "cancelled", priority: "medium", priorityScore: 2,
    labels: [MOCK_LABELS[2]!],
    assignees: [MOCK_USERS[2]!], cycleId: "cycle-eng-1", dueDate: null,
    createdAt: daysAgo(22), updatedAt: daysAgo(10),
    teamId: "team-eng-001", description: "Cancelled — already using TanStack Query throughout the app.", creatorUserId: "demo-user-003", completedAt: null, cancelledAt: daysAgo(10),
  },
  {
    id: "issue-018", identifier: "DES-205", title: "Accessibility audit for keyboard navigation",
    status: "todo", priority: "high", priorityScore: 3,
    labels: [MOCK_LABELS[2]!],
    assignees: [MOCK_USERS[3]!], cycleId: "cycle-des-2", dueDate: daysFromNow(8),
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
    teamId: "team-des-001", description: "Audit all interactive components for proper keyboard navigation, focus management, and screen reader support.", creatorUserId: "demo-user-004", completedAt: null, cancelledAt: null,
  },
]

// ── Mock Saved Views ────────────────────────────────────────────────

const MOCK_SAVED_VIEWS: TicketSavedView[] = [
  {
    id: "view-001", name: "My Active Issues", teamId: "team-eng-001",
    teamSlug: "engineering", teamName: "Engineering", teamColor: "#6366f1",
    createdAt: daysAgo(30), updatedAt: daysAgo(1),
    presetFilter: "my-issues",
  },
  {
    id: "view-002", name: "Backlog Triage", teamId: "team-eng-001",
    teamSlug: "engineering", teamName: "Engineering", teamColor: "#6366f1",
    createdAt: daysAgo(20), updatedAt: daysAgo(5),
    presetFilter: "backlog",
  },
  {
    id: "view-003", name: "High Priority", teamId: "team-des-001",
    teamSlug: "design", teamName: "Design", teamColor: "#ec4899",
    createdAt: daysAgo(15), updatedAt: daysAgo(3),
    advancedFilters: { logic: "and", statuses: [], priorities: ["urgent", "high"], assigneeIds: [], labelIds: [], cycleIds: [] },
  },
]

// ── Mock Activity ───────────────────────────────────────────────────

const MOCK_ACTIVITY: Record<string, ActivityEntry[]> = {
  "issue-001": [
    { id: "act-001", type: "created", actor: MOCK_USERS[0]!, data: {}, createdAt: daysAgo(5) },
    { id: "act-002", type: "status_change", actor: MOCK_USERS[0]!, data: { from: "backlog", to: "todo" }, createdAt: daysAgo(4) },
    { id: "act-003", type: "assignee_change", actor: MOCK_USERS[0]!, data: { assigneeUserId: "demo-user-001" }, createdAt: daysAgo(4) },
    { id: "act-004", type: "status_change", actor: MOCK_USERS[0]!, data: { from: "todo", to: "in-progress" }, createdAt: daysAgo(2) },
    { id: "act-005", type: "comment", actor: MOCK_USERS[1]!, data: { commentId: "comment-001" }, createdAt: daysAgo(1) },
  ],
  "issue-002": [
    { id: "act-010", type: "created", actor: MOCK_USERS[1]!, data: {}, createdAt: daysAgo(4) },
    { id: "act-011", type: "priority_change", actor: MOCK_USERS[1]!, data: { from: "medium", to: "high" }, createdAt: daysAgo(3) },
  ],
}

// ── Mock Comments ───────────────────────────────────────────────────

const MOCK_COMMENTS: Record<string, IssueCommentDetail[]> = {
  "issue-001": [
    {
      id: "comment-001", author: MOCK_USERS[1]!,
      body: "I can reproduce this consistently by opening two tabs and letting them both refresh at the same time. The token refresh endpoint returns 401 for the second request.",
      createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: "comment-002", author: MOCK_USERS[0]!,
      body: "Good catch. I think we need to implement a mutex around the token refresh logic so only one request refreshes at a time, and others wait for the result.",
      createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
  ],
  "issue-003": [
    {
      id: "comment-003", author: MOCK_USERS[2]!,
      body: "Added composite index on (workspace_id, team_id, deleted_at, archived_at) - query time dropped from 2.1s to 180ms for the test workspace.",
      createdAt: daysAgo(2), updatedAt: daysAgo(2),
    },
  ],
}

// ── Mock Favorites ──────────────────────────────────────────────────

const MOCK_FAVORITES = new Set(["issue-001", "issue-008"])

// ── Helpers ─────────────────────────────────────────────────────────

function matchesPresetFilter(issue: MockIssueRow, filter: IssueFilter, viewerUserId: string): boolean {
  if (!filter || filter === "all") return true
  if (filter === "active") return ["todo", "in-progress", "in-review"].includes(issue.status)
  if (filter === "backlog") return issue.status === "backlog"
  if (filter === "backlog-not-estimated") return issue.status === "backlog" && issue.priorityScore === 0
  if (filter === "backlog-graded") return issue.status === "backlog" && issue.priorityScore > 0
  if (filter === "recently-added") {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return new Date(issue.createdAt).getTime() > sevenDaysAgo
  }
  if (filter === "my-issues") return issue.assignees.some((a) => a.id === viewerUserId)
  return true
}

function matchesAdvancedFilters(issue: MockIssueRow, filters: IssueAdvancedFilters): boolean {
  const checks: boolean[] = []
  if (filters.statuses.length > 0) checks.push(filters.statuses.includes(issue.status))
  if (filters.priorities.length > 0) checks.push(filters.priorities.includes(issue.priority))
  if (filters.assigneeIds.length > 0) checks.push(issue.assignees.some((a) => filters.assigneeIds.includes(a.id)))
  if (filters.labelIds.length > 0) checks.push(issue.labels.some((l) => filters.labelIds.includes(l.id)))
  if (filters.cycleIds.length > 0) checks.push(filters.cycleIds.includes(issue.cycleId ?? ""))
  if (filters.dueFrom && issue.dueDate) checks.push(issue.dueDate >= filters.dueFrom)
  if (filters.dueTo && issue.dueDate) checks.push(issue.dueDate <= filters.dueTo)
  if (checks.length === 0) return true
  return filters.logic === "or" ? checks.some(Boolean) : checks.every(Boolean)
}

function stripIssueInternals(issue: MockIssueRow): TicketIssue {
  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    status: issue.status,
    priority: issue.priority,
    priorityScore: issue.priorityScore,
    labels: issue.labels,
    assignees: issue.assignees,
    cycleId: issue.cycleId,
    dueDate: issue.dueDate,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  }
}

// ── Exported Functions ──────────────────────────────────────────────

export function mapClerkOrgRoleToWorkspaceRole(
  orgRole: string | null
): "owner" | "admin" | "member" | "guest" {
  switch (orgRole) {
    case "org:owner": return "owner"
    case "org:admin": return "admin"
    case "org:member": return "member"
    default: return "guest"
  }
}

export async function syncViewerContext(
  _db: TicketsDatabase,
  _input: SyncedViewerInput
): Promise<ViewerContext> {
  return { userId: DEMO_USER_ID, workspaceId: WORKSPACE_ID }
}

export async function listTeamsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<TicketTeam[]> {
  return MOCK_TEAMS
}

export async function getWorkspaceForViewer(
  _db: TicketsDatabase,
  context: ViewerContext
): Promise<TicketWorkspace | null> {
  if (!context.workspaceId) return null
  return { id: WORKSPACE_ID, name: "Acme Corp" }
}

export async function getAccessibleTeamBySlug(
  _db: TicketsDatabase,
  _context: ViewerContext,
  teamSlug: string
): Promise<TicketTeam | null> {
  return MOCK_TEAMS.find((t) => t.slug === teamSlug) ?? null
}

export async function listCyclesForViewerTeam(
  _db: TicketsDatabase,
  _context: ViewerContext,
  teamSlug: string
): Promise<TicketCycle[]> {
  const team = MOCK_TEAMS.find((t) => t.slug === teamSlug)
  if (!team) return []
  return MOCK_CYCLES
    .filter((c) => c.teamId === team.id)
    .map(({ teamId: _teamId, ...cycle }) => cycle)
}

export async function listIssuesForViewerTeam(
  _db: TicketsDatabase,
  context: ViewerContext,
  teamSlug: string,
  filters?: IssueQueryFilters
): Promise<TicketIssue[]> {
  const team = MOCK_TEAMS.find((t) => t.slug === teamSlug)
  if (!team) return []

  let issues = MOCK_ISSUES.filter((i) => i.teamId === team.id)

  if (filters?.presetFilter) {
    issues = issues.filter((i) => matchesPresetFilter(i, filters.presetFilter!, context.userId))
  } else if (filters?.advancedFilters) {
    issues = issues.filter((i) => matchesAdvancedFilters(i, filters.advancedFilters!))
  }

  return issues.sort((a, b) => b.priorityScore - a.priorityScore || b.updatedAt.localeCompare(a.updatedAt)).map(stripIssueInternals)
}

export async function createIssueForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  input: {
    teamId: string
    title: string
    description?: string
    status: IssueStatus
    priority: IssuePriority
    dueDate?: string | null
  }
): Promise<{ id: string; identifier: string }> {
  const team = MOCK_TEAMS.find((t) => t.id === input.teamId)
  const identifier = `${team?.identifier ?? "UNK"}-${Math.floor(Math.random() * 900) + 100}`
  const id = `issue-${crypto.randomUUID().slice(0, 8)}`
  return { id, identifier }
}

export async function createCycleForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  input: {
    teamId: string
    name: string
    startDate: string
    endDate: string
  }
): Promise<TicketCycle> {
  return {
    id: `cycle-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    number: 99,
    startDate: input.startDate,
    endDate: input.endDate,
    status: "upcoming",
  }
}

export async function getIssueByIdForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  issueId: string
): Promise<TicketIssueDetail | null> {
  const issue = MOCK_ISSUES.find((i) => i.id === issueId)
  if (!issue) return null

  const creator = MOCK_USERS.find((u) => u.id === issue.creatorUserId) ?? { id: issue.creatorUserId, name: "Unknown", initials: "??" }

  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    priorityScore: issue.priorityScore,
    labels: issue.labels,
    assignees: issue.assignees,
    cycleId: issue.cycleId,
    dueDate: issue.dueDate,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    completedAt: issue.completedAt,
    cancelledAt: issue.cancelledAt,
    creator,
    teamId: issue.teamId,
  }
}

export async function updateIssueDescriptionForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string,
  _description: string
): Promise<void> {
  // no-op in demo mode
}

export async function updateIssueStatusForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string,
  _status: IssueStatus
): Promise<void> {
  // no-op in demo mode
}

export async function updateIssuePriorityForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string,
  _priority: IssuePriority
): Promise<void> {
  // no-op in demo mode
}

export async function updateIssueAssigneeForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string,
  _assigneeUserId: string | null
): Promise<void> {
  // no-op in demo mode
}

export async function updateIssueCycleForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string,
  _cycleId: string | null
): Promise<void> {
  // no-op in demo mode
}

export async function updateIssueDueDateForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string,
  _dueDate: string | null
): Promise<void> {
  // no-op in demo mode
}

export async function updateCycleStatusForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _cycleId: string,
  _status: CycleStatus
): Promise<void> {
  // no-op in demo mode
}

export async function updateIssueLabelsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string,
  _labelIds: string[]
): Promise<void> {
  // no-op in demo mode
}

export async function updateIssueTitleForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string,
  _title: string
): Promise<void> {
  // no-op in demo mode
}

export async function listTeamMembersForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _teamId: string
): Promise<TicketUser[]> {
  return MOCK_USERS
}

export async function listSavedViewsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<TicketSavedView[]> {
  return MOCK_SAVED_VIEWS
}

export async function getSavedViewForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  viewId: string
): Promise<TicketSavedView | null> {
  return MOCK_SAVED_VIEWS.find((v) => v.id === viewId) ?? null
}

export async function createSavedViewForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  input: {
    teamId: string
    name: string
    presetFilter?: IssueFilter
    advancedFilters?: IssueAdvancedFilters
  }
): Promise<TicketSavedView> {
  const team = MOCK_TEAMS.find((t) => t.id === input.teamId)
  const timestamp = nowIso()
  return {
    id: `view-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    teamId: input.teamId,
    teamSlug: team?.slug ?? "unknown",
    teamName: team?.name ?? "Unknown",
    teamColor: team?.color ?? "#888",
    createdAt: timestamp,
    updatedAt: timestamp,
    presetFilter: input.advancedFilters ? undefined : input.presetFilter,
    advancedFilters: input.advancedFilters,
  }
}

export async function updateSavedViewForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  viewId: string,
  updates: {
    name?: string
    presetFilter?: IssueFilter | null
    advancedFilters?: IssueAdvancedFilters | null
  }
): Promise<TicketSavedView> {
  const existing = MOCK_SAVED_VIEWS.find((v) => v.id === viewId)
  if (!existing) throw new Error("Saved view not found")
  return {
    ...existing,
    name: updates.name ?? existing.name,
    presetFilter: updates.advancedFilters ? undefined : (updates.presetFilter ?? existing.presetFilter),
    advancedFilters: updates.advancedFilters ?? existing.advancedFilters,
    updatedAt: nowIso(),
  }
}

export async function deleteSavedViewForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _viewId: string
): Promise<void> {
  // no-op in demo mode
}

export async function listLabelsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<TicketLabel[]> {
  return MOCK_LABELS
}

export async function listIssueActivityForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  issueId: string
): Promise<ActivityEntry[]> {
  return MOCK_ACTIVITY[issueId] ?? [
    { id: `act-default-${issueId}`, type: "created", actor: MOCK_USERS[0]!, data: {}, createdAt: daysAgo(5) },
  ]
}

export async function listIssueCommentsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  issueId: string
): Promise<IssueCommentDetail[]> {
  return MOCK_COMMENTS[issueId] ?? []
}

export async function createIssueCommentForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string,
  _body: string
): Promise<{ id: string }> {
  return { id: `comment-${crypto.randomUUID().slice(0, 8)}` }
}

export async function archiveIssueForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string
): Promise<void> {
  // no-op in demo mode
}

export async function deleteIssueForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _issueId: string
): Promise<void> {
  // no-op in demo mode
}

export async function toggleIssueFavoriteForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  issueId: string
): Promise<{ favorited: boolean }> {
  const wasFavorited = MOCK_FAVORITES.has(issueId)
  return { favorited: !wasFavorited }
}

export async function getIssueFavoriteForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  issueId: string
): Promise<{ favorited: boolean }> {
  return { favorited: MOCK_FAVORITES.has(issueId) }
}

export async function getDashboardStatsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<{ byStatus: Record<string, number>; total: number }> {
  const byStatus: Record<string, number> = {}
  let total = 0
  for (const issue of MOCK_ISSUES) {
    byStatus[issue.status] = (byStatus[issue.status] ?? 0) + 1
    total++
  }
  return { byStatus, total }
}

export async function listMyIssuesAcrossTeams(
  _db: TicketsDatabase,
  context: ViewerContext,
  limit = 20
): Promise<CrossTeamIssue[]> {
  const myIssues = MOCK_ISSUES
    .filter((i) => i.assignees.some((a) => a.id === context.userId))
    .sort((a, b) => b.priorityScore - a.priorityScore || b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)

  return myIssues.map((issue) => {
    const team = MOCK_TEAMS.find((t) => t.id === issue.teamId)
    return {
      ...stripIssueInternals(issue),
      teamSlug: team?.slug ?? "unknown",
    }
  })
}

export async function listActiveCyclesAcrossTeams(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<ActiveCycleWithProgress[]> {
  const activeCycles = MOCK_CYCLES.filter((c) => c.status === "active")

  return activeCycles.map((cycle) => {
    const team = MOCK_TEAMS.find((t) => t.id === cycle.teamId)
    const cycleIssues = MOCK_ISSUES.filter((i) => i.cycleId === cycle.id)
    const completedIssues = cycleIssues.filter((i) => i.status === "done" || i.status === "cancelled")

    return {
      cycle: { id: cycle.id, name: cycle.name, number: cycle.number, startDate: cycle.startDate, endDate: cycle.endDate, status: cycle.status },
      teamName: team?.name ?? "Unknown",
      teamSlug: team?.slug ?? "unknown",
      totalIssues: cycleIssues.length,
      completedIssues: completedIssues.length,
    }
  })
}
