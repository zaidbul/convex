import { createFileRoute } from "@tanstack/react-router"
import { db } from "@/db/connection"
import { getViewerContext } from "@/server/functions/viewer-context"
import {
  getFeedbackChatForViewer,
  updateFeedbackChatStatus,
} from "@/server/functions/feedback-chat-data"
import { runFeedbackAnalysis } from "@/server/functions/feedback-data"
import { feedbackChatRedis } from "@/server/lib/redis"

const ANALYSIS_STATUS_PREFIX = "feedback-chat:analysis:"
const analysisStatusKey = (chatId: string) =>
  `${ANALYSIS_STATUS_PREFIX}${chatId}`

type AnalysisStatusRecord = {
  status: "idle" | "running" | "completed" | "failed"
  startedAt?: string
  completedAt?: string
  itemsProcessed?: number
  suggestionsProduced?: number
  error?: string
}

export const Route = createFileRoute("/api/chat/feedback/run-analysis")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const viewerContext = await getViewerContext()
        if (!viewerContext.workspaceId) {
          return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = (await request.json()) as { chatId?: string }
        if (!body.chatId) {
          return Response.json(
            { error: "chatId is required" },
            { status: 400 }
          )
        }

        const chat = await getFeedbackChatForViewer(
          db,
          viewerContext,
          body.chatId
        )
        if (!chat) {
          return Response.json({ error: "Chat not found" }, { status: 404 })
        }

        if (chat.readinessScore < 50) {
          return Response.json(
            {
              error: "Readiness score must be at least 50 to run analysis",
            },
            { status: 400 }
          )
        }

        // Update chat status
        await updateFeedbackChatStatus(db, body.chatId, "analysis_triggered")

        // Set Redis status
        const statusKey = analysisStatusKey(body.chatId)
        await feedbackChatRedis.set(
          statusKey,
          JSON.stringify({
            status: "running",
            startedAt: new Date().toISOString(),
          } satisfies AnalysisStatusRecord),
          { ex: 3600 }
        )

        // Run analysis (reuses existing pipeline)
        try {
          const result = await runFeedbackAnalysis(db, {
            workspaceId: viewerContext.workspaceId,
            force: false,
            trigger: "manual",
          })

          await updateFeedbackChatStatus(db, body.chatId, "completed")

          // Aggregate results across workspaces
          const totalItemsProcessed = result.results.reduce(
            (sum, r) => sum + (r.itemsProcessed ?? 0),
            0
          )
          const totalSuggestionsProduced = result.results.reduce(
            (sum, r) => sum + (r.suggestionsProduced ?? 0),
            0
          )

          const completedStatus: AnalysisStatusRecord = {
            status: "completed",
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            itemsProcessed: totalItemsProcessed,
            suggestionsProduced: totalSuggestionsProduced,
          }
          await feedbackChatRedis.set(
            statusKey,
            JSON.stringify(completedStatus),
            { ex: 3600 }
          )

          return Response.json({
            ok: true,
            itemsProcessed: totalItemsProcessed,
            suggestionsProduced: totalSuggestionsProduced,
          })
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Analysis failed"

          await updateFeedbackChatStatus(db, body.chatId, "completed")

          const failedStatus: AnalysisStatusRecord = {
            status: "failed",
            error: errorMessage,
          }
          await feedbackChatRedis.set(
            statusKey,
            JSON.stringify(failedStatus),
            { ex: 3600 }
          )

          return Response.json(
            { ok: false, error: errorMessage },
            { status: 500 }
          )
        }
      },

      GET: async ({ request }) => {
        const url = new URL(request.url)
        const chatId = url.searchParams.get("chatId")

        if (!chatId) {
          return Response.json(
            { error: "chatId is required" },
            { status: 400 }
          )
        }

        const statusKey = analysisStatusKey(chatId)
        const raw = await feedbackChatRedis.get<string>(statusKey)

        if (!raw) {
          return Response.json({ status: "idle" } satisfies AnalysisStatusRecord)
        }

        try {
          const parsed = JSON.parse(raw) as AnalysisStatusRecord
          return Response.json(parsed)
        } catch {
          return Response.json({ status: "idle" } satisfies AnalysisStatusRecord)
        }
      },
    },
  },
})
