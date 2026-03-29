import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db/connection"
import type { IssueFilter, IssueQueryFilters } from "@/components/tickets/types"

import {
  createCycleForViewer,
  archiveIssueForViewer,
  createSavedViewForViewer,
  createIssueCommentForViewer,
  createIssueForViewer,
  deleteSavedViewForViewer,
  deleteIssueForViewer,
  getAccessibleTeamBySlug,
  getIssueFavoriteForViewer,
  getIssueByIdForViewer,
  getSavedViewForViewer,
  getWorkspaceForViewer,
  listCyclesForViewerTeam,
  listIssueActivityForViewer,
  listIssueCommentsForViewer,
  listIssuesForViewerTeam,
  listLabelsForViewer,
  listSavedViewsForViewer,
  listTeamMembersForViewer,
  listTeamsForViewer,
  getDashboardStatsForViewer,
  listMyIssuesAcrossTeams,
  listActiveCyclesAcrossTeams,
  toggleIssueFavoriteForViewer,
  updateCycleStatusForViewer,
  updateIssueAssigneeForViewer,
  updateIssueCycleForViewer,
  updateIssueDueDateForViewer,
  updateIssueDescriptionForViewer,
  updateIssueLabelsForViewer,
  updateIssuePriorityForViewer,
  updateIssueStatusForViewer,
  updateIssueTitleForViewer,
  updateSavedViewForViewer,
} from "./tickets-data"
import { seedDemoDataForViewer } from "./seed-data"
import { getViewerContext } from "./viewer-context"
import {
  teamSlugSchema,
  issueIdSchema,
  getIssuesSchema,
  createIssueSchema,
  createCycleSchema,
  updateIssueDescriptionSchema,
  updateIssueStatusSchema,
  updateIssuePrioritySchema,
  updateIssueAssigneeSchema,
  updateIssueCycleSchema,
  updateIssueDueDateSchema,
  updateCycleStatusSchema,
  updateIssueLabelsSchema,
  updateIssueTitleSchema,
  teamIdSchema,
  viewIdSchema,
  createSavedViewSchema,
  updateSavedViewSchema,
  issueCommentSchema,
  myIssuesSchema,
} from "./validation-schemas"

export const getWorkspace = createServerFn({ method: "GET" }).handler(
  async () => {
    const viewerContext = await getViewerContext()
    return getWorkspaceForViewer(db, viewerContext)
  }
)

export const getTeams = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listTeamsForViewer(db, viewerContext)
})

export const getTeamBySlug = createServerFn({ method: "GET" })
  .inputValidator(teamSlugSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    const team = await getAccessibleTeamBySlug(db, viewerContext, data.teamSlug)

    if (!team) {
      throw new Error(`Team not found: ${data.teamSlug}`)
    }

    return team
  })

export const getCycles = createServerFn({ method: "GET" })
  .inputValidator(teamSlugSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listCyclesForViewerTeam(db, viewerContext, data.teamSlug)
  })

export const getIssues = createServerFn({ method: "GET" })
  .inputValidator(getIssuesSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    const filters =
      typeof data.filter === "string"
        ? { presetFilter: data.filter as IssueFilter }
        : data.filter

    return listIssuesForViewerTeam(db, viewerContext, data.teamSlug, filters)
  })

export const createIssue = createServerFn({ method: "POST" })
  .inputValidator(createIssueSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createIssueForViewer(db, viewerContext, {
      teamId: data.teamId,
      title: data.title,
      description: data.description,
      status: data.status ?? "backlog",
      priority: data.priority ?? "none",
      dueDate: data.dueDate ?? null,
    })
  })

export const createCycle = createServerFn({ method: "POST" })
  .inputValidator(createCycleSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createCycleForViewer(db, viewerContext, data)
  })

export const getIssueById = createServerFn({ method: "GET" })
  .inputValidator(issueIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return getIssueByIdForViewer(db, viewerContext, data.issueId)
  })

export const updateIssueDescription = createServerFn({ method: "POST" })
  .inputValidator(updateIssueDescriptionSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueDescriptionForViewer(
      db,
      viewerContext,
      data.issueId,
      data.description
    )
  })

export const updateIssueStatus = createServerFn({ method: "POST" })
  .inputValidator(updateIssueStatusSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueStatusForViewer(
      db,
      viewerContext,
      data.issueId,
      data.status
    )
  })

export const updateIssuePriority = createServerFn({ method: "POST" })
  .inputValidator(updateIssuePrioritySchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssuePriorityForViewer(
      db,
      viewerContext,
      data.issueId,
      data.priority
    )
  })

export const updateIssueAssignee = createServerFn({ method: "POST" })
  .inputValidator(updateIssueAssigneeSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueAssigneeForViewer(
      db,
      viewerContext,
      data.issueId,
      data.assigneeUserId
    )
  })

