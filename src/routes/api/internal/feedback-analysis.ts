import { createFileRoute } from "@tanstack/react-router"
import { db } from "@/db/connection"
import { runFeedbackAnalysis } from "@/server/functions/feedback-data"

function unauthorized(message: string) {
  return Response.json({ ok: false, error: message }, { status: 401 })
}

export const Route = createFileRoute("/api/internal/feedback-analysis")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.FEEDBACK_ANALYSIS_CRON_SECRET

        if (!secret) {
          return Response.json(
            { ok: false, error: "Missing FEEDBACK_ANALYSIS_CRON_SECRET" },
            { status: 500 }
          )
        }

        const providedSecret = request.headers.get("x-cron-secret")
        if (providedSecret !== secret) {
          return unauthorized("Invalid cron secret")
        }

        const body = await request
          .json()
          .catch(() => ({}) as { workspaceId?: string; force?: boolean })

        const result = await runFeedbackAnalysis(db, {
          workspaceId: body.workspaceId,
          force: body.force,
          trigger: "cron",
        })

        return Response.json({ ok: true, ...result })
      },
    },
  },
})
