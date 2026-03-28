import { and, asc, desc, eq, gt, gte, inArray } from "drizzle-orm"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import * as schema from "@/db/schema"
import type {
  Cycle as TicketCycle,
  Issue as TicketIssue,
  IssueFilter,
  Team as TicketTeam,
  User as TicketUser,
  Workspace as TicketWorkspace,
} from "@/components/tickets/types"

export type TicketsDatabase = LibSQLDatabase<typeof schema>

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

function nowIso(): string {
  return new Date().toISOString()
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "workspace"
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "??"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase()
}

function getDisplayName(user: SyncedViewerInput["clerkUser"]): string {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
  return fullName || user.username || "Unknown User"
}

function getPrimaryEmail(user: SyncedViewerInput["clerkUser"]): string {
  return user.emailAddresses?.find((item) => item.emailAddress)?.emailAddress ?? `${user.id}@clerk.local`
}

export function mapClerkOrgRoleToWorkspaceRole(
  orgRole: string | null
): typeof schema.workspaceMembershipRoles[number] {
  switch (orgRole) {
    case "org:owner":
      return "owner"
    case "org:admin":
      return "admin"
    case "org:member":
      return "member"
    default:
      return "guest"
  }
}

export async function syncViewerContext(
  db: TicketsDatabase,
  input: SyncedViewerInput
): Promise<ViewerContext> {
  const timestamp = nowIso()
  const displayName = getDisplayName(input.clerkUser)
  const email = getPrimaryEmail(input.clerkUser)

  await db
    .insert(schema.users)
    .values({
      id: input.clerkUser.id,
      clerkUserId: input.clerkUser.id,
      name: displayName,
      email,
      avatarUrl: input.clerkUser.imageUrl ?? null,
      initials: getInitials(displayName),
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: schema.users.id,
      set: {
        clerkUserId: input.clerkUser.id,
        name: displayName,
        email,
        avatarUrl: input.clerkUser.imageUrl ?? null,
        initials: getInitials(displayName),
        updatedAt: timestamp,
      },
    })

  if (!input.auth.orgId || !input.organization) {
    return { userId: input.clerkUser.id, workspaceId: null }
  }

  const workspaceSlug = input.organization.slug ?? input.auth.orgSlug ?? slugify(input.organization.name)

  await db
    .insert(schema.workspaces)
    .values({
      id: input.organization.id,
      clerkOrgId: input.organization.id,
      name: input.organization.name,
      slug: workspaceSlug,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: schema.workspaces.id,
      set: {
        clerkOrgId: input.organization.id,
        name: input.organization.name,
        slug: workspaceSlug,
        updatedAt: timestamp,
      },
    })

  await db
    .insert(schema.workspaceMemberships)
    .values({
      workspaceId: input.organization.id,
      userId: input.clerkUser.id,
      role: mapClerkOrgRoleToWorkspaceRole(input.auth.orgRole),
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: [
        schema.workspaceMemberships.workspaceId,
        schema.workspaceMemberships.userId,
      ],
      set: {
        role: mapClerkOrgRoleToWorkspaceRole(input.auth.orgRole),
        updatedAt: timestamp,
      },
    })

  return { userId: input.clerkUser.id, workspaceId: input.organization.id }
}

function mapTeam(row: typeof schema.teams.$inferSelect): TicketTeam {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    identifier: row.identifier,
    color: row.color,
  }
}

function mapCycle(row: typeof schema.cycles.$inferSelect): TicketCycle {
  return {
    id: row.id,
    name: row.name,
    number: row.number,
    startDate: row.startDate,
    endDate: row.endDate,
    status: row.status,
  }
}

function mapUser(row: typeof schema.users.$inferSelect): TicketUser {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    avatarUrl: row.avatarUrl ?? undefined,
  }
}

export async function listTeamsForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<TicketTeam[]> {
  if (!context.workspaceId) {
    return []
  }

  const rows = await db
    .select({ team: schema.teams })
    .from(schema.teamMemberships)
    .innerJoin(schema.teams, eq(schema.teamMemberships.teamId, schema.teams.id))
    .where(
      and(
        eq(schema.teamMemberships.userId, context.userId),
        eq(schema.teams.workspaceId, context.workspaceId)
      )
    )
    .orderBy(asc(schema.teams.name))

  return rows.map((row) => mapTeam(row.team))
}

export async function getWorkspaceForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<TicketWorkspace | null> {
  if (!context.workspaceId) {
    return null
  }

  const workspace = await db.query.workspaces.findFirst({
    where: eq(schema.workspaces.id, context.workspaceId),
  })

  if (!workspace) {
    return null
  }

  return {
    id: workspace.id,
    name: workspace.name,
  }
}

