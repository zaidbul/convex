import type { ViewerContext } from "./tickets-data"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotificationsDatabase = any

export type NotificationScope = "all" | "unread"
export type NotificationFilterType =
  | "all"
  | "assignment"
  | "status"
  | "comment"
  | "mention"
  | "cycle"

export type NotificationMetadata = {
  teamSlug?: string
  teamName?: string
  issueIdentifier?: string
  issueTitle?: string
  cycleName?: string
  commentPreview?: string
  statusFrom?: string
  statusTo?: string
}

export type NotificationActor = {
  id: string
  name: string
  initials: string
  avatarUrl?: string
} | null

export type NotificationListItem = {
  id: string
  type: "issue_assigned" | "issue_status_changed" | "issue_commented" | "issue_mentioned" | "cycle_started" | "cycle_completed"
  title: string
  body: string | null
  entityType: "issue" | "cycle"
  entityId: string
  readAt: string | null
  createdAt: string
  actor: NotificationActor
  metadata: NotificationMetadata
}

type CreateNotificationsInput = {
  workspaceId: string
  actorUserId: string | null
  recipients: string[]
  type: NotificationListItem["type"]
  title: string
  body?: string | null
  entityType: NotificationListItem["entityType"]
  entityId: string
  metadata?: NotificationMetadata
}

// ── Mock Data ───────────────────────────────────────────────────────

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

const MOCK_NOTIFICATIONS: NotificationListItem[] = [
  {
    id: "notif-001",
    type: "issue_assigned",
    title: "Assigned you ENG-101",
    body: "Fix authentication race condition on session refresh",
    entityType: "issue",
    entityId: "issue-001",
    readAt: null,
    createdAt: hoursAgo(2),
    actor: { id: "demo-user-002", name: "Jordan Rivera", initials: "JR" },
    metadata: { teamSlug: "engineering", teamName: "Engineering", issueIdentifier: "ENG-101", issueTitle: "Fix authentication race condition on session refresh" },
  },
  {
    id: "notif-002",
    type: "issue_commented",
    title: "New comment on ENG-101",
    body: "Fix authentication race condition on session refresh",
    entityType: "issue",
    entityId: "issue-001",
    readAt: null,
    createdAt: hoursAgo(3),
    actor: { id: "demo-user-002", name: "Jordan Rivera", initials: "JR" },
    metadata: { teamSlug: "engineering", teamName: "Engineering", issueIdentifier: "ENG-101", issueTitle: "Fix authentication race condition on session refresh", commentPreview: "I can reproduce this consistently by opening two tabs..." },
  },
  {
    id: "notif-003",
    type: "issue_status_changed",
    title: "ENG-103 moved to in-review",
    body: "Optimize database queries for issue listing page",
    entityType: "issue",
    entityId: "issue-003",
    readAt: null,
    createdAt: hoursAgo(5),
    actor: { id: "demo-user-003", name: "Sam Taylor", initials: "ST" },
    metadata: { teamSlug: "engineering", teamName: "Engineering", issueIdentifier: "ENG-103", issueTitle: "Optimize database queries for issue listing page", statusFrom: "in-progress", statusTo: "in-review" },
  },
  {
    id: "notif-004",
    type: "cycle_started",
    title: "Sprint 13 started",
    body: "Engineering",
    entityType: "cycle",
    entityId: "cycle-eng-2",
    readAt: daysAgo(5),
    createdAt: daysAgo(7),
    actor: { id: "demo-user-001", name: "Alex Chen", initials: "AC" },
    metadata: { teamSlug: "engineering", teamName: "Engineering", cycleName: "Sprint 13" },
  },
  {
    id: "notif-005",
    type: "issue_mentioned",
    title: "You were mentioned in DES-201",
    body: "Redesign issue detail panel with improved hierarchy",
    entityType: "issue",
    entityId: "issue-008",
    readAt: daysAgo(3),
    createdAt: daysAgo(4),
    actor: { id: "demo-user-004", name: "Morgan Lee", initials: "ML" },
    metadata: { teamSlug: "design", teamName: "Design", issueIdentifier: "DES-201", issueTitle: "Redesign issue detail panel with improved hierarchy" },
  },
  {
    id: "notif-006",
    type: "issue_assigned",
    title: "Assigned you ENG-108",
    body: "Add rate limiting to public API endpoints",
    entityType: "issue",
    entityId: "issue-016",
    readAt: null,
    createdAt: hoursAgo(8),
    actor: { id: "demo-user-002", name: "Jordan Rivera", initials: "JR" },
    metadata: { teamSlug: "engineering", teamName: "Engineering", issueIdentifier: "ENG-108", issueTitle: "Add rate limiting to public API endpoints" },
  },
  {
    id: "notif-007",
    type: "cycle_completed",
    title: "Sprint 12 completed",
    body: "Engineering",
    entityType: "cycle",
    entityId: "cycle-eng-1",
    readAt: daysAgo(6),
    createdAt: daysAgo(7),
    actor: { id: "demo-user-001", name: "Alex Chen", initials: "AC" },
    metadata: { teamSlug: "engineering", teamName: "Engineering", cycleName: "Sprint 12" },
  },
  {
    id: "notif-008",
    type: "issue_status_changed",
    title: "PRD-304 moved to done",
    body: "Competitive analysis: Linear vs Jira vs Shortcut",
    entityType: "issue",
    entityId: "issue-015",
    readAt: daysAgo(4),
    createdAt: daysAgo(6),
    actor: { id: "demo-user-001", name: "Alex Chen", initials: "AC" },
    metadata: { teamSlug: "product", teamName: "Product", issueIdentifier: "PRD-304", issueTitle: "Competitive analysis: Linear vs Jira vs Shortcut", statusFrom: "in-progress", statusTo: "done" },
  },
]

