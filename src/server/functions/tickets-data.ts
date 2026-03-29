import { and, asc, desc, eq, gt, gte, inArray, lte, or, sql } from "drizzle-orm"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import * as schema from "@/db/schema"
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
  Project as TicketProject,
  SavedView as TicketSavedView,
  Team as TicketTeam,
  User as TicketUser,
  Workspace as TicketWorkspace,
} from "@/components/tickets/types"
import { createNotificationsForEvent } from "./notifications-data"

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

const MARKDOWN_MENTION_REGEXP = /@\[(.+?)\]\(mention:([^)]+)\)/g

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function extractMentionedUserIdsFromMarkdown(markdown?: string | null): string[] {
  if (!markdown) {
    return []
  }

  const mentionedUserIds = new Set<string>()

  for (const match of markdown.matchAll(MARKDOWN_MENTION_REGEXP)) {
    const userId = match[2]
    if (userId) {
      mentionedUserIds.add(userId)
    }
  }

  return Array.from(mentionedUserIds)
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

function mapSavedView(
  row: typeof schema.savedViews.$inferSelect,
  team: typeof schema.teams.$inferSelect,
): TicketSavedView {
  return {
    id: row.id,
    name: row.name,
    teamId: row.teamId,
    teamSlug: team.slug,
    teamName: team.name,
    teamColor: team.color,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    presetFilter: row.presetFilter as IssueFilter | undefined,
    advancedFilters: (row.advancedFiltersJson as IssueAdvancedFilters | null) ?? undefined,
  }
}

async function getTeamRecordById(
  db: TicketsDatabase,
  teamId: string,
) {
  return db.query.teams.findFirst({
    where: eq(schema.teams.id, teamId),
  })
}

async function listTeamUserRecords(
  db: TicketsDatabase,
  teamId: string,
): Promise<Array<typeof schema.users.$inferSelect>> {
  const rows = await db
    .select({ user: schema.users })
    .from(schema.teamMemberships)
    .innerJoin(schema.users, eq(schema.teamMemberships.userId, schema.users.id))
    .where(eq(schema.teamMemberships.teamId, teamId))
    .orderBy(asc(schema.users.name))

  return rows.map((row) => row.user)
}

async function buildIssueNotificationMetadata(
  db: TicketsDatabase,
  issue: Pick<
    typeof schema.issues.$inferSelect,
    "id" | "teamId" | "identifier" | "title"
  >,
) {
  const team = await getTeamRecordById(db, issue.teamId)

  if (!team) {
    throw new Error("Issue team not found")
  }

  return {
    team,
    metadata: {
      teamSlug: team.slug,
      teamName: team.name,
      issueIdentifier: issue.identifier,
      issueTitle: issue.title,
    },
  }
}

async function notifyIssueMentions(
  db: TicketsDatabase,
  issue: Pick<
    typeof schema.issues.$inferSelect,
    "id" | "workspaceId" | "teamId" | "identifier" | "title"
  >,
  actorUserId: string,
  mentionedUserIds: string[],
  body?: string | null,
): Promise<void> {
  if (mentionedUserIds.length === 0) {
    return
  }

  const { metadata } = await buildIssueNotificationMetadata(db, issue)

  await createNotificationsForEvent(db, {
    workspaceId: issue.workspaceId,
    actorUserId,
    recipients: mentionedUserIds,
    type: "issue_mentioned",
    title: `You were mentioned in ${issue.identifier}`,
    body: issue.title,
    entityType: "issue",
    entityId: issue.id,
    metadata: {
      ...metadata,
      commentPreview: body ? body.slice(0, 140) : undefined,
    },
  })
}

async function notifyIssueAssignment(
  db: TicketsDatabase,
  issue: Pick<
    typeof schema.issues.$inferSelect,
    "id" | "workspaceId" | "teamId" | "identifier" | "title"
  >,
  actorUserId: string,
  assigneeUserId: string | null,
): Promise<void> {
  if (!assigneeUserId) {
    return
  }

  const { metadata } = await buildIssueNotificationMetadata(db, issue)

  await createNotificationsForEvent(db, {
    workspaceId: issue.workspaceId,
    actorUserId,
    recipients: [assigneeUserId],
    type: "issue_assigned",
    title: `Assigned you ${issue.identifier}`,
    body: issue.title,
    entityType: "issue",
    entityId: issue.id,
    metadata,
  })
}

async function listIssueParticipantUserIds(
  db: TicketsDatabase,
  issue: Pick<
    typeof schema.issues.$inferSelect,
    "id" | "creatorUserId" | "assigneeUserId"
  >,
): Promise<string[]> {
  const commentRows = await db
    .select({
      authorUserId: schema.issueComments.authorUserId,
    })
    .from(schema.issueComments)
    .where(
      and(
        eq(schema.issueComments.issueId, issue.id),
        sql`${schema.issueComments.deletedAt} IS NULL`,
      ),
    )

  const recipients = new Set<string>([issue.creatorUserId])

  if (issue.assigneeUserId) {
    recipients.add(issue.assigneeUserId)
  }

  for (const row of commentRows) {
    recipients.add(row.authorUserId)
  }

  return Array.from(recipients)
}

function extractMentionedUserIdsFromComment(
  body: string,
  members: Array<typeof schema.users.$inferSelect>,
): string[] {
  const mentionedUserIds = new Set<string>()
  const sortedMembers = [...members].sort((a, b) => b.name.length - a.name.length)

  for (const member of sortedMembers) {
    const name = member.name.trim()
    if (!name) {
      continue
    }

    const matcher = new RegExp(
      `(^|[\\s([{])@${escapeRegExp(name)}(?=$|[\\s\\])}.,!?;:])`,
      "i",
    )

    if (matcher.test(body)) {
      mentionedUserIds.add(member.id)
    }
  }

  return Array.from(mentionedUserIds)
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

function buildPresetIssueFilter(filter?: IssueFilter | string, viewerUserId?: string) {
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

function buildDueDateClause(filters: IssueAdvancedFilters) {
  const clauses = [
    filters.dueFrom ? gte(schema.issues.dueDate, filters.dueFrom) : undefined,
    filters.dueTo ? lte(schema.issues.dueDate, filters.dueTo) : undefined,
  ].filter(Boolean)

  if (clauses.length === 0) {
    return undefined
  }

  return and(...clauses)
}

async function buildAdvancedIssueFilter(
  db: TicketsDatabase,
  filters: IssueAdvancedFilters,
) {
  const fieldClauses = [
    filters.statuses.length > 0 ? inArray(schema.issues.status, filters.statuses) : undefined,
    filters.priorities.length > 0 ? inArray(schema.issues.priority, filters.priorities) : undefined,
    filters.assigneeIds.length > 0 ? inArray(schema.issues.assigneeUserId, filters.assigneeIds) : undefined,
    filters.cycleIds.length > 0 ? inArray(schema.issues.cycleId, filters.cycleIds) : undefined,
    buildDueDateClause(filters),
  ].filter(Boolean)

  if (filters.labelIds.length > 0) {
    const matchingIssueRows = await db
      .selectDistinct({ issueId: schema.issueLabels.issueId })
      .from(schema.issueLabels)
      .where(inArray(schema.issueLabels.labelId, filters.labelIds))

    if (matchingIssueRows.length === 0) {
      return sql`1 = 0`
    }

    fieldClauses.push(
      inArray(
        schema.issues.id,
        matchingIssueRows.map((row) => row.issueId),
      ),
    )
  }

  if (fieldClauses.length === 0) {
    return undefined
  }

  return filters.logic === "or" ? or(...fieldClauses) : and(...fieldClauses)
}

export async function listIssuesForViewerTeam(
  db: TicketsDatabase,
  context: ViewerContext,
  teamSlug: string,
  filters?: IssueQueryFilters
): Promise<TicketIssue[]> {
  const team = await getAccessibleTeamRecord(db, context, teamSlug)
  if (!team || !context.workspaceId) {
    return []
  }

  const issueFilter = filters?.presetFilter
    ? buildPresetIssueFilter(filters.presetFilter, context.userId)
    : filters?.advancedFilters
      ? await buildAdvancedIssueFilter(db, filters.advancedFilters)
      : undefined

  const whereClause = and(
    eq(schema.issues.workspaceId, context.workspaceId),
    eq(schema.issues.teamId, team.id),
    sql`${schema.issues.deletedAt} IS NULL`,
    sql`${schema.issues.archivedAt} IS NULL`,
    issueFilter
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
      dueDate: issue.dueDate,
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
    dueDate?: string | null
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
    dueDate: input.dueDate ?? null,
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

  const mentionedUserIds = Array.from(
    new Set(extractMentionedUserIdsFromMarkdown(input.description)),
  )

  if (mentionedUserIds.length > 0) {
    const teamMembers = await listTeamUserRecords(db, input.teamId)
    const validMemberIds = new Set(teamMembers.map((member) => member.id))
    const validMentionIds = mentionedUserIds.filter((userId) => validMemberIds.has(userId))

    await notifyIssueMentions(
      db,
      {
        id: issueId,
        workspaceId: context.workspaceId,
        teamId: input.teamId,
        identifier,
        title: input.title,
      },
      context.userId,
      validMentionIds,
    )
  }

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
      eq(schema.issues.workspaceId, context.workspaceId),
      sql`${schema.issues.deletedAt} IS NULL`,
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
    dueDate: issue.dueDate,
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
  const issue = await verifyIssueAccess(db, context, issueId)

  if ((issue.description ?? "") === description) {
    return
  }

  const timestamp = nowIso()
  const teamMembers = await listTeamUserRecords(db, issue.teamId)
  const validMemberIds = new Set(teamMembers.map((member) => member.id))
  const previousMentionIds = new Set(
    extractMentionedUserIdsFromMarkdown(issue.description).filter((userId) =>
      validMemberIds.has(userId),
    ),
  )
  const nextMentionIds = new Set(
    extractMentionedUserIdsFromMarkdown(description).filter((userId) =>
      validMemberIds.has(userId),
    ),
  )
  const addedMentionIds = Array.from(nextMentionIds).filter(
    (userId) => !previousMentionIds.has(userId),
  )

  await db
    .update(schema.issues)
    .set({ description, updatedAt: timestamp })
    .where(
      and(
        eq(schema.issues.id, issueId),
        eq(schema.issues.workspaceId, issue.workspaceId)
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

  await notifyIssueMentions(
    db,
    issue,
    context.userId,
    addedMentionIds,
  )
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

  if (issue.status === status) {
    return
  }

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

  const { metadata } = await buildIssueNotificationMetadata(db, issue)
  const genericRecipients = await listIssueParticipantUserIds(db, issue)

  await createNotificationsForEvent(db, {
    workspaceId: issue.workspaceId,
    actorUserId: context.userId,
    recipients: genericRecipients,
    type: "issue_status_changed",
    title: `${issue.identifier} moved to ${status}`,
    body: issue.title,
    entityType: "issue",
    entityId: issue.id,
    metadata: {
      ...metadata,
      statusFrom: issue.status,
      statusTo: status,
    },
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
  const issue = await verifyIssueAccess(db, context, issueId)

  if (issue.assigneeUserId === assigneeUserId) {
    return
  }

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

  await notifyIssueAssignment(db, issue, context.userId, assigneeUserId)
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

export async function updateIssueDueDateForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string,
  dueDate: string | null,
): Promise<void> {
  const issue = await verifyIssueAccess(db, context, issueId)

  if ((issue.dueDate ?? null) === dueDate) {
    return
  }

  await db
    .update(schema.issues)
    .set({ dueDate, updatedAt: nowIso() })
    .where(eq(schema.issues.id, issueId))
}

export async function updateCycleStatusForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  cycleId: string,
  status: CycleStatus,
): Promise<void> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const cycle = await db.query.cycles.findFirst({
    where: eq(schema.cycles.id, cycleId),
  })

  if (!cycle) {
    throw new Error("Cycle not found")
  }

  const team = await db
    .select({ team: schema.teams })
    .from(schema.teams)
    .innerJoin(schema.teamMemberships, eq(schema.teamMemberships.teamId, schema.teams.id))
    .where(
      and(
        eq(schema.teams.id, cycle.teamId),
        eq(schema.teams.workspaceId, context.workspaceId),
        eq(schema.teamMemberships.userId, context.userId),
      ),
    )
    .limit(1)

  const teamRow = team[0]?.team

  if (!teamRow) {
    throw new Error("Not authorized to update this cycle")
  }

  const isValidTransition =
    (cycle.status === "upcoming" && status === "active") ||
    (cycle.status === "active" && status === "completed")

  if (!isValidTransition) {
    throw new Error(`Invalid cycle status transition: ${cycle.status} -> ${status}`)
  }

  const timestamp = nowIso()

  await db
    .update(schema.cycles)
    .set({ status, updatedAt: timestamp })
    .where(eq(schema.cycles.id, cycleId))

  const teamMembers = await listTeamUserRecords(db, cycle.teamId)

  await createNotificationsForEvent(db, {
    workspaceId: context.workspaceId,
    actorUserId: context.userId,
    recipients: teamMembers.map((member) => member.id),
    type: status === "active" ? "cycle_started" : "cycle_completed",
    title: `${cycle.name} ${status === "active" ? "started" : "completed"}`,
    body: teamRow.name,
    entityType: "cycle",
    entityId: cycle.id,
    metadata: {
      teamSlug: teamRow.slug,
      teamName: teamRow.name,
      cycleName: cycle.name,
    },
  })
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

async function getAccessibleOwnedSavedViewRecord(
  db: TicketsDatabase,
  context: ViewerContext,
  viewId: string,
) {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const rows = await db
    .select({
      view: schema.savedViews,
      team: schema.teams,
    })
    .from(schema.savedViews)
    .innerJoin(schema.teams, eq(schema.savedViews.teamId, schema.teams.id))
    .innerJoin(schema.teamMemberships, eq(schema.teamMemberships.teamId, schema.teams.id))
    .where(
      and(
        eq(schema.savedViews.id, viewId),
        eq(schema.savedViews.workspaceId, context.workspaceId),
        eq(schema.savedViews.ownerUserId, context.userId),
        eq(schema.teamMemberships.userId, context.userId),
      ),
    )
    .limit(1)

  const row = rows[0]

  if (!row) {
    throw new Error("Saved view not found")
  }

  return row
}

export async function listSavedViewsForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
): Promise<TicketSavedView[]> {
  if (!context.workspaceId) {
    return []
  }

  const rows = await db
    .select({
      view: schema.savedViews,
      team: schema.teams,
    })
    .from(schema.savedViews)
    .innerJoin(schema.teams, eq(schema.savedViews.teamId, schema.teams.id))
    .innerJoin(schema.teamMemberships, eq(schema.teamMemberships.teamId, schema.teams.id))
    .where(
      and(
        eq(schema.savedViews.workspaceId, context.workspaceId),
        eq(schema.savedViews.ownerUserId, context.userId),
        eq(schema.teamMemberships.userId, context.userId),
      ),
    )
    .orderBy(desc(schema.savedViews.updatedAt), asc(schema.savedViews.name))

  return rows.map((row) => mapSavedView(row.view, row.team))
}

export async function getSavedViewForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  viewId: string,
): Promise<TicketSavedView | null> {
  if (!context.workspaceId) {
    return null
  }

  const row = await getAccessibleOwnedSavedViewRecord(db, context, viewId)
  return mapSavedView(row.view, row.team)
}

export async function createSavedViewForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  input: {
    teamId: string
    name: string
    presetFilter?: IssueFilter
    advancedFilters?: IssueAdvancedFilters
  },
): Promise<TicketSavedView> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const teamRows = await db
    .select({ team: schema.teams })
    .from(schema.teams)
    .innerJoin(schema.teamMemberships, eq(schema.teamMemberships.teamId, schema.teams.id))
    .where(
      and(
        eq(schema.teams.id, input.teamId),
        eq(schema.teams.workspaceId, context.workspaceId),
        eq(schema.teamMemberships.userId, context.userId),
      ),
    )
    .limit(1)

  const team = teamRows[0]?.team

  if (!team) {
    throw new Error("Team not found")
  }

  const timestamp = nowIso()
  const viewId = crypto.randomUUID()

  await db.insert(schema.savedViews).values({
    id: viewId,
    workspaceId: context.workspaceId,
    teamId: team.id,
    ownerUserId: context.userId,
    name: input.name,
    presetFilter: input.advancedFilters ? null : (input.presetFilter ?? null),
    advancedFiltersJson: input.advancedFilters ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return {
    id: viewId,
    name: input.name,
    teamId: team.id,
    teamSlug: team.slug,
    teamName: team.name,
    teamColor: team.color,
    createdAt: timestamp,
    updatedAt: timestamp,
    presetFilter: input.advancedFilters ? undefined : input.presetFilter,
    advancedFilters: input.advancedFilters,
  }
}

export async function updateSavedViewForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  viewId: string,
  updates: {
    name?: string
    presetFilter?: IssueFilter | null
    advancedFilters?: IssueAdvancedFilters | null
  },
): Promise<TicketSavedView> {
  const row = await getAccessibleOwnedSavedViewRecord(db, context, viewId)
  const timestamp = nowIso()

  const nextAdvancedFilters =
    updates.advancedFilters === undefined
      ? (row.view.advancedFiltersJson as IssueAdvancedFilters | null)
      : updates.advancedFilters
  const nextPresetFilter =
    nextAdvancedFilters
      ? null
      : updates.presetFilter === undefined
        ? (row.view.presetFilter as IssueFilter | null)
        : updates.presetFilter

  await db
    .update(schema.savedViews)
    .set({
      name: updates.name ?? row.view.name,
      presetFilter: nextPresetFilter,
      advancedFiltersJson: nextAdvancedFilters,
      updatedAt: timestamp,
    })
    .where(eq(schema.savedViews.id, viewId))

  return {
    ...mapSavedView(row.view, row.team),
    name: updates.name ?? row.view.name,
    presetFilter: nextPresetFilter ?? undefined,
    advancedFilters: nextAdvancedFilters ?? undefined,
    updatedAt: timestamp,
  }
}

export async function deleteSavedViewForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  viewId: string,
): Promise<void> {
  await getAccessibleOwnedSavedViewRecord(db, context, viewId)

  await db.delete(schema.savedViews).where(eq(schema.savedViews.id, viewId))
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
  const issue = await verifyIssueAccess(db, context, issueId)
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

  const teamMembers = await listTeamUserRecords(db, issue.teamId)
  const mentionedUserIds = extractMentionedUserIdsFromComment(body, teamMembers)
  const genericRecipients = await listIssueParticipantUserIds(db, issue)
  const genericRecipientsWithoutMentions = genericRecipients.filter(
    (recipientId) => !mentionedUserIds.includes(recipientId),
  )
  const { metadata } = await buildIssueNotificationMetadata(db, issue)

  await Promise.all([
    createNotificationsForEvent(db, {
      workspaceId: issue.workspaceId,
      actorUserId: context.userId,
      recipients: genericRecipientsWithoutMentions,
      type: "issue_commented",
      title: `New comment on ${issue.identifier}`,
      body: issue.title,
      entityType: "issue",
      entityId: issue.id,
      metadata: {
        ...metadata,
        commentPreview: body.slice(0, 140),
      },
    }),
    notifyIssueMentions(db, issue, context.userId, mentionedUserIds, body),
  ])

  return { id: commentId }
}

export async function archiveIssueForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string
): Promise<void> {
  await verifyIssueAccess(db, context, issueId)
  const timestamp = nowIso()

  await db
    .update(schema.issues)
    .set({ archivedAt: timestamp, updatedAt: timestamp })
    .where(eq(schema.issues.id, issueId))
}

export async function deleteIssueForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string
): Promise<void> {
  await verifyIssueAccess(db, context, issueId)
  const timestamp = nowIso()

  await db
    .update(schema.issues)
    .set({ deletedAt: timestamp, updatedAt: timestamp })
    .where(eq(schema.issues.id, issueId))
}

export async function toggleIssueFavoriteForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string
): Promise<{ favorited: boolean }> {
  await verifyIssueAccess(db, context, issueId)

  const existing = await db.query.issueFavorites.findFirst({
    where: and(
      eq(schema.issueFavorites.userId, context.userId),
      eq(schema.issueFavorites.issueId, issueId),
    ),
  })

  if (existing) {
    await db
      .delete(schema.issueFavorites)
      .where(
        and(
          eq(schema.issueFavorites.userId, context.userId),
          eq(schema.issueFavorites.issueId, issueId),
        )
      )
    return { favorited: false }
  }

  await db.insert(schema.issueFavorites).values({
    userId: context.userId,
    issueId,
    createdAt: nowIso(),
  })

  return { favorited: true }
}