export async function getAccessibleTeamBySlug(
  db: TicketsDatabase,
  context: ViewerContext,
  teamSlug: string
): Promise<TicketTeam | null> {
  if (!context.workspaceId) {
    return null
  }

  const row = await db
    .select({ team: schema.teams })
    .from(schema.teams)
    .innerJoin(schema.teamMemberships, eq(schema.teamMemberships.teamId, schema.teams.id))
    .where(
      and(
        eq(schema.teams.workspaceId, context.workspaceId),
        eq(schema.teams.slug, teamSlug),
        eq(schema.teamMemberships.userId, context.userId)
      )
    )
    .limit(1)

  const team = row[0]?.team
  return team ? mapTeam(team) : null
}

async function getAccessibleTeamRecord(
  db: TicketsDatabase,
  context: ViewerContext,
  teamSlug: string
) {
  if (!context.workspaceId) {
    return null
  }

  const row = await db
    .select({ team: schema.teams })
    .from(schema.teams)
    .innerJoin(schema.teamMemberships, eq(schema.teamMemberships.teamId, schema.teams.id))
    .where(
      and(
        eq(schema.teams.workspaceId, context.workspaceId),
        eq(schema.teams.slug, teamSlug),
        eq(schema.teamMemberships.userId, context.userId)
      )
    )
    .limit(1)

  return row[0]?.team ?? null
}

export async function listCyclesForViewerTeam(
  db: TicketsDatabase,
  context: ViewerContext,
  teamSlug: string
): Promise<TicketCycle[]> {
  const team = await getAccessibleTeamRecord(db, context, teamSlug)
  if (!team) {
    return []
  }

  const rows = await db.query.cycles.findMany({
    where: eq(schema.cycles.teamId, team.id),
    orderBy: [asc(schema.cycles.startDate), asc(schema.cycles.number)],
  })

  return rows.map(mapCycle)
}

function buildIssueFilter(filter?: string) {
  if (!filter || filter === "all") {
    return undefined
  }

  if (filter === "active") {
    return inArray(schema.issues.status, ["todo", "in-progress", "in-review"])
  }

  if (filter === "backlog") {
    return eq(schema.issues.status, "backlog")
  }

  if (filter === "backlog-not-estimated") {
    return and(eq(schema.issues.status, "backlog"), eq(schema.issues.priorityScore, 0))
  }

  if (filter === "backlog-graded") {
    return and(eq(schema.issues.status, "backlog"), gt(schema.issues.priorityScore, 0))
  }

  if (filter === "recently-added") {
    const recentBoundary = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    return gte(schema.issues.createdAt, recentBoundary)
  }

  return undefined
}

export async function listIssuesForViewerTeam(
  db: TicketsDatabase,
  context: ViewerContext,
  teamSlug: string,
  filter?: IssueFilter | string
): Promise<TicketIssue[]> {
  const team = await getAccessibleTeamRecord(db, context, teamSlug)
  if (!team || !context.workspaceId) {
    return []
  }

  const whereClause = and(
    eq(schema.issues.workspaceId, context.workspaceId),
    eq(schema.issues.teamId, team.id),
    buildIssueFilter(filter)
  )

  const issueRows = await db.query.issues.findMany({
    where: whereClause,
    orderBy: [
      desc(schema.issues.priorityScore),
      desc(schema.issues.updatedAt),
      desc(schema.issues.createdAt),
    ],
  })

  if (issueRows.length === 0) {
    return []
  }

  const issueIds = issueRows.map((issue) => issue.id)
  const assigneeIds = Array.from(
    new Set(issueRows.map((issue) => issue.assigneeUserId).filter((value): value is string => Boolean(value)))
  )

  const [labelRows, assigneeRows] = await Promise.all([
    db
      .select({
        issueId: schema.issueLabels.issueId,
        labelId: schema.labels.id,
        labelName: schema.labels.name,
        labelColor: schema.labels.color,
      })
      .from(schema.issueLabels)
      .innerJoin(schema.labels, eq(schema.issueLabels.labelId, schema.labels.id))
      .where(inArray(schema.issueLabels.issueId, issueIds)),
    assigneeIds.length > 0
      ? db.query.users.findMany({
          where: inArray(schema.users.id, assigneeIds),
        })
      : Promise.resolve([]),
  ])

  const labelsByIssueId = new Map<string, TicketIssue["labels"]>()
  for (const row of labelRows) {
    const current = labelsByIssueId.get(row.issueId) ?? []
    current.push({
      id: row.labelId,
      name: row.labelName,
      color: row.labelColor,
    })
    labelsByIssueId.set(row.issueId, current)
  }

  const assigneesById = new Map(assigneeRows.map((row) => [row.id, mapUser(row)]))

  return issueRows.map((issue) => {
    const assignee = issue.assigneeUserId ? assigneesById.get(issue.assigneeUserId) : undefined

    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      status: issue.status,
      priority: issue.priority,
      priorityScore: issue.priorityScore,
      labels: labelsByIssueId.get(issue.id) ?? [],
      assignees: assignee ? [assignee] : [],
      cycleId: issue.cycleId,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    }
  })
}
