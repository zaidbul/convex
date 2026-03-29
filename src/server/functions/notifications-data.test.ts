import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import * as schema from "@/db/schema"
import {
  getUnreadNotificationCountForViewer,
  listNotificationsForViewer,
  markAllNotificationsAsReadForViewer,
  markNotificationAsReadForViewer,
} from "./notifications-data"
import {
  createIssueCommentForViewer,
  updateCycleStatusForViewer,
  updateIssueAssigneeForViewer,
  updateIssueDescriptionForViewer,
  type TicketsDatabase,
  type ViewerContext,
} from "./tickets-data"

const migrationsFolder = fileURLToPath(
  new URL("../../../drizzle", import.meta.url),
)

type SeededContext = {
  db: TicketsDatabase
  cleanup: () => Promise<void>
}

function nowIso(): string {
  return new Date().toISOString()
}

async function createTestDb(): Promise<SeededContext> {
  const directory = await mkdtemp(join(tmpdir(), "convex-notifications-db-"))
  const dbPath = join(directory, "notifications.db")
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
    {
      id: "user_3",
      clerkUserId: "user_3",
      name: "Cara Example",
      email: "cara@example.com",
      initials: "CE",
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
    {
      workspaceId: "org_1",
      userId: "user_3",
      role: "member",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ])

  await db.insert(schema.teams).values({
    id: "team_1",
    workspaceId: "org_1",
    name: "Platform",
    slug: "platform",
    identifier: "PLT",
    color: "#4f46e5",
    nextIssueNumber: 2,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  await db.insert(schema.teamMemberships).values([
    {
      teamId: "team_1",
      userId: "user_1",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      teamId: "team_1",
      userId: "user_2",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      teamId: "team_1",
      userId: "user_3",
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
    status: "upcoming",
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  await db.insert(schema.issues).values({
    id: "issue_1",
    workspaceId: "org_1",
    teamId: "team_1",
    projectId: null,
    cycleId: "cycle_1",
    creatorUserId: "user_1",
    assigneeUserId: "user_2",
    identifier: "PLT-1",
    sequenceNumber: 1,
    title: "Fix auth edge case",
    description: "Investigate auth redirect edge case",
    status: "todo",
    priority: "high",
    priorityScore: 3,
    createdAt: timestamp,
    updatedAt: timestamp,
    completedAt: null,
    cancelledAt: null,
    archivedAt: null,
    deletedAt: null,
  })

  await db.insert(schema.issueComments).values({
    id: "comment_1",
    issueId: "issue_1",
    authorUserId: "user_3",
    body: "I have context on this.",
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  })
}

describe("notification delivery", () => {
  let testDb: SeededContext
  const aliceContext: ViewerContext = {
    userId: "user_1",
    workspaceId: "org_1",
  }
  const bobContext: ViewerContext = {
    userId: "user_2",
    workspaceId: "org_1",
  }
  const caraContext: ViewerContext = {
    userId: "user_3",
    workspaceId: "org_1",
  }

  beforeEach(async () => {
    testDb = await createTestDb()
    await seedWorkspaceGraph(testDb.db)
  })

  afterEach(async () => {
    await testDb.cleanup()
  })

  test("assignment notifications go only to the assignee and exclude the actor", async () => {
    await updateIssueAssigneeForViewer(testDb.db, aliceContext, "issue_1", "user_3")

    const bobNotifications = await listNotificationsForViewer(testDb.db, bobContext, {})
    const caraNotifications = await listNotificationsForViewer(testDb.db, caraContext, {})

    expect(bobNotifications.items).toHaveLength(0)
    expect(caraNotifications.items).toHaveLength(1)
    expect(caraNotifications.items[0]?.type).toBe("issue_assigned")
  })

  test("description mentions notify only newly mentioned users", async () => {
    await updateIssueDescriptionForViewer(
      testDb.db,
      aliceContext,
      "issue_1",
      "Ping @[Bob Example](mention:user_2) and @[Cara Example](mention:user_3)",
    )

    await updateIssueDescriptionForViewer(
      testDb.db,
      aliceContext,
      "issue_1",
      "Ping @[Bob Example](mention:user_2) and @[Cara Example](mention:user_3) again",
    )

    const bobNotifications = await listNotificationsForViewer(testDb.db, bobContext, {})
    const caraNotifications = await listNotificationsForViewer(testDb.db, caraContext, {})

    expect(bobNotifications.items).toHaveLength(1)
    expect(caraNotifications.items).toHaveLength(1)
    expect(bobNotifications.items[0]?.type).toBe("issue_mentioned")
  })

  test("comment mentions replace the generic comment notification for mentioned recipients", async () => {
    await createIssueCommentForViewer(
      testDb.db,
      aliceContext,
      "issue_1",
      "@Cara Example please review this now.",
    )

    const bobNotifications = await listNotificationsForViewer(testDb.db, bobContext, {})
    const caraNotifications = await listNotificationsForViewer(testDb.db, caraContext, {})

    expect(bobNotifications.items.map((item) => item.type)).toContain("issue_commented")
    expect(caraNotifications.items).toHaveLength(1)
    expect(caraNotifications.items[0]?.type).toBe("issue_mentioned")
  })

  test("cycle transitions validate status changes and fan out notifications to team members", async () => {
    await updateCycleStatusForViewer(testDb.db, aliceContext, "cycle_1", "active")

    const bobNotifications = await listNotificationsForViewer(testDb.db, bobContext, {})
    const caraNotifications = await listNotificationsForViewer(testDb.db, caraContext, {})

    expect(bobNotifications.items[0]?.type).toBe("cycle_started")
    expect(caraNotifications.items[0]?.type).toBe("cycle_started")

    await expect(
      updateCycleStatusForViewer(testDb.db, aliceContext, "cycle_1", "upcoming"),
    ).rejects.toThrow("Invalid cycle status transition")
  })

  test("unread counts and read mutations update notification state", async () => {
    await updateIssueAssigneeForViewer(testDb.db, aliceContext, "issue_1", "user_3")
    await updateIssueDescriptionForViewer(
      testDb.db,
      aliceContext,
      "issue_1",
      "Ping @[Bob Example](mention:user_2)",
    )

    const unreadBefore = await getUnreadNotificationCountForViewer(testDb.db, bobContext)
    const notifications = await listNotificationsForViewer(testDb.db, bobContext, {
      scope: "unread",
    })

    expect(unreadBefore).toBeGreaterThan(0)
    expect(notifications.items.every((item) => item.readAt === null)).toBe(true)

    await markNotificationAsReadForViewer(
      testDb.db,
      bobContext,
      notifications.items[0]!.id,
    )

    const unreadAfterSingle = await getUnreadNotificationCountForViewer(testDb.db, bobContext)
    expect(unreadAfterSingle).toBe(unreadBefore - 1)

    await markAllNotificationsAsReadForViewer(testDb.db, bobContext)

    const unreadAfterAll = await getUnreadNotificationCountForViewer(testDb.db, bobContext)
    expect(unreadAfterAll).toBe(0)
  })
})