export async function getIssueFavoriteForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  issueId: string
): Promise<{ favorited: boolean }> {
  if (!context.workspaceId) {
    return { favorited: false }
  }

  const existing = await db.query.issueFavorites.findFirst({
    where: and(
      eq(schema.issueFavorites.userId, context.userId),
      eq(schema.issueFavorites.issueId, issueId),
    ),
  })

  return { favorited: !!existing }
}

export async function listProjectsForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<TicketProject[]> {
  if (!context.workspaceId) {
    return []
  }

  const rows = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.workspaceId, context.workspaceId))
    .orderBy(asc(schema.projects.name))

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    status: row.status,
    leadUserId: row.leadUserId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

// ---------------------------------------------------------------------------
// Dashboard aggregation queries (workspace-level)
// ---------------------------------------------------------------------------

export async function getDashboardStatsForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<{ byStatus: Record<string, number>; total: number }> {
  if (!context.workspaceId) {
    return { byStatus: {}, total: 0 }
  }

  const rows = await db
    .select({
      status: schema.issues.status,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(schema.issues)
    .where(
      and(
        eq(schema.issues.workspaceId, context.workspaceId),
        sql`${schema.issues.deletedAt} IS NULL`,
        sql`${schema.issues.archivedAt} IS NULL`
      )
    )
    .groupBy(schema.issues.status)

  const byStatus: Record<string, number> = {}
  let total = 0
  for (const row of rows) {
    byStatus[row.status] = Number(row.count)
    total += Number(row.count)
  }

  return { byStatus, total }
}

export type CrossTeamIssue = TicketIssue & { teamSlug: string }

export async function listMyIssuesAcrossTeams(
  db: TicketsDatabase,
  context: ViewerContext,
  limit = 20
): Promise<CrossTeamIssue[]> {
  if (!context.workspaceId) {
    return []
  }

  const issueRows = await db
    .select({
      issue: schema.issues,
      teamSlug: schema.teams.slug,
    })
    .from(schema.issues)
    .innerJoin(schema.teams, eq(schema.issues.teamId, schema.teams.id))
    .where(
      and(
        eq(schema.issues.workspaceId, context.workspaceId),
        eq(schema.issues.assigneeUserId, context.userId),
        sql`${schema.issues.deletedAt} IS NULL`,
        sql`${schema.issues.archivedAt} IS NULL`
      )
    )
    .orderBy(desc(schema.issues.priorityScore), desc(schema.issues.updatedAt))
    .limit(limit)

  if (issueRows.length === 0) {
    return []
  }

  const issueIds = issueRows.map((r) => r.issue.id)

  const labelRows = await db
    .select({
      issueId: schema.issueLabels.issueId,
      labelId: schema.labels.id,
      labelName: schema.labels.name,
      labelColor: schema.labels.color,
    })
    .from(schema.issueLabels)
    .innerJoin(schema.labels, eq(schema.issueLabels.labelId, schema.labels.id))
    .where(inArray(schema.issueLabels.issueId, issueIds))

  const labelsByIssueId = new Map<string, TicketIssue["labels"]>()
  for (const row of labelRows) {
    const current = labelsByIssueId.get(row.issueId) ?? []
    current.push({ id: row.labelId, name: row.labelName, color: row.labelColor })
    labelsByIssueId.set(row.issueId, current)
  }

  const assignee = await db.query.users.findFirst({
    where: eq(schema.users.id, context.userId),
  })
  const mappedAssignee = assignee ? mapUser(assignee) : undefined

  return issueRows.map(({ issue, teamSlug }) => ({
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    status: issue.status,
    priority: issue.priority,
    priorityScore: issue.priorityScore,
    labels: labelsByIssueId.get(issue.id) ?? [],
    assignees: mappedAssignee ? [mappedAssignee] : [],
    cycleId: issue.cycleId,
    dueDate: issue.dueDate,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    teamSlug,
  }))
}

export type ActiveCycleWithProgress = {
  cycle: TicketCycle
  teamName: string
  teamSlug: string
  totalIssues: number
  completedIssues: number
}

export async function listActiveCyclesAcrossTeams(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<ActiveCycleWithProgress[]> {
  if (!context.workspaceId) {
    return []
  }

  const cycleRows = await db
    .select({
      cycle: schema.cycles,
      teamName: schema.teams.name,
      teamSlug: schema.teams.slug,
    })
    .from(schema.cycles)
    .innerJoin(schema.teams, eq(schema.cycles.teamId, schema.teams.id))
    .innerJoin(
      schema.teamMemberships,
      eq(schema.teamMemberships.teamId, schema.teams.id)
    )
    .where(
      and(
        eq(schema.teams.workspaceId, context.workspaceId),
        eq(schema.teamMemberships.userId, context.userId),
        eq(schema.cycles.status, "active")
      )
    )
    .orderBy(asc(schema.cycles.startDate))

  if (cycleRows.length === 0) {
    return []
  }

  const cycleIds = cycleRows.map((r) => r.cycle.id)

  const issueCountRows = await db
    .select({
      cycleId: schema.issues.cycleId,
      total: sql<number>`count(*)`.as("total"),
      completed: sql<number>`sum(case when ${schema.issues.status} in ('done', 'cancelled') then 1 else 0 end)`.as("completed"),
    })
    .from(schema.issues)
    .where(
      and(
        inArray(schema.issues.cycleId, cycleIds),
        sql`${schema.issues.deletedAt} IS NULL`
      )
    )
    .groupBy(schema.issues.cycleId)

  const countsByCycleId = new Map(
    issueCountRows.map((r) => [
      r.cycleId,
      { total: Number(r.total), completed: Number(r.completed) },
    ])
  )

  return cycleRows.map(({ cycle, teamName, teamSlug }) => {
    const counts = countsByCycleId.get(cycle.id) ?? { total: 0, completed: 0 }
    return {
      cycle: mapCycle(cycle),
      teamName,
      teamSlug,
      totalIssues: counts.total,
      completedIssues: counts.completed,
    }
  })
}
