import { and, asc, desc, eq, gt, gte, inArray, sql } from "drizzle-orm"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import * as schema from "@/db/schema"
import type {
  ActivityEntry,
  Cycle as TicketCycle,
  Issue as TicketIssue,
  IssueCommentDetail,
  IssueDetail as TicketIssueDetail,
  IssueFilter,
  IssuePriority,
  IssueStatus,
  Label as TicketLabel,
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

  // Bootstrap a default team if this workspace has none yet
  const existingTeams = await db.query.teams.findFirst({
    where: eq(schema.teams.workspaceId, input.organization.id),
  })

  if (!existingTeams) {
    const teamId = crypto.randomUUID()
    const teamName = input.organization.name
    const teamSlug = slugify(teamName)
    const teamIdentifier = teamName
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 3) || "DEF"

    try {
      await db.insert(schema.teams).values({
        id: teamId,
        workspaceId: input.organization.id,
        name: teamName,
        slug: teamSlug,
        identifier: teamIdentifier,
        color: "#6366f1",
        nextIssueNumber: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      })

      await db
        .insert(schema.teamMemberships)
        .values({
          teamId,
          userId: input.clerkUser.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        .onConflictDoNothing()
    } catch {
      // Race condition: another request already created the team — ensure membership
      const existingTeam = await db.query.teams.findFirst({
        where: eq(schema.teams.workspaceId, input.organization.id),
      })
      if (existingTeam) {
        await db
          .insert(schema.teamMemberships)
          .values({
            teamId: existingTeam.id,
            userId: input.clerkUser.id,
            createdAt: timestamp,
            updatedAt: timestamp,
          })
          .onConflictDoNothing()
      }
    }
  } else {
    // Ensure the current user is a member of at least one team in this workspace
    const membershipRow = await db
      .select({ teamId: schema.teamMemberships.teamId })
      .from(schema.teamMemberships)
      .innerJoin(schema.teams, eq(schema.teamMemberships.teamId, schema.teams.id))
      .where(
        and(
          eq(schema.teamMemberships.userId, input.clerkUser.id),
          eq(schema.teams.workspaceId, input.organization.id)
        )
      )
      .limit(1)

    if (membershipRow.length === 0) {
      await db
        .insert(schema.teamMemberships)
        .values({
          teamId: existingTeams.id,
          userId: input.clerkUser.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        .onConflictDoNothing()
    }
  }

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

function buildIssueFilter(filter?: string, viewerUserId?: string) {
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

  if (filter === "my-issues" && viewerUserId) {
    return eq(schema.issues.assigneeUserId, viewerUserId)
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
    buildIssueFilter(filter, context.userId)
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

const priorityScoreMap: Record<IssuePriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
}

export async function createIssueForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  input: {
    teamId: string
    title: string
    description?: string
    status: IssueStatus
    priority: IssuePriority
  }
): Promise<{ id: string; identifier: string }> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const timestamp = nowIso()
  const issueId = crypto.randomUUID()

  // Verify team membership before creating issue
  const membershipCheck = await db
    .select({ teamId: schema.teamMemberships.teamId })
    .from(schema.teamMemberships)
    .innerJoin(schema.teams, eq(schema.teamMemberships.teamId, schema.teams.id))
    .where(
      and(
        eq(schema.teams.id, input.teamId),
        eq(schema.teams.workspaceId, context.workspaceId),
        eq(schema.teamMemberships.userId, context.userId),
      )
    )
    .limit(1)

  if (membershipCheck.length === 0) {
    throw new Error("Team not found or not accessible")
  }

  // Atomically read+increment nextIssueNumber and insert the issue
  const [teamRow] = await db
    .update(schema.teams)
    .set({ nextIssueNumber: sql`${schema.teams.nextIssueNumber} + 1` })
    .where(
      and(
        eq(schema.teams.id, input.teamId),
        eq(schema.teams.workspaceId, context.workspaceId)
      )
    )
    .returning({
      identifier: schema.teams.identifier,
      sequenceNumber: schema.teams.nextIssueNumber,
    })

  if (!teamRow) {
    throw new Error("Team not found or not accessible")
  }

  // nextIssueNumber was already incremented, so the previous value is sequenceNumber - 1
  const seqNum = teamRow.sequenceNumber - 1
  const identifier = `${teamRow.identifier}-${seqNum}`

  await db.insert(schema.issues).values({
    id: issueId,
    workspaceId: context.workspaceId,
    teamId: input.teamId,
    creatorUserId: context.userId,
    identifier,
    sequenceNumber: seqNum,
    title: input.title,
    description: input.description ?? null,
    status: input.status,
    priority: input.priority,
    priorityScore: priorityScoreMap[input.priority],
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  await db.insert(schema.issueActivity).values({
    id: crypto.randomUUID(),
    issueId,
    actorUserId: context.userId,
    type: "created",
    data: {},
    createdAt: timestamp,
  })

  return { id: issueId, identifier }
}

export async function getIssueByIdForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string
): Promise<TicketIssueDetail | null> {
  if (!context.workspaceId) {
    return null
  }

  const issue = await db.query.issues.findFirst({
    where: and(
      eq(schema.issues.id, issueId),
      eq(schema.issues.workspaceId, context.workspaceId)
    ),
  })

  if (!issue) {
    return null
  }

  const [labelRows, creator, assignee] = await Promise.all([
    db
      .select({
        labelId: schema.labels.id,
        labelName: schema.labels.name,
        labelColor: schema.labels.color,
      })
      .from(schema.issueLabels)
      .innerJoin(schema.labels, eq(schema.issueLabels.labelId, schema.labels.id))
      .where(eq(schema.issueLabels.issueId, issueId)),
    db.query.users.findFirst({
      where: eq(schema.users.id, issue.creatorUserId),
    }),
    issue.assigneeUserId
      ? db.query.users.findFirst({
          where: eq(schema.users.id, issue.assigneeUserId),
        })
      : Promise.resolve(undefined),
  ])

  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    priorityScore: issue.priorityScore,
    labels: labelRows.map((row) => ({
      id: row.labelId,
      name: row.labelName,
      color: row.labelColor,
    })),
    assignees: assignee ? [mapUser(assignee)] : [],
    cycleId: issue.cycleId,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    completedAt: issue.completedAt,
    cancelledAt: issue.cancelledAt,
    creator: creator ? mapUser(creator) : { id: issue.creatorUserId, name: "Unknown", initials: "??" },
    teamId: issue.teamId,
  }
}

export async function updateIssueDescriptionForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string,
  description: string
): Promise<void> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  // Verify the issue belongs to a team the user is a member of
  const issue = await db.query.issues.findFirst({
    where: and(
      eq(schema.issues.id, issueId),
      eq(schema.issues.workspaceId, context.workspaceId),
    ),
  })

  if (!issue) {
    throw new Error("Issue not found")
  }

  const membership = await db
    .select({ teamId: schema.teamMemberships.teamId })
    .from(schema.teamMemberships)
    .where(
      and(
        eq(schema.teamMemberships.teamId, issue.teamId),
        eq(schema.teamMemberships.userId, context.userId),
      )
    )
    .limit(1)

  if (membership.length === 0) {
    throw new Error("Not authorized to update this issue")
  }

  const timestamp = nowIso()

  await db
    .update(schema.issues)
    .set({ description, updatedAt: timestamp })
    .where(
      and(
        eq(schema.issues.id, issueId),
        eq(schema.issues.workspaceId, context.workspaceId)
      )
    )

  await db.insert(schema.issueActivity).values({
    id: crypto.randomUUID(),
    issueId,
    actorUserId: context.userId,
    type: "description_change",
    data: {},
    createdAt: timestamp,
  })
}

async function verifyIssueAccess(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string
) {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const issue = await db.query.issues.findFirst({
    where: and(
      eq(schema.issues.id, issueId),
      eq(schema.issues.workspaceId, context.workspaceId),
    ),
  })

  if (!issue) {
    throw new Error("Issue not found")
  }

  const membership = await db
    .select({ teamId: schema.teamMemberships.teamId })
    .from(schema.teamMemberships)
    .where(
      and(
        eq(schema.teamMemberships.teamId, issue.teamId),
        eq(schema.teamMemberships.userId, context.userId),
      )
    )
    .limit(1)

  if (membership.length === 0) {
    throw new Error("Not authorized to update this issue")
  }

  return issue
}

export async function updateIssueStatusForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string,
  status: IssueStatus
): Promise<void> {
  const issue = await verifyIssueAccess(db, context, issueId)
  const timestamp = nowIso()

  const updates: Record<string, unknown> = { status, updatedAt: timestamp }
  if (status === "done") updates.completedAt = timestamp
  else if (status === "cancelled") updates.cancelledAt = timestamp

  await db
    .update(schema.issues)
    .set(updates)
    .where(eq(schema.issues.id, issueId))

  await db.insert(schema.issueActivity).values({
    id: crypto.randomUUID(),
    issueId,
    actorUserId: context.userId,
    type: "status_change",
    data: { from: issue.status, to: status },
    createdAt: timestamp,
  })
}

