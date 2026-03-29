import { and, desc, eq, inArray, sql } from "drizzle-orm"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import * as schema from "@/db/schema"
import type { ViewerContext } from "./tickets-data"

type NotificationsDatabase = LibSQLDatabase<typeof schema>

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
  type: (typeof schema.notificationTypes)[number]
  title: string
  body: string | null
  entityType: (typeof schema.notificationEntityTypes)[number]
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
  type: (typeof schema.notificationTypes)[number]
  title: string
  body?: string | null
  entityType: (typeof schema.notificationEntityTypes)[number]
  entityId: string
  metadata?: NotificationMetadata
}

function nowIso(): string {
  return new Date().toISOString()
}

function isMissingNotificationsTableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  const message = error.message.toLowerCase()
  return (
    message.includes("no such table: notifications") ||
    (message.includes("notifications") && message.includes("failed query"))
  )
}

function handleMissingNotificationsTable(error: unknown): boolean {
  if (!isMissingNotificationsTableError(error)) {
    return false
  }

  console.warn(
    "[notifications] notifications table is missing. Run the latest Drizzle migrations to enable notifications.",
  )
  return true
}

function mapNotificationTypeFilter(
  filter: NotificationFilterType,
): Array<(typeof schema.notificationTypes)[number]> | undefined {
  switch (filter) {
    case "assignment":
      return ["issue_assigned"]
    case "status":
      return ["issue_status_changed"]
    case "comment":
      return ["issue_commented"]
    case "mention":
      return ["issue_mentioned"]
    case "cycle":
      return ["cycle_started", "cycle_completed"]
    default:
      return undefined
  }
}

export async function createNotificationsForEvent(
  db: NotificationsDatabase,
  input: CreateNotificationsInput,
): Promise<void> {
  try {
    const timestamp = nowIso()
    const recipientIds = Array.from(
      new Set(
        input.recipients.filter(
          (recipientId) => recipientId && recipientId !== input.actorUserId,
        ),
      ),
    )

    if (recipientIds.length === 0) {
      return
    }

    await db.insert(schema.notifications).values(
      recipientIds.map((recipientUserId) => ({
        id: crypto.randomUUID(),
        workspaceId: input.workspaceId,
        recipientUserId,
        actorUserId: input.actorUserId,
        type: input.type,
        title: input.title,
        body: input.body ?? null,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata ?? {},
        readAt: null,
        createdAt: timestamp,
      })),
    )
  } catch (error) {
    if (handleMissingNotificationsTable(error)) {
      return
    }
    throw error
  }
}

export async function listNotificationsForViewer(
  db: NotificationsDatabase,
  context: ViewerContext,
  input: {
    scope?: NotificationScope
    type?: NotificationFilterType
    limit?: number
    offset?: number
  },
): Promise<{ items: NotificationListItem[]; total: number }> {
  if (!context.workspaceId) {
    return { items: [], total: 0 }
  }

  try {
    const limit = Math.max(1, Math.min(input.limit ?? 25, 100))
    const offset = Math.max(0, input.offset ?? 0)
    const typeFilter = input.type ?? "all"
    const matchedTypes = mapNotificationTypeFilter(typeFilter)

    const filters = [
      eq(schema.notifications.workspaceId, context.workspaceId),
      eq(schema.notifications.recipientUserId, context.userId),
    ]

    if (input.scope === "unread") {
      filters.push(sql`${schema.notifications.readAt} IS NULL`)
    }

    if (matchedTypes) {
      filters.push(inArray(schema.notifications.type, matchedTypes))
    }

    const whereClause = and(...filters)

    const [rows, countRows] = await Promise.all([
      db
        .select({
          notification: schema.notifications,
          actor: schema.users,
        })
        .from(schema.notifications)
        .leftJoin(schema.users, eq(schema.notifications.actorUserId, schema.users.id))
        .where(whereClause)
        .orderBy(desc(schema.notifications.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(schema.notifications)
        .where(whereClause),
    ])

    return {
      items: rows.map((row) => ({
        id: row.notification.id,
        type: row.notification.type,
        title: row.notification.title,
        body: row.notification.body,
        entityType: row.notification.entityType,
        entityId: row.notification.entityId,
        readAt: row.notification.readAt,
        createdAt: row.notification.createdAt,
        actor: row.actor
          ? {
              id: row.actor.id,
              name: row.actor.name,
              initials: row.actor.initials,
              avatarUrl: row.actor.avatarUrl ?? undefined,
            }
          : null,
        metadata: (row.notification.metadata ?? {}) as NotificationMetadata,
      })),
      total: Number(countRows[0]?.count ?? 0),
    }
  } catch (error) {
    if (handleMissingNotificationsTable(error)) {
      return { items: [], total: 0 }
    }
    throw error
  }
}

export async function listRecentNotificationsForViewer(
  db: NotificationsDatabase,
  context: ViewerContext,
  input?: { limit?: number },
): Promise<NotificationListItem[]> {
  const result = await listNotificationsForViewer(db, context, {
    limit: input?.limit ?? 10,
    offset: 0,
  })

  return result.items
}

export async function getUnreadNotificationCountForViewer(
  db: NotificationsDatabase,
  context: ViewerContext,
): Promise<number> {
  if (!context.workspaceId) {
    return 0
  }

  try {
    const rows = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.workspaceId, context.workspaceId),
          eq(schema.notifications.recipientUserId, context.userId),
          sql`${schema.notifications.readAt} IS NULL`,
        ),
      )

    return Number(rows[0]?.count ?? 0)
  } catch (error) {
    if (handleMissingNotificationsTable(error)) {
      return 0
    }
    throw error
  }
}

export async function markNotificationAsReadForViewer(
  db: NotificationsDatabase,
  context: ViewerContext,
  notificationId: string,
): Promise<void> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  try {
    await db
      .update(schema.notifications)
      .set({ readAt: nowIso() })
      .where(
        and(
          eq(schema.notifications.id, notificationId),
          eq(schema.notifications.workspaceId, context.workspaceId),
          eq(schema.notifications.recipientUserId, context.userId),
        ),
      )
  } catch (error) {
    if (handleMissingNotificationsTable(error)) {
      return
    }
    throw error
  }
}

export async function markAllNotificationsAsReadForViewer(
  db: NotificationsDatabase,
  context: ViewerContext,
): Promise<void> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  try {
    await db
      .update(schema.notifications)
      .set({ readAt: nowIso() })
      .where(
        and(
          eq(schema.notifications.workspaceId, context.workspaceId),
          eq(schema.notifications.recipientUserId, context.userId),
          sql`${schema.notifications.readAt} IS NULL`,
        ),
      )
  } catch (error) {
    if (handleMissingNotificationsTable(error)) {
      return
    }
    throw error
  }
}
