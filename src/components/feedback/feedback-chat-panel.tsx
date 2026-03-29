import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Send, Loader2, Sparkles, RotateCcw, Plus, Radio } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FeedbackChatMessage } from "./feedback-chat-message"
import { FeedbackChatReadiness } from "./feedback-chat-readiness"
import { FeedbackThinkingIndicator } from "./feedback-thinking-indicator"
import {
  FeedbackChatFileUpload,
  type UploadedFile,
} from "./feedback-chat-file-upload"
import type { FeedbackChatMessageRecord } from "@/components/tickets/types"
import type { AskQuestionsOutput } from "./tools/ask-questions-tool"

interface FeedbackChatPanelProps {
  chatId: string | null
  messages: FeedbackChatMessageRecord[]
  readinessScore: number
  onNewChat: () => void
  onChatCreated: (chatId: string) => void
  onMessagesUpdated: () => void
}

/**
 * Convert server message records to the UIMessage format that useChat expects.
 */
function serverMessagesToUIMessages(messages: FeedbackChatMessageRecord[]): UIMessage[] {
  return messages.map((m) => {
    const parts: UIMessage["parts"] = []

    if (m.partsJson && Array.isArray(m.partsJson) && m.partsJson.length > 0) {
      for (const part of m.partsJson) {
        const p = part as Record<string, unknown>
        if (p.type === "text" && typeof p.text === "string") {
          parts.push({ type: "text", text: p.text })
        }
        // Tool calls and results are handled via tool-invocation parts in UIMessage
      }
    } else if (m.content) {
      parts.push({ type: "text", text: m.content })
    }

    // Ensure at least one text part
    if (parts.length === 0 && m.content) {
      parts.push({ type: "text", text: m.content })
    }

    return {
      id: m.id,
      role: m.role as "user" | "assistant",
      parts,
      createdAt: new Date(m.createdAt),
    } as UIMessage
  })
}