export const updateIssueCycle = createServerFn({ method: "POST" })
  .inputValidator(updateIssueCycleSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueCycleForViewer(
      db,
      viewerContext,
      data.issueId,
      data.cycleId
    )
  })

export const updateIssueDueDate = createServerFn({ method: "POST" })
  .inputValidator(updateIssueDueDateSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueDueDateForViewer(
      db,
      viewerContext,
      data.issueId,
      data.dueDate
    )
  })

export const updateCycleStatus = createServerFn({ method: "POST" })
  .inputValidator(updateCycleStatusSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateCycleStatusForViewer(
      db,
      viewerContext,
      data.cycleId,
      data.status
    )
  })

export const updateIssueLabels = createServerFn({ method: "POST" })
  .inputValidator(updateIssueLabelsSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueLabelsForViewer(
      db,
      viewerContext,
      data.issueId,
      data.labelIds
    )
  })

export const updateIssueTitle = createServerFn({ method: "POST" })
  .inputValidator(updateIssueTitleSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateIssueTitleForViewer(
      db,
      viewerContext,
      data.issueId,
      data.title
    )
  })

export const getTeamMembers = createServerFn({ method: "GET" })
  .inputValidator(teamIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listTeamMembersForViewer(db, viewerContext, data.teamId)
  })

export const getLabels = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listLabelsForViewer(db, viewerContext)
})

export const getSavedViews = createServerFn({ method: "GET" }).handler(
  async () => {
    const viewerContext = await getViewerContext()
    return listSavedViewsForViewer(db, viewerContext)
  }
)

export const getSavedView = createServerFn({ method: "GET" })
  .inputValidator(viewIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return getSavedViewForViewer(db, viewerContext, data.viewId)
  })

export const createSavedView = createServerFn({ method: "POST" })
  .inputValidator(createSavedViewSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createSavedViewForViewer(db, viewerContext, {
      teamId: data.teamId,
      name: data.name,
      presetFilter: data.presetFilter as IssueQueryFilters["presetFilter"],
      advancedFilters: data.advancedFilters,
    })
  })

export const updateSavedView = createServerFn({ method: "POST" })
  .inputValidator(updateSavedViewSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateSavedViewForViewer(db, viewerContext, data.viewId, {
      name: data.name,
      presetFilter: data.presetFilter as
        | IssueQueryFilters["presetFilter"]
        | null
        | undefined,
      advancedFilters: data.advancedFilters,
    })
  })

export const deleteSavedView = createServerFn({ method: "POST" })
  .inputValidator(viewIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return deleteSavedViewForViewer(db, viewerContext, data.viewId)
  })

export const getIssueActivity = createServerFn({ method: "GET" })
  .inputValidator(issueIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listIssueActivityForViewer(db, viewerContext, data.issueId)
  })

export const getIssueComments = createServerFn({ method: "GET" })
  .inputValidator(issueIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listIssueCommentsForViewer(db, viewerContext, data.issueId)
  })

export const createIssueComment = createServerFn({ method: "POST" })
  .inputValidator(issueCommentSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createIssueCommentForViewer(
      db,
      viewerContext,
      data.issueId,
      data.body
    )
  })

export const archiveIssue = createServerFn({ method: "POST" })
  .inputValidator(issueIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return archiveIssueForViewer(db, viewerContext, data.issueId)
  })

export const deleteIssue = createServerFn({ method: "POST" })
  .inputValidator(issueIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return deleteIssueForViewer(db, viewerContext, data.issueId)
  })

export const toggleIssueFavorite = createServerFn({ method: "POST" })
  .inputValidator(issueIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return toggleIssueFavoriteForViewer(db, viewerContext, data.issueId)
  })

export const getIssueFavorite = createServerFn({ method: "GET" })
  .inputValidator(issueIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return getIssueFavoriteForViewer(db, viewerContext, data.issueId)
  })

// ---------------------------------------------------------------------------
// Dashboard aggregation endpoints
// ---------------------------------------------------------------------------

export const getDashboardStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const viewerContext = await getViewerContext()
    return getDashboardStatsForViewer(db, viewerContext)
  }
)

export const getMyIssues = createServerFn({ method: "GET" })
  .inputValidator(myIssuesSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listMyIssuesAcrossTeams(db, viewerContext, data.limit)
  })

export const getActiveCycles = createServerFn({ method: "GET" }).handler(
  async () => {
    const viewerContext = await getViewerContext()
    return listActiveCyclesAcrossTeams(db, viewerContext)
  }
)

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

export const seedDemoData = createServerFn({ method: "POST" }).handler(
  async () => {
    const viewerContext = await getViewerContext()
    return seedDemoDataForViewer(db, viewerContext)
  }
)