export async function updateIssuePriorityForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string,
  priority: IssuePriority
): Promise<void> {
  const issue = await verifyIssueAccess(db, context, issueId)
  const timestamp = nowIso()

  await db
    .update(schema.issues)
    .set({ priority, priorityScore: priorityScoreMap[priority], updatedAt: timestamp })
    .where(eq(schema.issues.id, issueId))

  await db.insert(schema.issueActivity).values({
    id: crypto.randomUUID(),
    issueId,
    actorUserId: context.userId,
    type: "priority_change",
    data: { from: issue.priority, to: priority },
    createdAt: timestamp,
  })
}

export async function updateIssueAssigneeForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string,
  assigneeUserId: string | null
): Promise<void> {
  await verifyIssueAccess(db, context, issueId)
  const timestamp = nowIso()

  await db
    .update(schema.issues)
    .set({ assigneeUserId, updatedAt: timestamp })
    .where(eq(schema.issues.id, issueId))

  await db.insert(schema.issueActivity).values({
    id: crypto.randomUUID(),
    issueId,
    actorUserId: context.userId,
    type: "assignee_change",
    data: { assigneeUserId },
    createdAt: timestamp,
  })
}

export async function updateIssueCycleForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string,
  cycleId: string | null
): Promise<void> {
  await verifyIssueAccess(db, context, issueId)

  await db
    .update(schema.issues)
    .set({ cycleId, updatedAt: nowIso() })
    .where(eq(schema.issues.id, issueId))
}

