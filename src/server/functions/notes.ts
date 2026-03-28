import { createServerFn } from "@tanstack/react-start"
import { auth, clerkClient } from "@clerk/tanstack-react-start/server"
import { db } from "@/db/connection"
import { syncViewerContext } from "./tickets-data"
import {
  listNotesForViewer,
  getNoteByIdForViewer,
  createNoteForViewer,
  updateNoteForViewer,
  deleteNoteForViewer,
} from "./notes-data"

async function getViewerContext() {
  const authState = await auth()

  if (!authState.userId) {
    throw new Error("Unauthorized")
  }

  const client = clerkClient()
  const [clerkUser, organization] = await Promise.all([
    client.users.getUser(authState.userId),
    authState.orgId
      ? client.organizations.getOrganization({ organizationId: authState.orgId })
      : Promise.resolve(null),
  ])

  return syncViewerContext(db, {
    auth: {
      userId: authState.userId,
      orgId: authState.orgId ?? null,
      orgRole: authState.orgRole ?? null,
      orgSlug: authState.orgSlug ?? null,
    },
    clerkUser,
    organization: organization
      ? {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        }
      : null,
  })
}

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
