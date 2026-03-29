// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react"
import React from "react"
import { afterEach, describe, expect, test, vi } from "vitest"

vi.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
}))

import { FeedbackChatMessage } from "./feedback-chat-message"

describe("FeedbackChatMessage", () => {
  afterEach(() => {
    cleanup()
  })

  test("shows import narration for tool-only upload results", () => {
    render(
      <FeedbackChatMessage
        id="message-1"
        role="assistant"
        content=""
        partsJson={[
          {
            type: "tool-call",
            toolCallId: "tool-1",
            toolName: "processUploadedFile",
            args: { fileName: "test-feedback-data.csv" },
          },
          {
            type: "tool-result",
            toolCallId: "tool-1",
            toolName: "processUploadedFile",
            result: {
              success: true,
              itemCount: 38,
              fileName: "test-feedback-data.csv",
            },
          },
        ]}
      />
    )

    expect(
      screen.getByText("Imported 38 feedback items from test-feedback-data.csv.")
    ).toBeTruthy()
    expect(
      screen.getByText("38 items imported from test-feedback-data.csv")
    ).toBeTruthy()
  })

  test("shows question preamble for tool-only structured questions", () => {
    render(
      <FeedbackChatMessage
        id="message-2"
        role="assistant"
        content=""
        partsJson={[
          {
            type: "tool-call",
            toolCallId: "tool-2",
            toolName: "askStructuredQuestions",
            args: {
              questions: [
                {
                  question: "Where did this feedback come from?",
                  questionRephrase: "What is the source of this feedback data?",
                  type: "select",
                  options: ["Customer support tickets", "App store reviews"],
                },
              ],
            },
          },
        ]}
      />
    )

    expect(
      screen.getByText(
        "Before I run analysis, I need a bit more context. Please answer these questions."
      )
    ).toBeTruthy()
  })

  test("shows analysis CTA narration when readiness reaches the threshold", () => {
    render(
      <FeedbackChatMessage
        id="message-3"
        role="assistant"
        content=""
        partsJson={[
          {
            type: "tool-call",
            toolCallId: "tool-3",
            toolName: "updateReadinessScore",
            args: { score: 60, reason: "Context looks complete" },
          },
          {
            type: "tool-result",
            toolCallId: "tool-3",
            toolName: "updateReadinessScore",
            result: { score: 60, reason: "Context looks complete" },
          },
        ]}
      />
    )

    expect(
      screen.getByText(
        "This feedback is ready for analysis. Use Run Analysis below to start."
      )
    ).toBeTruthy()
    expect(
      screen.getByText("Readiness: 60% — Context looks complete")
    ).toBeTruthy()
  })

  test("shows a compact loading state while streamed tool input is still partial", () => {
    render(
      <FeedbackChatMessage
        id="message-4"
        role="assistant"
        content=""
        partsJson={[
          {
            type: "tool",
            toolCallId: "tool-4",
            toolName: "askStructuredQuestions",
            state: "input-streaming",
            input: {
              questions: [
                {
                  question: "Where does this feedback come from?",
                  questionRephrase: "What is the source of this feedback data?",
                  type: "select",
                  options: ["Customer support tickets"],
                },
              ],
            },
          },
        ]}
      />
    )

    expect(screen.getAllByText("Preparing questions...").length).toBeGreaterThan(0)
    expect(
      screen.queryByText(
        "Before I run analysis, I need a bit more context. Please answer these questions."
      )
    ).toBeNull()
  })
})
