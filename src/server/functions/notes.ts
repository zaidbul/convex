import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db/connection"
import {
  listNotesForViewer,
  getNoteByIdForViewer,
  createNoteForViewer,
  updateNoteForViewer,
  deleteNoteForViewer,
} from "./notes-data"
import { getViewerContext } from "./viewer-context"

export const listNotes = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listNotesForViewer(db, viewerContext)
})

export const getNoteById = createServerFn({ method: "GET" })
  .inputValidator((data: { noteId: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return getNoteByIdForViewer(db, viewerContext, data.noteId)
  })

export const createNote = createServerFn({ method: "POST" })
  .inputValidator((data: { title: string; content?: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createNoteForViewer(db, viewerContext, data)
  })

export const updateNote = createServerFn({ method: "POST" })
  .inputValidator((data: { noteId: string; title?: string; content?: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateNoteForViewer(db, viewerContext, data.noteId, {
      title: data.title,
      content: data.content,
    })
  })

export const deleteNote = createServerFn({ method: "POST" })
  .inputValidator((data: { noteId: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return deleteNoteForViewer(db, viewerContext, data.noteId)
  })
