import { and, desc, eq } from "drizzle-orm"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import * as schema from "@/db/schema"
import type { ViewerContext } from "./tickets-data"

type NotesDatabase = LibSQLDatabase<typeof schema>

function nowIso(): string {
  return new Date().toISOString()
}

export type NoteListItem = {
  id: string
  title: string
  updatedAt: string
  createdAt: string
}

export type NoteDetail = {
  id: string
  title: string
  content: string | null
  createdAt: string
  updatedAt: string
}

export async function listNotesForViewer(
  db: NotesDatabase,
  context: ViewerContext,
): Promise<NoteListItem[]> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const rows = await db
    .select({
      id: schema.notes.id,
      title: schema.notes.title,
      updatedAt: schema.notes.updatedAt,
      createdAt: schema.notes.createdAt,
    })
    .from(schema.notes)
    .where(
      and(
        eq(schema.notes.workspaceId, context.workspaceId),
        eq(schema.notes.authorUserId, context.userId),
      )
    )
    .orderBy(desc(schema.notes.updatedAt))

  return rows
}

export async function getNoteByIdForViewer(
  db: NotesDatabase,
  context: ViewerContext,
  noteId: string,
): Promise<NoteDetail | null> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const [row] = await db
    .select({
      id: schema.notes.id,
      title: schema.notes.title,
      content: schema.notes.content,
      createdAt: schema.notes.createdAt,
      updatedAt: schema.notes.updatedAt,
    })
    .from(schema.notes)
    .where(
      and(
        eq(schema.notes.id, noteId),
        eq(schema.notes.workspaceId, context.workspaceId),
        eq(schema.notes.authorUserId, context.userId),
      )
    )

  return row ?? null
}

export async function createNoteForViewer(
  db: NotesDatabase,
  context: ViewerContext,
  input: { title: string; content?: string },
): Promise<{ id: string }> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const noteId = crypto.randomUUID()
  const timestamp = nowIso()

  await db.insert(schema.notes).values({
    id: noteId,
    workspaceId: context.workspaceId,
    authorUserId: context.userId,
    title: input.title,
    content: input.content ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return { id: noteId }
}

export async function updateNoteForViewer(
  db: NotesDatabase,
  context: ViewerContext,
  noteId: string,
  input: { title?: string; content?: string },
): Promise<void> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const updates: Partial<Pick<typeof schema.notes.$inferInsert, "title" | "content" | "updatedAt">> = { updatedAt: nowIso() }
  if (input.title !== undefined) updates.title = input.title
  if (input.content !== undefined) updates.content = input.content

  await db
    .update(schema.notes)
    .set(updates)
    .where(
      and(
        eq(schema.notes.id, noteId),
        eq(schema.notes.workspaceId, context.workspaceId),
        eq(schema.notes.authorUserId, context.userId),
      )
    )
}

export async function deleteNoteForViewer(
  db: NotesDatabase,
  context: ViewerContext,
  noteId: string,
): Promise<void> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  await db
    .delete(schema.notes)
    .where(
      and(
        eq(schema.notes.id, noteId),
        eq(schema.notes.workspaceId, context.workspaceId),
        eq(schema.notes.authorUserId, context.userId),
      )
    )
}
