import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db/connection"
import {
  autoCreateTicketsFromSuggestions,
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
import {
  createFeedbackImportSchema,
  listFeedbackSuggestionsSchema,
  feedbackSuggestionIdSchema,
  updateFeedbackSuggestionSchema,
  createIssueFromSuggestionSchema,
  runFeedbackAnalysisSchema,
  autoCreateTicketsSchema,
} from "./validation-schemas"

export const createFeedbackImport = createServerFn({ method: "POST" })
  .inputValidator(createFeedbackImportSchema)
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
  .inputValidator(listFeedbackSuggestionsSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listFeedbackSuggestionsForViewer(db, viewerContext, data)
  })

export const getFeedbackSuggestion = createServerFn({ method: "GET" })
  .inputValidator(feedbackSuggestionIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return getFeedbackSuggestionForViewer(db, viewerContext, data.suggestionId)
  })

export const updateFeedbackSuggestion = createServerFn({ method: "POST" })
  .inputValidator(updateFeedbackSuggestionSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return updateFeedbackSuggestionForViewer(db, viewerContext, data.suggestionId, {
      status: data.status,
      selectedTeamId: data.selectedTeamId,
    })
  })

export const createIssueFromSuggestion = createServerFn({ method: "POST" })
  .inputValidator(createIssueFromSuggestionSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createIssueFromFeedbackSuggestionForViewer(db, viewerContext, data)
  })

export const runFeedbackAnalysisInternal = createServerFn({ method: "POST" })
  .inputValidator(runFeedbackAnalysisSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    if (!viewerContext.workspaceId) {
      throw new Error("No active workspace")
    }

    return runFeedbackAnalysis(db, {
      workspaceId: viewerContext.workspaceId,
      trigger: "manual",
      force: data?.force,
    })
  })

export const autoCreateTicketsFromFeedback = createServerFn({ method: "POST" })
  .inputValidator(autoCreateTicketsSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return autoCreateTicketsFromSuggestions(db, viewerContext, data)
  })
