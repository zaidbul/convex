import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db/connection"
import { getViewerContext } from "./viewer-context"
import {
  createTeamForViewer,
  deleteTeamForViewer,
  listTeamsWithStatsForViewer,
  listWorkspaceMembersForViewer,
  removeMemberForViewer,
  updateMemberRoleForViewer,
  updateTeamForViewer,
  updateWorkspaceNameForViewer,
} from "./settings-data"
import {
  updateWorkspaceNameSchema,
  createTeamSettingsSchema,
  updateTeamSettingsSchema,
  deleteTeamSchema,
  updateMemberRoleSchema,
  removeMemberSchema,
} from "./validation-schemas"

// ── Queries ──────────────────────────────────────────────────────────

export const getWorkspaceMembers = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listWorkspaceMembersForViewer(db, viewerContext)
})

export const getTeamsWithStats = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listTeamsWithStatsForViewer(db, viewerContext)
})

// ── Mutations ────────────────────────────────────────────────────────

export const updateWorkspaceName = createServerFn({ method: "POST" })
  .inputValidator(updateWorkspaceNameSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    await updateWorkspaceNameForViewer(db, viewerContext, data.name.trim())
  })

export const createTeam = createServerFn({ method: "POST" })
  .inputValidator(createTeamSettingsSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createTeamForViewer(db, viewerContext, data)
  })

export const updateTeam = createServerFn({ method: "POST" })
  .inputValidator(updateTeamSettingsSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    await updateTeamForViewer(db, viewerContext, data)
  })

export const deleteTeam = createServerFn({ method: "POST" })
  .inputValidator(deleteTeamSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    await deleteTeamForViewer(db, viewerContext, data.teamId)
  })

export const updateMemberRole = createServerFn({ method: "POST" })
  .inputValidator(updateMemberRoleSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    await updateMemberRoleForViewer(db, viewerContext, data.userId, data.role)
  })

export const removeMember = createServerFn({ method: "POST" })
  .inputValidator(removeMemberSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    await removeMemberForViewer(db, viewerContext, data.userId)
  })
