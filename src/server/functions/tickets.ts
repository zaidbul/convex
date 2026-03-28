import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db/connection"
import type { IssuePriority, IssueStatus } from "@/components/tickets/types"
import {
  createIssueForViewer,
  getAccessibleTeamBySlug,
  getIssueByIdForViewer,
  getWorkspaceForViewer,
  listCyclesForViewerTeam,
  listIssuesForViewerTeam,
  listTeamsForViewer,
  updateIssueDescriptionForViewer,
} from "./tickets-data"
import { getViewerContext } from "./viewer-context"

export const getWorkspace = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return getWorkspaceForViewer(db, viewerContext)
})

export const getTeams = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listTeamsForViewer(db, viewerContext)
})

export const getTeamBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { teamSlug: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    const team = await getAccessibleTeamBySlug(db, viewerContext, data.teamSlug)

    if (!team) {
      throw new Error(`Team not found: ${data.teamSlug}`)
    }

    return team
  })

export const getCycles = createServerFn({ method: "GET" })
  .inputValidator((data: { teamSlug: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listCyclesForViewerTeam(db, viewerContext, data.teamSlug)
  })

export const getIssues = createServerFn({ method: "GET" })
  .inputValidator((data: { teamSlug: string; filter?: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listIssuesForViewerTeam(db, viewerContext, data.teamSlug, data.filter)
  })

export const createIssue = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      teamId: string
      title: string
      description?: string
      status?: string
      priority?: string
    }) => data
  )
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createIssueForViewer(db, viewerContext, {
      teamId: data.teamId,
      title: data.title,
      description: data.description,
      status: (data.status ?? "backlog") as IssueStatus,
      priority: (data.priority ?? "none") as IssuePriority,
    })
  })

export const getIssueById = createServerFn({ method: "GET" })
  .inputValidator((data: { issueId: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return getIssueByIdForViewer(db, viewerContext, data.issueId)
  })

export const updateIssueDescription = createServerFn({ method: "POST" })
  .inputValidator((data: { issueId: string; description: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueDescriptionForViewer(db, viewerContext, data.issueId, data.description)
  })