// ── Helpers ─────────────────────────────────────────────────────────

function filterByType(type: NotificationFilterType): NotificationListItem["type"][] | undefined {
  switch (type) {
    case "assignment": return ["issue_assigned"]
    case "status": return ["issue_status_changed"]
    case "comment": return ["issue_commented"]
    case "mention": return ["issue_mentioned"]
    case "cycle": return ["cycle_started", "cycle_completed"]
    default: return undefined
  }
}

// ── Exported Functions ──────────────────────────────────────────────

export async function createNotificationsForEvent(
  _db: NotificationsDatabase,
  _input: CreateNotificationsInput
): Promise<void> {
  // no-op in demo mode
}

export async function listNotificationsForViewer(
  _db: NotificationsDatabase,
  _context: ViewerContext,
  input: {
    scope?: NotificationScope
    type?: NotificationFilterType
    limit?: number
    offset?: number
  }
): Promise<{ items: NotificationListItem[]; total: number }> {
  let items = [...MOCK_NOTIFICATIONS]

  if (input.scope === "unread") {
    items = items.filter((n) => n.readAt === null)
  }

  const types = filterByType(input.type ?? "all")
  if (types) {
    items = items.filter((n) => types.includes(n.type))
  }

  const offset = Math.max(0, input.offset ?? 0)
  const limit = Math.max(1, Math.min(input.limit ?? 25, 100))
  const total = items.length
  items = items.slice(offset, offset + limit)

  return { items, total }
}

export async function listRecentNotificationsForViewer(
  _db: NotificationsDatabase,
  _context: ViewerContext,
  input?: { limit?: number }
): Promise<NotificationListItem[]> {
  return MOCK_NOTIFICATIONS.slice(0, input?.limit ?? 10)
}

export async function getUnreadNotificationCountForViewer(
  _db: NotificationsDatabase,
  _context: ViewerContext
): Promise<number> {
  return MOCK_NOTIFICATIONS.filter((n) => n.readAt === null).length
}

export async function markNotificationAsReadForViewer(
  _db: NotificationsDatabase,
  _context: ViewerContext,
  _notificationId: string
): Promise<void> {
  // no-op in demo mode
}

export async function markAllNotificationsAsReadForViewer(
  _db: NotificationsDatabase,
  _context: ViewerContext
): Promise<void> {
  // no-op in demo mode
}
