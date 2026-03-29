import { and, asc, desc, eq } from "drizzle-orm"
import * as schema from "@/db/schema"
import type { TicketsDatabase, ViewerContext } from "./tickets-data"

function nowIso(): string {
  return new Date().toISOString()
}

import type { feedbackChatStatuses } from "@/db/schema"

type FeedbackChatStatus = (typeof feedbackChatStatuses)[number]

export type FeedbackChatRecord = {
  id: string
  title: string | null
  status: FeedbackChatStatus
  readinessScore: number
  linkedImportIds: string[]
  createdAt: string
  updatedAt: string
}

export type FeedbackChatMessageRecord = {
  id: string
  chatId: string
  role: string
  content: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolCallsJson: any[] | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolResultJson: any[] | null
  attachmentsJson:
    | Array<{ id: string; fileName: string; fileType: string; fileSize: number }>
    | null
  messageIndex: number
  createdAt: string
}

export type FeedbackChatDetail = FeedbackChatRecord & {
  messages: FeedbackChatMessageRecord[]
}

export async function createFeedbackChatForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  input: { title?: string }
): Promise<{ id: string }> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const id = crypto.randomUUID()
  const timestamp = nowIso()

  await db.insert(schema.feedbackChats).values({
    id,
    workspaceId: context.workspaceId,
    createdByUserId: context.userId,
    title: input.title ?? null,
    status: "active",
    readinessScore: 0,
    linkedImportIds: [],
    metadata: {},
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return { id }
}

export async function getFeedbackChatForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  chatId: string
): Promise<FeedbackChatDetail | null> {
  if (!context.workspaceId) return null

  const chat = await db.query.feedbackChats.findFirst({
    where: and(
      eq(schema.feedbackChats.id, chatId),
      eq(schema.feedbackChats.workspaceId, context.workspaceId)
    ),
  })

  if (!chat) return null

  const messages = await db.query.feedbackChatMessages.findMany({
    where: eq(schema.feedbackChatMessages.chatId, chatId),
    orderBy: asc(schema.feedbackChatMessages.messageIndex),
  })

  return {
    id: chat.id,
    title: chat.title,
    status: chat.status as FeedbackChatStatus,
    readinessScore: chat.readinessScore,
    linkedImportIds: chat.linkedImportIds,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    messages: messages.map((m) => ({
      id: m.id,
      chatId: m.chatId,
      role: m.role,
      content: m.content,
      toolCallsJson: (m.toolCallsJson ?? null) as any[] | null,
      toolResultJson: (m.toolResultJson ?? null) as any[] | null,
      attachmentsJson: m.attachmentsJson,
      messageIndex: m.messageIndex,
      createdAt: m.createdAt,
    })),
  }
}

export async function listFeedbackChatsForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<FeedbackChatRecord[]> {
  if (!context.workspaceId) return []

  const rows = await db.query.feedbackChats.findMany({
    where: eq(schema.feedbackChats.workspaceId, context.workspaceId),
    orderBy: desc(schema.feedbackChats.updatedAt),
  })

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status as FeedbackChatStatus,
    readinessScore: row.readinessScore,
    linkedImportIds: row.linkedImportIds,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

export async function deleteFeedbackChatForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  chatId: string
): Promise<{ deleted: boolean }> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const result = await db
    .delete(schema.feedbackChats)
    .where(
      and(
        eq(schema.feedbackChats.id, chatId),
        eq(schema.feedbackChats.workspaceId, context.workspaceId)
      )
    )

  return { deleted: (result.rowsAffected ?? 0) > 0 }
}

export async function saveFeedbackChatMessage(
  db: TicketsDatabase,
  chatId: string,
  message: {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    toolCallsJson?: unknown[] | null
    toolResultJson?: unknown | null
    attachmentsJson?: Array<{
      id: string
      fileName: string
      fileType: string
      fileSize: number
    }> | null
  }
): Promise<void> {
  // Get next message index
  const lastMessage = await db.query.feedbackChatMessages.findFirst({
    where: eq(schema.feedbackChatMessages.chatId, chatId),
    orderBy: desc(schema.feedbackChatMessages.messageIndex),
  })
  const nextIndex = (lastMessage?.messageIndex ?? -1) + 1

  await db
    .insert(schema.feedbackChatMessages)
    .values({
      id: message.id,
      chatId,
      role: message.role,
      content: message.content,
      toolCallsJson: message.toolCallsJson ?? null,
      toolResultJson: message.toolResultJson ?? null,
      attachmentsJson: message.attachmentsJson ?? null,
      messageIndex: nextIndex,
      createdAt: nowIso(),
    })
    .onConflictDoNothing()
}

export async function updateFeedbackChatReadiness(
  db: TicketsDatabase,
  chatId: string,
  score: number
): Promise<void> {
  const status = score >= 50 ? "ready" : "active"

  await db
    .update(schema.feedbackChats)
    .set({
      readinessScore: score,
      status,
      updatedAt: nowIso(),
    })
    .where(eq(schema.feedbackChats.id, chatId))
}

export async function updateFeedbackChatStatus(
  db: TicketsDatabase,
  chatId: string,
  status: "active" | "ready" | "analysis_triggered" | "completed"
): Promise<void> {
  await db
    .update(schema.feedbackChats)
    .set({ status, updatedAt: nowIso() })
    .where(eq(schema.feedbackChats.id, chatId))
}

export async function linkImportToChat(
  db: TicketsDatabase,
  chatId: string,
  importId: string
): Promise<void> {
  const chat = await db.query.feedbackChats.findFirst({
    where: eq(schema.feedbackChats.id, chatId),
  })

  if (!chat) return

  const current = chat.linkedImportIds ?? []
  if (!current.includes(importId)) {
    await db
      .update(schema.feedbackChats)
      .set({
        linkedImportIds: [...current, importId],
        updatedAt: nowIso(),
      })
      .where(eq(schema.feedbackChats.id, chatId))
  }
}

export async function saveFeedbackChatAttachment(
  db: TicketsDatabase,
  input: {
    id: string
    chatId: string
    messageId: string
    fileName: string
    fileType: string
    fileSize: number
    rawContent: string
  }
): Promise<void> {
  await db.insert(schema.feedbackChatAttachments).values({
    ...input,
    createdAt: nowIso(),
  })
}
