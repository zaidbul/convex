import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db/connection"
import type { IssuePriority, IssueStatus } from "@/components/tickets/types"

import {
  createIssueCommentForViewer,
  createIssueForViewer,
  getAccessibleTeamBySlug,
  getIssueByIdForViewer,
  getWorkspaceForViewer,
  listCyclesForViewerTeam,
  listIssueActivityForViewer,
  listIssueCommentsForViewer,
  listIssuesForViewerTeam,
  listLabelsForViewer,
  listTeamMembersForViewer,
  listTeamsForViewer,
  updateIssueAssigneeForViewer,
  updateIssueCycleForViewer,
  updateIssueDescriptionForViewer,
  updateIssueLabelsForViewer,
  updateIssuePriorityForViewer,
  updateIssueStatusForViewer,
  updateIssueTitleForViewer,
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

export const updateIssueStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { issueId: string; status: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueStatusForViewer(db, viewerContext, data.issueId, data.status as IssueStatus)
  })

export const updateIssuePriority = createServerFn({ method: "POST" })
  .inputValidator((data: { issueId: string; priority: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssuePriorityForViewer(db, viewerContext, data.issueId, data.priority as IssuePriority)
  })

export const updateIssueAssignee = createServerFn({ method: "POST" })
  .inputValidator((data: { issueId: string; assigneeUserId: string | null }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueAssigneeForViewer(db, viewerContext, data.issueId, data.assigneeUserId)
  })

export const updateIssueCycle = createServerFn({ method: "POST" })
  .inputValidator((data: { issueId: string; cycleId: string | null }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueCycleForViewer(db, viewerContext, data.issueId, data.cycleId)
  })

export const updateIssueLabels = createServerFn({ method: "POST" })
  .inputValidator((data: { issueId: string; labelIds: string[] }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueLabelsForViewer(db, viewerContext, data.issueId, data.labelIds)
  })

export const updateIssueTitle = createServerFn({ method: "POST" })
  .inputValidator((data: { issueId: string; title: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueTitleForViewer(db, viewerContext, data.issueId, data.title)
  })

export const getTeamMembers = createServerFn({ method: "GET" })
  .inputValidator((data: { teamId: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listTeamMembersForViewer(db, viewerContext, data.teamId)
  })

export const getLabels = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listLabelsForViewer(db, viewerContext)
})

export const getIssueActivity = createServerFn({ method: "GET" })
  .inputValidator((data: { issueId: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listIssueActivityForViewer(db, viewerContext, data.issueId)
  })

export const getIssueComments = createServerFn({ method: "GET" })
  .inputValidator((data: { issueId: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listIssueCommentsForViewer(db, viewerContext, data.issueId)
  })

export const createIssueComment = createServerFn({ method: "POST" })
  .inputValidator((data: { issueId: string; body: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createIssueCommentForViewer(db, viewerContext, data.issueId, data.body)
  })
