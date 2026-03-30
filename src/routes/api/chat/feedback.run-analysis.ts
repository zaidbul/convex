import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/chat/feedback/run-analysis")({
  server: {
    handlers: {
      POST: async () => {
        return Response.json(
          { error: "This endpoint has been removed." },
          { status: 410 }
        )
      },
      GET: async () => {
        return Response.json(
          { error: "This endpoint has been removed." },
          { status: 410 }
        )
      },
    },
  },
})
