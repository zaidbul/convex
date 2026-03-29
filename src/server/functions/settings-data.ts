import { and, asc, eq, sql } from "drizzle-orm"
import * as schema from "@/db/schema"
import type { ViewerContext, TicketsDatabase } from "./tickets-data"

// ── Types ────────────────────────────────────────────────────────────

export type WorkspaceMember = {
  userId: string
  name: string
  email: string
  avatarUrl: string | null
  initials: string
  role: (typeof schema.workspaceMembershipRoles)[number]
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

// ── Helpers ──────────────────────────────────────────────────────────

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug || "team"
}

function requireWorkspace(context: ViewerContext): string {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }
  return context.workspaceId
}

async function requireAdminOrOwner(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<void> {
  const workspaceId = requireWorkspace(context)
  const membership = await db.query.workspaceMemberships.findFirst({
    where: and(
      eq(schema.workspaceMemberships.workspaceId, workspaceId),
      eq(schema.workspaceMemberships.userId, context.userId)
    ),
  })
  if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
    throw new Error("Forbidden: requires admin or owner role")
  }
}

// ── Workspace Members ────────────────────────────────────────────────

export async function listWorkspaceMembersForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<WorkspaceMember[]> {
  const workspaceId = requireWorkspace(context)

  const rows = await db
    .select({
      user: schema.users,
      membership: schema.workspaceMemberships,
    })
    .from(schema.workspaceMemberships)
    .innerJoin(schema.users, eq(schema.workspaceMemberships.userId, schema.users.id))
    .where(eq(schema.workspaceMemberships.workspaceId, workspaceId))
    .orderBy(asc(schema.users.name))

  return rows.map((row) => ({
    userId: row.user.id,
    name: row.user.name,
    email: row.user.email,
    avatarUrl: row.user.avatarUrl,
    initials: row.user.initials,
    role: row.membership.role as WorkspaceMember["role"],
    joinedAt: row.membership.createdAt,
  }))
}

// ── Workspace Name ───────────────────────────────────────────────────

export async function updateWorkspaceNameForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  name: string
): Promise<void> {
  const workspaceId = requireWorkspace(context)
  await requireAdminOrOwner(db, context)

  const timestamp = new Date().toISOString()
  await db
    .update(schema.workspaces)
    .set({ name, updatedAt: timestamp })
    .where(eq(schema.workspaces.id, workspaceId))
}

// ── Teams ────────────────────────────────────────────────────────────

export async function listTeamsWithStatsForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<TeamWithMemberCount[]> {
  const workspaceId = requireWorkspace(context)

  const teams = await db
    .select()
    .from(schema.teams)
    .where(eq(schema.teams.workspaceId, workspaceId))
    .orderBy(asc(schema.teams.name))

  const results: TeamWithMemberCount[] = []
  for (const team of teams) {
    const [memberRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.teamMemberships)
      .where(eq(schema.teamMemberships.teamId, team.id))

    const [issueRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.issues)
      .where(
        and(
          eq(schema.issues.teamId, team.id),
          sql`${schema.issues.deletedAt} IS NULL`
        )
      )

    results.push({
      id: team.id,
      name: team.name,
      slug: team.slug,
      identifier: team.identifier,
      color: team.color,
      memberCount: Number(memberRow?.count ?? 0),
      issueCount: Number(issueRow?.count ?? 0),
      createdAt: team.createdAt,
    })
  }

  return results
}

export async function createTeamForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  input: { name: string; identifier: string; color: string }
): Promise<{ id: string }> {
  const workspaceId = requireWorkspace(context)
  await requireAdminOrOwner(db, context)

  const teamId = crypto.randomUUID()
  const timestamp = new Date().toISOString()
  const slug = slugify(input.name)

  await db.insert(schema.teams).values({
    id: teamId,
    workspaceId,
    name: input.name.trim(),
    slug,
    identifier: input.identifier.toUpperCase().trim(),
    color: input.color,
    nextIssueNumber: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  // Auto-add the creator as a team member
  await db.insert(schema.teamMemberships).values({
    teamId,
    userId: context.userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return { id: teamId }
}

export async function updateTeamForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  input: { teamId: string; name: string; identifier: string; color: string }
): Promise<void> {
  const workspaceId = requireWorkspace(context)
  await requireAdminOrOwner(db, context)

  const timestamp = new Date().toISOString()
  const slug = slugify(input.name)

  await db
    .update(schema.teams)
    .set({
      name: input.name.trim(),
      slug,
      identifier: input.identifier.toUpperCase().trim(),
      color: input.color,
      updatedAt: timestamp,
    })
    .where(
      and(eq(schema.teams.id, input.teamId), eq(schema.teams.workspaceId, workspaceId))
    )
}

export async function deleteTeamForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  teamId: string
): Promise<void> {
  const workspaceId = requireWorkspace(context)
  await requireAdminOrOwner(db, context)

  await db
    .delete(schema.teams)
    .where(and(eq(schema.teams.id, teamId), eq(schema.teams.workspaceId, workspaceId)))
}

// ── Member Role ──────────────────────────────────────────────────────

export async function updateMemberRoleForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  targetUserId: string,
  role: (typeof schema.workspaceMembershipRoles)[number]
): Promise<void> {
  const workspaceId = requireWorkspace(context)
  await requireAdminOrOwner(db, context)

  if (targetUserId === context.userId) {
    throw new Error("Cannot change your own role")
  }

  const timestamp = new Date().toISOString()
  await db
    .update(schema.workspaceMemberships)
    .set({ role, updatedAt: timestamp })
    .where(
      and(
        eq(schema.workspaceMemberships.workspaceId, workspaceId),
        eq(schema.workspaceMemberships.userId, targetUserId)
      )
    )
}

export async function removeMemberForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  targetUserId: string
): Promise<void> {
  const workspaceId = requireWorkspace(context)
  await requireAdminOrOwner(db, context)

  if (targetUserId === context.userId) {
    throw new Error("Cannot remove yourself from the workspace")
  }

  // Remove from all teams in this workspace
  const teamIds = await db
    .select({ id: schema.teams.id })
    .from(schema.teams)
    .where(eq(schema.teams.workspaceId, workspaceId))

  for (const { id: teamId } of teamIds) {
    await db
      .delete(schema.teamMemberships)
      .where(
        and(
          eq(schema.teamMemberships.teamId, teamId),
          eq(schema.teamMemberships.userId, targetUserId)
        )
      )
  }

  // Remove workspace membership
  await db
    .delete(schema.workspaceMemberships)
    .where(
      and(
        eq(schema.workspaceMemberships.workspaceId, workspaceId),
        eq(schema.workspaceMemberships.userId, targetUserId)
      )
    )
}
