import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client/node"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
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
  listCyclesForViewerTeam,
  listIssuesForViewerTeam,
  listSavedViewsForViewer,
  listTeamsForViewer,
  syncViewerContext,
  type TicketsDatabase,
  updateIssueDueDateForViewer,
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
      })
    ).rejects.toThrow()

    await expect(
      testDb.db.insert(schema.teamMemberships).values({
        teamId: "team_1",
        userId: "user_1",
        createdAt: timestamp,
        updatedAt: timestamp,
      })
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
      })
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
      })
    ).rejects.toThrow()

    await expect(
      testDb.db.insert(schema.issueLabels).values({
        issueId: "issue_1",
        labelId: "label_1",
        createdAt: timestamp,
      })
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