export async function updateIssueLabelsForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string,
  labelIds: string[]
): Promise<void> {
  await verifyIssueAccess(db, context, issueId)
  const timestamp = nowIso()

  await db
    .delete(schema.issueLabels)
    .where(eq(schema.issueLabels.issueId, issueId))

  if (labelIds.length > 0) {
    await db.insert(schema.issueLabels).values(
      labelIds.map((labelId) => ({
        issueId,
        labelId,
        createdAt: timestamp,
      }))
    )
  }

  await db.insert(schema.issueActivity).values({
    id: crypto.randomUUID(),
    issueId,
    actorUserId: context.userId,
    type: "label_change",
    data: { labelIds },
    createdAt: timestamp,
  })
}

export async function updateIssueTitleForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string,
  title: string
): Promise<void> {
  await verifyIssueAccess(db, context, issueId)

  await db
    .update(schema.issues)
    .set({ title, updatedAt: nowIso() })
    .where(eq(schema.issues.id, issueId))
}

export async function listTeamMembersForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  teamId: string
): Promise<TicketUser[]> {
  if (!context.workspaceId) {
    return []
  }

  const rows = await db
    .select({ user: schema.users })
    .from(schema.teamMemberships)
    .innerJoin(schema.users, eq(schema.teamMemberships.userId, schema.users.id))
    .where(eq(schema.teamMemberships.teamId, teamId))
    .orderBy(asc(schema.users.name))

  return rows.map((row) => mapUser(row.user))
}

export async function listLabelsForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<TicketLabel[]> {
  if (!context.workspaceId) {
    return []
  }

  const rows = await db.query.labels.findMany({
    where: eq(schema.labels.workspaceId, context.workspaceId),
    orderBy: [asc(schema.labels.name)],
  })

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    color: row.color,
  }))
}

export async function listIssueActivityForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string
): Promise<ActivityEntry[]> {
  if (!context.workspaceId) {
    return []
  }

  const rows = await db
    .select({
      activity: schema.issueActivity,
      actor: schema.users,
    })
    .from(schema.issueActivity)
    .leftJoin(schema.users, eq(schema.issueActivity.actorUserId, schema.users.id))
    .where(eq(schema.issueActivity.issueId, issueId))
    .orderBy(asc(schema.issueActivity.createdAt))

  return rows.map((row) => ({
    id: row.activity.id,
    type: row.activity.type,
    actor: row.actor ? mapUser(row.actor) : null,
    data: (row.activity.data ?? {}) as ActivityEntry["data"],
    createdAt: row.activity.createdAt,
  }))
}

export async function listIssueCommentsForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string
): Promise<IssueCommentDetail[]> {
  if (!context.workspaceId) {
    return []
  }

  const rows = await db
    .select({
      comment: schema.issueComments,
      author: schema.users,
    })
    .from(schema.issueComments)
    .innerJoin(schema.users, eq(schema.issueComments.authorUserId, schema.users.id))
    .where(
      and(
        eq(schema.issueComments.issueId, issueId),
        sql`${schema.issueComments.deletedAt} IS NULL`,
      )
    )
    .orderBy(asc(schema.issueComments.createdAt))

  return rows.map((row) => ({
    id: row.comment.id,
    author: mapUser(row.author),
    body: row.comment.body,
    createdAt: row.comment.createdAt,
    updatedAt: row.comment.updatedAt,
  }))
}

export async function createIssueCommentForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string,
  body: string
): Promise<{ id: string }> {
  await verifyIssueAccess(db, context, issueId)
  const timestamp = nowIso()
  const commentId = crypto.randomUUID()

  await db.insert(schema.issueComments).values({
    id: commentId,
    issueId,
    authorUserId: context.userId,
    body,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  await db.insert(schema.issueActivity).values({
    id: crypto.randomUUID(),
    issueId,
    actorUserId: context.userId,
    type: "comment",
    data: { commentId },
    createdAt: timestamp,
  })

  return { id: commentId }
}
