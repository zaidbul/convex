import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client/node"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { asc, eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import * as schema from "@/db/schema"
import {
  createSavedViewForViewer,
  deleteSavedViewForViewer,
  getAccessibleTeamBySlug,
  getIssueByIdForViewer,
  getSavedViewForViewer,
  getWorkspaceForViewer,
  listIssueActivityForViewer,
  listIssueCommentsForViewer,
  listCyclesForViewerTeam,
  listIssuesForViewerTeam,
  listSavedViewsForViewer,
  listTeamMembersForViewer,
  listTeamsForViewer,
  syncViewerContext,
  type TicketsDatabase,
  updateIssueCycleForViewer,
  updateIssueDueDateForViewer,
  updateIssueStatusForViewer,
  updateSavedViewForViewer,
} from "./tickets-data"

const migrationsFolder = fileURLToPath(
  new URL("../../../drizzle", import.meta.url)
)

type SeededContext = {
  db: TicketsDatabase
  cleanup: () => Promise<void>
}

async function createTestDb(): Promise<SeededContext> {
  const directory = await mkdtemp(join(tmpdir(), "convex-ticket-db-"))
  const dbPath = join(directory, "tickets.db")
  const client = createClient({ url: `file:${dbPath}` })
  const db = drizzle(client, { schema })

  await migrate(db, { migrationsFolder })

  return {
    db,
    cleanup: async () => {
      await client.close()
      await rm(directory, { recursive: true, force: true })
    },
  }
}

function nowIso(): string {
  return new Date().toISOString()
}