export function FeedbackChatPanel({
  chatId,
  messages: serverMessages,
  readinessScore,
  onNewChat,
  onChatCreated,
  onMessagesUpdated,
}: FeedbackChatPanelProps) {
  const [input, setInput] = useState("")
  const [pendingFiles, setPendingFiles] = useState<UploadedFile[]>([])
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pendingFilesRef = useRef<UploadedFile[]>([])

  // Keep ref in sync with state for use in transport
  useEffect(() => {
    pendingFilesRef.current = pendingFiles
  }, [pendingFiles])

  // Track chatId changes from parent
  useEffect(() => {
    setCurrentChatId(chatId)
  }, [chatId])

  // Convert server messages to UIMessage format for useChat initial state
  const initialMessages = useMemo(
    () => serverMessagesToUIMessages(serverMessages),
    [serverMessages]
  )

  // Create a custom transport that includes chatId and attachments
  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: "/api/chat/feedback",
      body: () => ({
        chatId: currentChatId,
        attachments: pendingFilesRef.current.length > 0 ? pendingFilesRef.current : undefined,
      }),
      fetch: async (input, init) => {
        const response = await fetch(input, init)

        // Extract chatId from response header for new chats
        const responseChatId = response.headers.get("X-Chat-Id")
        if (!currentChatId && responseChatId) {
          setCurrentChatId(responseChatId)
          onChatCreated(responseChatId)
        }

        return response
      },
    })
  }, [currentChatId, onChatCreated])

  const {
    messages,
    sendMessage,
    addToolOutput,
    status,
    error,
    setMessages,
  } = useChat({
    id: currentChatId ?? undefined,
    transport,
    messages: initialMessages,
    onError: (err) => {
      toast.error(err.message || "Failed to send message")
    },
    onFinish: () => {
      onMessagesUpdated()
    },
  })

  // Sync server messages when they change (e.g., after refetch)
  useEffect(() => {
    if (serverMessages.length > 0 && status !== "streaming" && status !== "submitted") {
      setMessages(serverMessagesToUIMessages(serverMessages))
    }
  }, [serverMessages, status, setMessages])

  const isLoading = status === "streaming" || status === "submitted"

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleFilesReady = useCallback((files: UploadedFile[]) => {
    setPendingFiles((prev) => [...prev, ...files])
  }, [])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed && pendingFiles.length === 0) return
    if (isLoading) return

    const messageContent =
      trimmed ||
      `I've uploaded ${pendingFiles.length} file${pendingFiles.length > 1 ? "s" : ""} for analysis.`

    // sendMessage will trigger the transport which includes attachments via the body callback
    sendMessage({ text: messageContent })

    setInput("")
    setPendingFiles([])
  }, [input, pendingFiles, isLoading, sendMessage])

  const handleToolOutput = useCallback(
    (toolCallId: string, output: AskQuestionsOutput) => {
      addToolOutput({
        toolCallId,
        tool: "askStructuredQuestions" as never,
        output: output as never,
      })
    },
    [addToolOutput]
  )

  const handleRunAnalysis = async () => {
    if (!currentChatId || isAnalysisRunning) return

    setIsAnalysisRunning(true)
    try {
      const response = await fetch("/api/chat/feedback/run-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: currentChatId }),
      })

      const data = (await response.json()) as {
        ok?: boolean
        error?: string
        itemsProcessed?: number
        suggestionsProduced?: number
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      toast.success(
        `Analysis complete: ${data.itemsProcessed} items processed, ${data.suggestionsProduced} suggestions generated`
      )
      onMessagesUpdated()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to run analysis"
      )
    } finally {
      setIsAnalysisRunning(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Determine if we should show the thinking indicator
  const showThinking = useMemo(() => {
    if (!isLoading) return false
    const lastMsg = messages[messages.length - 1]
    if (!lastMsg || lastMsg.role !== "assistant") return true
    return !lastMsg.parts || lastMsg.parts.length === 0
  }, [isLoading, messages])

  const showEmptyState = messages.length === 0 && !isLoading

  // Convert UIMessages to the format our message component expects
  const renderedMessages = useMemo(() => {
    return messages.map((msg) => {
      const partsJson: unknown[] = []
      for (const part of msg.parts ?? []) {
        if (part.type === "text") {
          partsJson.push({ type: "text", text: part.text })
        } else if (part.type === "tool-invocation") {
          const inv = (part as unknown as { toolInvocation: Record<string, unknown> }).toolInvocation
          partsJson.push({
            type: "tool-call",
            toolCallId: inv.toolCallId,
            toolName: inv.toolName,
            args: inv.args,
          })
          if (inv.state === "result") {
            partsJson.push({
              type: "tool-result",
              toolCallId: inv.toolCallId,
              toolName: inv.toolName,
              result: inv.result,
            })
          }
        } else if (part.type === "reasoning") {
          const rp = part as unknown as { reasoning: string }
          partsJson.push({ type: "reasoning", text: rp.reasoning })
        }
      }

      const content = partsJson
        .filter((p) => (p as Record<string, unknown>).type === "text")
        .map((p) => (p as Record<string, unknown>).text as string)
        .join("\n")

      return {
        id: msg.id,
        role: msg.role as "user" | "assistant" | "system",
        content,
        partsJson: partsJson.length > 0 ? partsJson : null,
        attachmentsJson:
          serverMessages.find((sm) => sm.id === msg.id)?.attachmentsJson ?? null,
        isStreaming:
          isLoading && msg.id === messages[messages.length - 1]?.id && msg.role === "assistant",
      }
    })
  }, [messages, serverMessages, isLoading])

  return (
    <div className="flex h-[600px] flex-col rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" strokeWidth={1.75} />
          <span className="text-sm font-medium">Feedback Assistant</span>
          {isLoading && (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <Radio className="size-2.5 animate-pulse" />
              Streaming
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onNewChat} className="gap-1.5">
          <Plus className="size-3.5" />
          New chat
        </Button>
      </div>

      {/* Readiness bar */}
      <div className="border-b px-4 py-2">
        <FeedbackChatReadiness score={readinessScore} />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="space-y-4 py-4">
          {showEmptyState && (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <FeedbackChatFileUpload
                onFilesReady={handleFilesReady}
                disabled={isLoading}
              />
              <p className="max-w-sm text-sm text-muted-foreground">
                Upload feedback files or type a message to start. The assistant
                will help you contextualize and prepare feedback for analysis.
              </p>
            </div>
          )}

          {renderedMessages.map((msg) => (
            <FeedbackChatMessage
              key={msg.id}
              id={msg.id}
              role={msg.role}
              content={msg.content}
              partsJson={msg.partsJson}
              attachmentsJson={msg.attachmentsJson}
              isStreaming={msg.isStreaming}
              onToolOutput={handleToolOutput}
            />
          ))}

          {showThinking && <FeedbackThinkingIndicator />}
        </div>
      </ScrollArea>

      {/* Pending files preview */}
      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t px-4 py-2">
          {pendingFiles.map((f) => (
            <span
              key={f.id}
              className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs"
            >
              {f.fileName}
              <button
                type="button"
                className="ml-0.5 text-muted-foreground hover:text-foreground"
                onClick={() =>
                  setPendingFiles((prev) =>
                    prev.filter((p) => p.id !== f.id)
                  )
                }
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="border-t bg-destructive/5 px-4 py-2 text-xs text-destructive">
          {error.message}
        </div>
      )}

      {/* Input area */}
      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <FeedbackChatFileUpload
            onFilesReady={handleFilesReady}
            disabled={isLoading}
            compact
          />
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your feedback or upload files..."
            className="min-h-10 max-h-32 flex-1 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading && !input.trim() && pendingFiles.length === 0}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>

        {/* Run Analysis button */}
        {readinessScore >= 50 && (
          <div className="mt-2">
            <Button
              onClick={handleRunAnalysis}
              disabled={isAnalysisRunning}
              className="w-full gap-2"
              variant="default"
            >
              {isAnalysisRunning ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Running analysis...
                </>
              ) : (
                <>
                  <RotateCcw className="size-4" />
                  Run Analysis ({readinessScore}% ready)
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
