// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import { afterEach, describe, expect, test, vi } from "vitest"

const toastSuccessMock = vi.fn()
const toastErrorMock = vi.fn()
const useChatMock = vi.fn()

vi.mock("@ai-sdk/react", () => ({
  useChat: (...args: unknown[]) => useChatMock(...args),
}))

vi.mock("ai", () => ({
  DefaultChatTransport: class DefaultChatTransport {
    constructor(_options: unknown) {}
  },
}))

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}))

vi.mock("./feedback-chat-message", () => ({
  FeedbackChatMessage: ({
    content,
    partsJson,
  }: {
    content: string
    partsJson?: Array<Record<string, unknown>> | null
  }) => (
    <div>
      {content}
      {partsJson?.map((part, index) =>
        part.type === "tool" ? (
          <div key={index}>{`${part.toolName}:${part.state}`}</div>
        ) : null
      )}
    </div>
  ),
}))

vi.mock("./feedback-chat-readiness", () => ({
  FeedbackChatReadiness: ({ score }: { score: number }) => <div>Readiness {score}</div>,
}))

vi.mock("./feedback-thinking-indicator", () => ({
  FeedbackThinkingIndicator: () => <div>Thinking...</div>,
}))

vi.mock("./feedback-chat-file-upload", () => ({
  FeedbackChatFileUpload: () => <button type="button">Upload files</button>,
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
}))

vi.mock("@/components/ui/textarea", () => ({
  Textarea: React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    (props, ref) => <textarea ref={ref} {...props} />
  ),
}))

vi.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  ),
}))

import { FeedbackChatPanel } from "./feedback-chat-panel"
import type { FeedbackChatMessageRecord } from "@/components/tickets/types"

function createMessageRecord(
  overrides: Partial<FeedbackChatMessageRecord>
): FeedbackChatMessageRecord {
  return {
    id: "message-1",
    chatId: "chat-1",
    role: "assistant",
    content: "Hello",
    toolCallsJson: null,
    toolResultJson: null,
    attachmentsJson: null,
    partsJson: [{ type: "text", text: "Hello" }],
    messageIndex: 0,
    createdAt: "2026-03-29T00:00:00.000Z",
    ...overrides,
  }
}

