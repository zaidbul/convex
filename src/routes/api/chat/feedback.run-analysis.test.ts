import { beforeEach, describe, expect, test, vi } from "vitest"

const getViewerContextMock = vi.fn()
const getFeedbackChatForViewerMock = vi.fn()
const updateFeedbackChatStatusMock = vi.fn()
const saveFeedbackChatMessageMock = vi.fn()
const runFeedbackAnalysisMock = vi.fn()
const redisSetMock = vi.fn()

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({ options }),
}))

vi.mock("@/db/connection", () => ({
  db: {},
}))

vi.mock("@/server/functions/viewer-context", () => ({
  getViewerContext: (...args: unknown[]) => getViewerContextMock(...args),
}))

vi.mock("@/server/functions/feedback-chat-data", () => ({
  getFeedbackChatForViewer: (...args: unknown[]) => getFeedbackChatForViewerMock(...args),
  updateFeedbackChatStatus: (...args: unknown[]) => updateFeedbackChatStatusMock(...args),
  saveFeedbackChatMessage: (...args: unknown[]) => saveFeedbackChatMessageMock(...args),
}))

vi.mock("@/server/functions/feedback-data", () => ({
  runFeedbackAnalysis: (...args: unknown[]) => runFeedbackAnalysisMock(...args),
}))

vi.mock("@/server/lib/redis", () => ({
  feedbackChatRedis: {
    set: (...args: unknown[]) => redisSetMock(...args),
    get: vi.fn(),
  },
}))

import { Route } from "./feedback.run-analysis"

const postHandler = (
  Route as unknown as {
    options: {
      server: {
        handlers: {
          POST: (args: { request: Request }) => Promise<Response>
        }
      }
    }
  }
).options.server.handlers.POST

describe("feedback.run-analysis route", () => {
  beforeEach(() => {
    getViewerContextMock.mockReset()
    getFeedbackChatForViewerMock.mockReset()
    updateFeedbackChatStatusMock.mockReset()
    saveFeedbackChatMessageMock.mockReset()
    runFeedbackAnalysisMock.mockReset()
    redisSetMock.mockReset()

    getViewerContextMock.mockResolvedValue({
      workspaceId: "workspace-1",
    })
    getFeedbackChatForViewerMock.mockResolvedValue({
      id: "chat-1",
      readinessScore: 60,
    })
    updateFeedbackChatStatusMock.mockResolvedValue(undefined)
    saveFeedbackChatMessageMock.mockResolvedValue(undefined)
    redisSetMock.mockResolvedValue(undefined)
  })

  test("persists analysis start and completion messages", async () => {
    runFeedbackAnalysisMock.mockResolvedValue({
      results: [{ itemsProcessed: 38, suggestionsProduced: 7 }],
    })

    const response = await postHandler({
      request: new Request("http://localhost/api/chat/feedback/run-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: "chat-1" }),
      }),
    })

    expect(response.status).toBe(200)
    expect(saveFeedbackChatMessageMock).toHaveBeenCalledTimes(2)
    expect(saveFeedbackChatMessageMock).toHaveBeenNthCalledWith(
      1,
      {},
      "chat-1",
      expect.objectContaining({
        role: "assistant",
        content: "Starting analysis now. I’ll post the results here when it finishes.",
        partsJson: [
          {
            type: "text",
            text: "Starting analysis now. I’ll post the results here when it finishes.",
          },
        ],
      })
    )
    expect(saveFeedbackChatMessageMock).toHaveBeenNthCalledWith(
      2,
      {},
      "chat-1",
      expect.objectContaining({
        role: "assistant",
        content: "Analysis finished: 38 items processed and 7 suggestions generated.",
        partsJson: [
          {
            type: "text",
            text: "Analysis finished: 38 items processed and 7 suggestions generated.",
          },
        ],
      })
    )
  })

  test("persists analysis failure messages", async () => {
    runFeedbackAnalysisMock.mockRejectedValue(new Error("Pipeline exploded"))

    const response = await postHandler({
      request: new Request("http://localhost/api/chat/feedback/run-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: "chat-1" }),
      }),
    })

    expect(response.status).toBe(500)
    expect(saveFeedbackChatMessageMock).toHaveBeenCalledTimes(2)
    expect(saveFeedbackChatMessageMock).toHaveBeenNthCalledWith(
      1,
      {},
      "chat-1",
      expect.objectContaining({
        content: "Starting analysis now. I’ll post the results here when it finishes.",
      })
    )
    expect(saveFeedbackChatMessageMock).toHaveBeenNthCalledWith(
      2,
      {},
      "chat-1",
      expect.objectContaining({
        content: "Analysis failed: Pipeline exploded",
      })
    )
  })
})