async function seedWorkspaceGraph(db: TicketsDatabase) {
  const timestamp = nowIso()

  await db.insert(schema.users).values([
    {
      id: "user_1",
      clerkUserId: "user_1",
      name: "Alice Example",
      email: "alice@example.com",
      initials: "AE",
      avatarUrl: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "user_2",
      clerkUserId: "user_2",
      name: "Bob Example",
      email: "bob@example.com",
      initials: "BE",
      avatarUrl: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ])

  await db.insert(schema.workspaces).values({
    id: "org_1",
    clerkOrgId: "org_1",
    name: "Example Org",
    slug: "example-org",
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  await db.insert(schema.workspaceMemberships).values([
    {
      workspaceId: "org_1",
      userId: "user_1",
      role: "owner",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      workspaceId: "org_1",
      userId: "user_2",
      role: "member",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ])

  await db.insert(schema.teams).values([
    {
      id: "team_1",
      workspaceId: "org_1",
      name: "Platform",
      slug: "platform",
      identifier: "PLT",
      color: "blue",
      nextIssueNumber: 3,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "team_2",
      workspaceId: "org_1",
      name: "Design",
      slug: "design",
      identifier: "DSN",
      color: "purple",
      nextIssueNumber: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ])

  await db.insert(schema.teamMemberships).values([
    {
      teamId: "team_1",
      userId: "user_1",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      teamId: "team_2",
      userId: "user_2",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ])

  await db.insert(schema.cycles).values({
    id: "cycle_1",
    teamId: "team_1",
    name: "Cycle 1",
    number: 1,
    startDate: "2026-03-23",
    endDate: "2026-03-29",
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  await db.insert(schema.labels).values([
    {
      id: "label_1",
      workspaceId: "org_1",
      name: "Bug",
      color: "red",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "label_2",
      workspaceId: "org_1",
      name: "Feature",
      color: "green",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ])

  await db.insert(schema.issues).values([
    {
      id: "issue_1",
      workspaceId: "org_1",
      teamId: "team_1",

      cycleId: "cycle_1",
      creatorUserId: "user_1",
      assigneeUserId: "user_2",
      identifier: "PLT-1",
      sequenceNumber: 1,
      title: "Fix auth edge case",
      description: "Investigate auth redirect edge case",
      status: "in-progress",
      priority: "high",
      priorityScore: 90,
      dueDate: "2026-03-28",
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: null,
      cancelledAt: null,
    },
    {
      id: "issue_2",
      workspaceId: "org_1",
      teamId: "team_1",

      cycleId: null,
      creatorUserId: "user_1",
      assigneeUserId: null,
      identifier: "PLT-2",
      sequenceNumber: 2,
      title: "Backlog task",
      description: null,
      status: "backlog",
      priority: "none",
      priorityScore: 0,
      dueDate: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: null,
      cancelledAt: null,
    },
  ])

  await db.insert(schema.issueLabels).values([
    {
      issueId: "issue_1",
      labelId: "label_1",
      createdAt: timestamp,
    },
    {
      issueId: "issue_1",
      labelId: "label_2",
      createdAt: timestamp,
    },
  ])
}

describe("ticket schema and data helpers", () => {
  let testDb: SeededContext

  beforeEach(async () => {
    testDb = await createTestDb()
  })

  afterEach(async () => {
    await testDb.cleanup()
  })

  test("applies migrations and exposes the schema", async () => {
    const tables = await testDb.db.run(
      "select name from sqlite_master where type = 'table' and name = 'issues'"
    )

    expect(tables.rows).toHaveLength(1)
  })

  test("creates the composite issue indexes", async () => {
    const indexes = await testDb.db.run(
      "select name from sqlite_master where type = 'index' and tbl_name = 'issues' and name in ('issues_team_visible_order_idx', 'issues_team_status_visible_order_idx') order by name"
    )

    expect(indexes.rows).toEqual([
      { name: "issues_team_status_visible_order_idx" },
      { name: "issues_team_visible_order_idx" },
    ])
  })

  test("syncViewerContext upserts user, workspace, and membership", async () => {
    const context = await syncViewerContext(testDb.db, {
      auth: {
        userId: "user_sync",
        orgId: "org_sync",
        orgRole: "org:admin",
        orgSlug: "sync-org",
      },
      clerkUser: {
        id: "user_sync",
        firstName: "Sync",
        lastName: "User",
        username: "sync-user",
        imageUrl: null,
        emailAddresses: [{ emailAddress: "sync@example.com" }],
      },
      organization: {
        id: "org_sync",
        name: "Sync Org",
        slug: "sync-org",
      },
    })

    expect(context).toEqual({ userId: "user_sync", workspaceId: "org_sync" })

    const workspace = await getWorkspaceForViewer(testDb.db, context)
    expect(workspace).toEqual({ id: "org_sync", name: "Sync Org" })
  })

  test("enforces unique membership and issue constraints", async () => {
    await seedWorkspaceGraph(testDb.db)
    const timestamp = nowIso()

    await expect(
      testDb.db.insert(schema.workspaceMemberships).values({
        workspaceId: "org_1",
        userId: "user_1",
        role: "member",
        createdAt: timestamp,
        updatedAt: timestamp,
      }).execute()
    ).rejects.toThrow()

    await expect(
      testDb.db.insert(schema.teamMemberships).values({
        teamId: "team_1",
        userId: "user_1",
        createdAt: timestamp,
        updatedAt: timestamp,
      }).execute()
    ).rejects.toThrow()

    await expect(
      testDb.db.insert(schema.teams).values({
        id: "team_3",
        workspaceId: "org_1",
        name: "Duplicate Identifier",
        slug: "duplicate-identifier",
        identifier: "PLT",
        color: "orange",
        nextIssueNumber: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      }).execute()
    ).rejects.toThrow()

    await expect(
      testDb.db.insert(schema.issues).values({
        id: "issue_dup",
        workspaceId: "org_1",
        teamId: "team_1",
  
        cycleId: null,
        creatorUserId: "user_1",
        assigneeUserId: null,
        identifier: "PLT-99",
        sequenceNumber: 1,
        title: "Duplicate Sequence",
        description: null,
        status: "todo",
        priority: "low",
        priorityScore: 1,
        dueDate: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        completedAt: null,
        cancelledAt: null,
      }).execute()
    ).rejects.toThrow()

    await expect(
      testDb.db.insert(schema.issueLabels).values({
        issueId: "issue_1",
        labelId: "label_1",
        createdAt: timestamp,
      }).execute()
    ).rejects.toThrow()
  })

  test("scopes team access to memberships", async () => {
    await seedWorkspaceGraph(testDb.db)

    const visibleTeams = await listTeamsForViewer(testDb.db, {
      userId: "user_1",
      workspaceId: "org_1",
    })

    expect(visibleTeams.map((team) => team.slug)).toEqual(["platform"])

    const allowedTeam = await getAccessibleTeamBySlug(testDb.db, {
      userId: "user_1",
      workspaceId: "org_1",
    }, "platform")

    const blockedTeam = await getAccessibleTeamBySlug(testDb.db, {
      userId: "user_1",
      workspaceId: "org_1",
    }, "design")

    expect(allowedTeam?.slug).toBe("platform")
    expect(blockedTeam).toBeNull()
  })

  test("hydrates issues with labels and single-assignee arrays", async () => {
    await seedWorkspaceGraph(testDb.db)

    const issues = await listIssuesForViewerTeam(
      testDb.db,
      { userId: "user_1", workspaceId: "org_1" },
      "platform"
    )

    expect(issues).toHaveLength(2)
    expect(issues[0]).toMatchObject({
      identifier: "PLT-1",
      labels: [
        { id: "label_1", name: "Bug", color: "red" },
        { id: "label_2", name: "Feature", color: "green" },
      ],
    })
    expect(issues[0]?.assignees).toHaveLength(1)
    expect(issues[1]?.assignees).toEqual([])
  })

  test("supports due-date updates and advanced issue filters", async () => {
    await seedWorkspaceGraph(testDb.db)
    const viewer = { userId: "user_1", workspaceId: "org_1" as const }

    await updateIssueDueDateForViewer(testDb.db, viewer, "issue_2", "2026-03-29")

    const updatedIssue = await getIssueByIdForViewer(testDb.db, viewer, "issue_2")
    expect(updatedIssue?.dueDate).toBe("2026-03-29")

    const dueDateMatches = await listIssuesForViewerTeam(
      testDb.db,
      viewer,
      "platform",
      {
        advancedFilters: {
          logic: "and",
          statuses: [],
          priorities: [],
          assigneeIds: [],
          labelIds: [],
          cycleIds: [],
          dueFrom: "2026-03-28",
          dueTo: "2026-03-29",
        },
      },
    )

    expect(dueDateMatches.map((issue) => issue.identifier)).toEqual(["PLT-1", "PLT-2"])

    const orMatches = await listIssuesForViewerTeam(
      testDb.db,
      viewer,
      "platform",
      {
        advancedFilters: {
          logic: "or",
          statuses: ["backlog"],
          priorities: ["high"],
          assigneeIds: [],
          labelIds: [],
          cycleIds: [],
        },
      },
    )

    expect(orMatches.map((issue) => issue.identifier)).toEqual(["PLT-1", "PLT-2"])

    const labelMatches = await listIssuesForViewerTeam(
      testDb.db,
      viewer,
      "platform",
      {
        advancedFilters: {
          logic: "and",
          statuses: [],
          priorities: [],
          assigneeIds: [],
          labelIds: ["label_2"],
          cycleIds: [],
        },
      },
    )

    expect(labelMatches.map((issue) => issue.identifier)).toEqual(["PLT-1"])
  })

  test("keeps terminal timestamps in sync with status transitions", async () => {
    await seedWorkspaceGraph(testDb.db)
    const viewer = { userId: "user_1", workspaceId: "org_1" as const }

    await updateIssueStatusForViewer(testDb.db, viewer, "issue_1", "done")
    let issue = await testDb.db.query.issues.findFirst({
      where: eq(schema.issues.id, "issue_1"),
    })
    expect(issue?.completedAt).toBeTruthy()
    expect(issue?.cancelledAt).toBeNull()

    await updateIssueStatusForViewer(testDb.db, viewer, "issue_1", "todo")
    issue = await testDb.db.query.issues.findFirst({
      where: eq(schema.issues.id, "issue_1"),
    })
    expect(issue?.completedAt).toBeNull()
    expect(issue?.cancelledAt).toBeNull()

    await updateIssueStatusForViewer(testDb.db, viewer, "issue_1", "cancelled")
    issue = await testDb.db.query.issues.findFirst({
      where: eq(schema.issues.id, "issue_1"),
    })
    expect(issue?.completedAt).toBeNull()
    expect(issue?.cancelledAt).toBeTruthy()

    await updateIssueStatusForViewer(testDb.db, viewer, "issue_1", "backlog")
    issue = await testDb.db.query.issues.findFirst({
      where: eq(schema.issues.id, "issue_1"),
    })
    expect(issue?.completedAt).toBeNull()
    expect(issue?.cancelledAt).toBeNull()

    await updateIssueStatusForViewer(testDb.db, viewer, "issue_1", "done")
    issue = await testDb.db.query.issues.findFirst({
      where: eq(schema.issues.id, "issue_1"),
    })
    expect(issue?.completedAt).toBeTruthy()
    expect(issue?.cancelledAt).toBeNull()

    await updateIssueStatusForViewer(testDb.db, viewer, "issue_1", "cancelled")
    issue = await testDb.db.query.issues.findFirst({
      where: eq(schema.issues.id, "issue_1"),
    })
    expect(issue?.completedAt).toBeNull()
    expect(issue?.cancelledAt).toBeTruthy()

    await updateIssueStatusForViewer(testDb.db, viewer, "issue_1", "done")
    issue = await testDb.db.query.issues.findFirst({
      where: eq(schema.issues.id, "issue_1"),
    })
    expect(issue?.completedAt).toBeTruthy()
    expect(issue?.cancelledAt).toBeNull()
  })

  test("scopes team members to accessible teams", async () => {
    await seedWorkspaceGraph(testDb.db)

    const visibleMembers = await listTeamMembersForViewer(
      testDb.db,
      { userId: "user_1", workspaceId: "org_1" },
      "team_1",
    )

    const hiddenMembers = await listTeamMembersForViewer(
      testDb.db,
      { userId: "user_1", workspaceId: "org_1" },
      "team_2",
    )

    expect(visibleMembers.map((member) => member.id)).toEqual(["user_1"])
    expect(hiddenMembers).toEqual([])
  })

  test("rejects issue activity and comment reads outside the viewer's team membership", async () => {
    await seedWorkspaceGraph(testDb.db)
    const timestamp = nowIso()

    await testDb.db.insert(schema.issueActivity).values({
      id: "activity_1",
      issueId: "issue_1",
      actorUserId: "user_1",
      type: "comment",
      data: { commentId: "comment_1" },
      createdAt: timestamp,
    })

    await testDb.db.insert(schema.issueComments).values({
      id: "comment_1",
      issueId: "issue_1",
      authorUserId: "user_1",
      body: "Private discussion",
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    })

    const unauthorizedViewer = { userId: "user_2", workspaceId: "org_1" as const }

    await expect(
      listIssueActivityForViewer(testDb.db, unauthorizedViewer, "issue_1"),
    ).rejects.toThrow("Not authorized")

    await expect(
      listIssueCommentsForViewer(testDb.db, unauthorizedViewer, "issue_1"),
    ).rejects.toThrow("Not authorized")
  })

  test("logs cycle activity for assign, reassign, and remove flows", async () => {
    await seedWorkspaceGraph(testDb.db)
    const viewer = { userId: "user_1", workspaceId: "org_1" as const }
    const timestamp = nowIso()

    await testDb.db.insert(schema.cycles).values({
      id: "cycle_2",
      teamId: "team_1",
      name: "Cycle 2",
      number: 2,
      startDate: "2026-03-30",
      endDate: "2026-04-05",
      status: "upcoming",
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    await updateIssueCycleForViewer(testDb.db, viewer, "issue_2", "cycle_1")
    await updateIssueCycleForViewer(testDb.db, viewer, "issue_1", "cycle_2")
    await updateIssueCycleForViewer(testDb.db, viewer, "issue_1", null)

    const issue2Activity = await testDb.db.query.issueActivity.findMany({
      where: eq(schema.issueActivity.issueId, "issue_2"),
      orderBy: [asc(schema.issueActivity.createdAt)],
    })
    const issue1Activity = await testDb.db.query.issueActivity.findMany({
      where: eq(schema.issueActivity.issueId, "issue_1"),
      orderBy: [asc(schema.issueActivity.createdAt)],
    })

    expect(issue2Activity.at(-1)).toMatchObject({
      type: "cycle_change",
      data: { from: null, to: "Cycle 1" },
    })
    expect(issue1Activity.slice(-2)).toEqual([
      expect.objectContaining({
        type: "cycle_change",
        data: { from: "Cycle 1", to: "Cycle 2" },
      }),
      expect.objectContaining({
        type: "cycle_change",
        data: { from: "Cycle 2", to: null },
      }),
    ])
  })

  test("rejects assigning an issue to a cycle from another team", async () => {
    await seedWorkspaceGraph(testDb.db)
    const viewer = { userId: "user_1", workspaceId: "org_1" as const }
    const timestamp = nowIso()

    await testDb.db.insert(schema.cycles).values({
      id: "cycle_other_team",
      teamId: "team_2",
      name: "Design cycle",
      number: 1,
      startDate: "2026-03-23",
      endDate: "2026-03-29",
      status: "active",
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    await expect(
      updateIssueCycleForViewer(testDb.db, viewer, "issue_2", "cycle_other_team"),
    ).rejects.toThrow("Cycle not found")
  })

  test("creates, updates, and scopes saved views to the owner", async () => {
    await seedWorkspaceGraph(testDb.db)
    const ownerContext = { userId: "user_1", workspaceId: "org_1" as const }
    const otherContext = { userId: "user_2", workspaceId: "org_1" as const }

    const created = await createSavedViewForViewer(testDb.db, ownerContext, {
      teamId: "team_1",
      name: "High priority backlog",
      advancedFilters: {
        logic: "and",
        statuses: ["backlog"],
        priorities: ["high"],
        assigneeIds: [],
        labelIds: [],
        cycleIds: [],
      },
    })

    expect(created.name).toBe("High priority backlog")
    expect(created.advancedFilters?.statuses).toEqual(["backlog"])

    const ownerViews = await listSavedViewsForViewer(testDb.db, ownerContext)
    expect(ownerViews.map((view) => view.name)).toEqual(["High priority backlog"])

    const otherViews = await listSavedViewsForViewer(testDb.db, otherContext)
    expect(otherViews).toEqual([])

    const loaded = await getSavedViewForViewer(testDb.db, ownerContext, created.id)
    expect(loaded?.teamSlug).toBe("platform")

    const updated = await updateSavedViewForViewer(
      testDb.db,
      ownerContext,
      created.id,
      {
        name: "My active work",
        presetFilter: "my-issues",
        advancedFilters: null,
      },
    )

    expect(updated.name).toBe("My active work")
    expect(updated.presetFilter).toBe("my-issues")
    expect(updated.advancedFilters).toBeUndefined()

    await deleteSavedViewForViewer(testDb.db, ownerContext, created.id)
    expect(await listSavedViewsForViewer(testDb.db, ownerContext)).toEqual([])
  })

  test("supports empty workspace, team, cycle, and issue states", async () => {
    await testDb.db.insert(schema.users).values({
      id: "user_empty",
      clerkUserId: "user_empty",
      name: "Empty User",
      email: "empty@example.com",
      initials: "EU",
      avatarUrl: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    })

    const noWorkspace = await getWorkspaceForViewer(testDb.db, {
      userId: "user_empty",
      workspaceId: null,
    })
    const noTeams = await listTeamsForViewer(testDb.db, {
      userId: "user_empty",
      workspaceId: null,
    })
    const noCycles = await listCyclesForViewerTeam(
      testDb.db,
      { userId: "user_empty", workspaceId: "org_missing" },
      "missing"
    )
    const noIssues = await listIssuesForViewerTeam(
      testDb.db,
      { userId: "user_empty", workspaceId: "org_missing" },
      "missing"
    )

    expect(noWorkspace).toBeNull()
    expect(noTeams).toEqual([])
    expect(noCycles).toEqual([])
    expect(noIssues).toEqual([])
  })
})