describe("FeedbackChatPanel", () => {
  afterEach(() => {
    cleanup()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()
    useChatMock.mockReset()
    vi.restoreAllMocks()
  })

  test("shows in-chat analysis progress immediately and replaces it with completion text", async () => {
    useChatMock.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      addToolOutput: vi.fn(),
      status: "ready",
      error: undefined,
      setMessages: vi.fn(),
    })

    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            ok: true,
            itemsProcessed: 38,
            suggestionsProduced: 7,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      )

    const originalFetch = globalThis.fetch
    globalThis.fetch = fetchMock as typeof fetch

    const onMessagesUpdated = vi.fn()

    try {
      render(
        <FeedbackChatPanel
          chatId="chat-1"
          messages={[]}
          readinessScore={60}
          onNewChat={vi.fn()}
          onChatCreated={vi.fn()}
          onMessagesUpdated={onMessagesUpdated}
        />
      )

      fireEvent.click(screen.getByRole("button", { name: /run analysis/i }))

      expect(
        screen.getByText("Starting analysis now. I’ll post the results here when it finishes.")
      ).toBeTruthy()
      expect(
        screen.getByRole("button", { name: /running analysis/i })
      ).toHaveProperty("disabled", true)

      await waitFor(() => {
        expect(
          screen.getByText(
            "Analysis finished: 38 items processed and 7 suggestions generated."
          )
        ).toBeTruthy()
      })

      expect(onMessagesUpdated).toHaveBeenCalledTimes(1)
      expect(toastSuccessMock).toHaveBeenCalledTimes(1)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  test("preserves askStructuredQuestions tool state after rehydrating server history", () => {
    useChatMock.mockImplementation(
      (options: {
        messages?: unknown[]
      }) => ({
        messages: options.messages ?? [],
        sendMessage: vi.fn(),
        addToolOutput: vi.fn(),
        status: "ready",
        error: undefined,
        setMessages: vi.fn(),
      })
    )

    render(
      <FeedbackChatPanel
        chatId="chat-1"
        messages={[
          {
            id: "assistant-1",
            chatId: "chat-1",
            role: "assistant",
            content: "",
            toolCallsJson: null,
            toolResultJson: null,
            attachmentsJson: null,
            partsJson: [
              {
                type: "tool-call",
                toolCallId: "tool-1",
                toolName: "askStructuredQuestions",
                args: {
                  questions: [
                    {
                      question: "Where does this feedback come from?",
                      questionRephrase: "What is the source of this feedback data?",
                      type: "select",
                      options: ["Customer support tickets", "In-app feedback"],
                    },
                  ],
                },
              },
            ],
            messageIndex: 0,
            createdAt: "2026-03-29T00:00:00.000Z",
          },
        ]}
        readinessScore={40}
        onNewChat={vi.fn()}
        onChatCreated={vi.fn()}
        onMessagesUpdated={vi.fn()}
      />
    )

    expect(
      screen.getByText("askStructuredQuestions:input-available")
    ).toBeTruthy()
  })

  test("does not overwrite live streamed tool state with stale server history", () => {
    const setMessages = vi.fn()

    useChatMock.mockReturnValue({
      messages: [
        {
          id: "user-1",
          role: "user",
          parts: [{ type: "text", text: "I've uploaded 1 file for analysis." }],
        },
        {
          id: "assistant-live",
          role: "assistant",
          parts: [
            {
              type: "dynamic-tool",
              toolName: "askStructuredQuestions",
              toolCallId: "tool-live",
              state: "input-available",
              input: {
                questions: [
                  {
                    question: "Where does this feedback come from?",
                    questionRephrase: "What is the source of this feedback data?",
                    type: "select",
                    options: ["Customer support tickets", "In-app feedback"],
                  },
                ],
              },
            },
          ],
        },
      ],
      sendMessage: vi.fn(),
      addToolOutput: vi.fn(),
      status: "ready",
      error: undefined,
      setMessages,
    })

    render(
      <FeedbackChatPanel
        chatId="chat-1"
        messages={[
          {
            id: "user-1",
            chatId: "chat-1",
            role: "user",
            content: "I've uploaded 1 file for analysis.",
            toolCallsJson: null,
            toolResultJson: null,
            attachmentsJson: null,
            partsJson: [{ type: "text", text: "I've uploaded 1 file for analysis." }],
            messageIndex: 0,
            createdAt: "2026-03-29T00:00:00.000Z",
          },
        ]}
        readinessScore={40}
        onNewChat={vi.fn()}
        onChatCreated={vi.fn()}
        onMessagesUpdated={vi.fn()}
      />
    )

    expect(
      screen.getAllByText("askStructuredQuestions:input-available").length
    ).toBeGreaterThan(0)
    expect(setMessages).not.toHaveBeenCalled()
  })

  test("does not sync identical server snapshots back into useChat", () => {
    const setMessages = vi.fn()

    useChatMock.mockImplementation((options: { messages?: unknown[] }) => ({
      messages: options.messages ?? [],
      sendMessage: vi.fn(),
      addToolOutput: vi.fn(),
      status: "ready",
      error: undefined,
      setMessages,
    }))

    render(
      <FeedbackChatPanel
        chatId="chat-1"
        messages={[createMessageRecord({ id: "assistant-1" })]}
        readinessScore={40}
        onNewChat={vi.fn()}
        onChatCreated={vi.fn()}
        onMessagesUpdated={vi.fn()}
      />
    )

    expect(setMessages).not.toHaveBeenCalled()
  })

  test("resets local chat state when switching to a different chat", () => {
    const setMessages = vi.fn()

    useChatMock.mockImplementation((options: { messages?: unknown[] }) => ({
      messages: options.messages ?? [],
      sendMessage: vi.fn(),
      addToolOutput: vi.fn(),
      status: "ready",
      error: undefined,
      setMessages,
    }))

    const { rerender } = render(
      <FeedbackChatPanel
        chatId="chat-1"
        messages={[createMessageRecord({ id: "assistant-1", chatId: "chat-1" })]}
        readinessScore={40}
        onNewChat={vi.fn()}
        onChatCreated={vi.fn()}
        onMessagesUpdated={vi.fn()}
      />
    )

    rerender(
      <FeedbackChatPanel
        chatId="chat-2"
        messages={[
          createMessageRecord({
            id: "assistant-2",
            chatId: "chat-2",
            content: "New chat",
            partsJson: [{ type: "text", text: "New chat" }],
          }),
        ]}
        readinessScore={40}
        onNewChat={vi.fn()}
        onChatCreated={vi.fn()}
        onMessagesUpdated={vi.fn()}
      />
    )

    expect(setMessages).toHaveBeenCalledTimes(1)
    expect(setMessages).toHaveBeenCalledWith([
      expect.objectContaining({
        id: "assistant-2",
        role: "assistant",
      }),
    ])
  })

  test("does not repeatedly sync the same server snapshot across rerenders", () => {
    const setMessages = vi.fn()

    useChatMock.mockImplementation((options: { messages?: unknown[] }) => ({
      messages: options.messages ?? [],
      sendMessage: vi.fn(),
      addToolOutput: vi.fn(),
      status: "ready",
      error: undefined,
      setMessages,
    }))

    const props = {
      chatId: "chat-1" as const,
      messages: [createMessageRecord({ id: "assistant-1" })],
      readinessScore: 40,
      onNewChat: vi.fn(),
      onChatCreated: vi.fn(),
      onMessagesUpdated: vi.fn(),
    }

    const { rerender } = render(<FeedbackChatPanel {...props} />)

    rerender(
      <FeedbackChatPanel
        {...props}
        messages={[createMessageRecord({ id: "assistant-1" })]}
      />
    )

    rerender(
      <FeedbackChatPanel
        {...props}
        messages={[createMessageRecord({ id: "assistant-1" })]}
      />
    )

    expect(setMessages).not.toHaveBeenCalled()
  })
})
