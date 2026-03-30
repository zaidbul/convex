import type { ViewerContext, TicketsDatabase } from "./tickets-data"

// ── Types ────────────────────────────────────────────────────────────

export type WorkspaceMember = {
  userId: string
  name: string
  email: string
  avatarUrl: string | null
  initials: string
  role: "owner" | "admin" | "member" | "guest"
  joinedAt: string
}

export type TeamWithMemberCount = {
  id: string
  name: string
  slug: string
  identifier: string
  color: string
  memberCount: number
  issueCount: number
  createdAt: string
}

// ── Mock Data ───────────────────────────────────────────────────────

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

const MOCK_MEMBERS: WorkspaceMember[] = [
  { userId: "demo-user-001", name: "Alex Chen", email: "alex@acme.corp", avatarUrl: null, initials: "AC", role: "owner", joinedAt: daysAgo(180) },
  { userId: "demo-user-002", name: "Jordan Rivera", email: "jordan@acme.corp", avatarUrl: null, initials: "JR", role: "admin", joinedAt: daysAgo(150) },
  { userId: "demo-user-003", name: "Sam Taylor", email: "sam@acme.corp", avatarUrl: null, initials: "ST", role: "member", joinedAt: daysAgo(120) },
  { userId: "demo-user-004", name: "Morgan Lee", email: "morgan@acme.corp", avatarUrl: null, initials: "ML", role: "member", joinedAt: daysAgo(90) },
]

const MOCK_TEAMS_WITH_STATS: TeamWithMemberCount[] = [
  { id: "team-eng-001", name: "Engineering", slug: "engineering", identifier: "ENG", color: "#6366f1", memberCount: 4, issueCount: 9, createdAt: daysAgo(180) },
  { id: "team-des-001", name: "Design", slug: "design", identifier: "DES", color: "#ec4899", memberCount: 3, issueCount: 4, createdAt: daysAgo(150) },
  { id: "team-prd-001", name: "Product", slug: "product", identifier: "PRD", color: "#f59e0b", memberCount: 2, issueCount: 4, createdAt: daysAgo(120) },
]

// ── Exported Functions ──────────────────────────────────────────────

export async function listWorkspaceMembersForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<WorkspaceMember[]> {
  return MOCK_MEMBERS
}

export async function updateWorkspaceNameForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _name: string
): Promise<void> {
  // no-op in demo mode
}

export async function listTeamsWithStatsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<TeamWithMemberCount[]> {
  return MOCK_TEAMS_WITH_STATS
}

export async function createTeamForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  input: { name: string; identifier: string; color: string }
): Promise<{ id: string; slug: string }> {
  const slug = input.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "team"
  return { id: `team-${crypto.randomUUID().slice(0, 8)}`, slug }
}

export async function updateTeamForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _input: { teamId: string; name: string; identifier: string; color: string }
): Promise<void> {
  // no-op in demo mode
}

export async function deleteTeamForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _teamId: string
): Promise<void> {
  // no-op in demo mode
}

export async function updateMemberRoleForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _targetUserId: string,
  _role: "owner" | "admin" | "member" | "guest"
): Promise<void> {
  // no-op in demo mode
}

export async function removeMemberForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _targetUserId: string
): Promise<void> {
  // no-op in demo mode
}
