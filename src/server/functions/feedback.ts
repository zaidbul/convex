import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db/connection"
import {
  createFeedbackImportForViewer,
  createIssueFromFeedbackSuggestionForViewer,
  getFeedbackSuggestionForViewer,
  listFeedbackClustersForViewer,
  listFeedbackImportsForViewer,
  listFeedbackItemsForViewer,
  listFeedbackSuggestionsForViewer,
  runFeedbackAnalysis,
  updateFeedbackSuggestionForViewer,
} from "./feedback-data"
import { getViewerContext } from "./viewer-context"
import type { CreateFeedbackImportInput } from "./feedback-domain"

export const createFeedbackImport = createServerFn({ method: "POST" })
  .inputValidator((data: CreateFeedbackImportInput) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createFeedbackImportForViewer(db, viewerContext, data)
  })

export const listFeedbackImports = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listFeedbackImportsForViewer(db, viewerContext)
})

export const listFeedbackItems = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listFeedbackItemsForViewer(db, viewerContext)
})

export const listFeedbackClusters = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listFeedbackClustersForViewer(db, viewerContext)
})

export const listFeedbackSuggestions = createServerFn({ method: "GET" })
  .inputValidator((data: { limit?: number } | undefined) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listFeedbackSuggestionsForViewer(db, viewerContext, data)
  })

export const getFeedbackSuggestion = createServerFn({ method: "GET" })
  .inputValidator((data: { suggestionId: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return getFeedbackSuggestionForViewer(db, viewerContext, data.suggestionId)
  })

export const updateFeedbackSuggestion = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      suggestionId: string
      status?: "new" | "reviewing" | "accepted" | "issue_created" | "dismissed"
      selectedTeamId?: string | null
    }) => data
  )
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateFeedbackSuggestionForViewer(db, viewerContext, data.suggestionId, {
      status: data.status,
      selectedTeamId: data.selectedTeamId,
    })
  })

export const createIssueFromSuggestion = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      suggestionId: string
      teamId?: string
      title?: string
      description?: string
    }) => data
  )
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createIssueFromFeedbackSuggestionForViewer(db, viewerContext, data)
  })

export const runFeedbackAnalysisInternal = createServerFn({ method: "POST" })
  .inputValidator((data: { workspaceId?: string; force?: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    if (!viewerContext.workspaceId && !data?.workspaceId) {
      throw new Error("No active workspace")
    }

    return runFeedbackAnalysis(db, {
      workspaceId: data?.workspaceId ?? viewerContext.workspaceId ?? undefined,
      trigger: "manual",
      force: data?.force,
    })
  })
