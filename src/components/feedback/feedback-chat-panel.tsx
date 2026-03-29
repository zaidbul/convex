import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Loader2, Sparkles, RotateCcw, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FeedbackChatMessage } from "./feedback-chat-message"
import { FeedbackChatReadiness } from "./feedback-chat-readiness"
import {
  FeedbackChatFileUpload,
  type UploadedFile,
} from "./feedback-chat-file-upload"
import type { FeedbackChatMessageRecord } from "@/components/tickets/types"

interface FeedbackChatPanelProps {
  chatId: string | null
  messages: FeedbackChatMessageRecord[]
  readinessScore: number
  onNewChat: () => void
  onChatCreated: (chatId: string) => void
  onMessagesUpdated: () => void
}

type LocalMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  attachmentsJson?: Array<{
    id: string
    fileName: string
    fileType: string
    fileSize: number
  }> | null
  toolResultJson?: unknown[] | null
  isStreaming?: boolean
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
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [serverMessages, localMessages])

  // Merge server messages with local streaming messages
  const allMessages: Array<{
    id: string
    role: "user" | "assistant" | "system"
    content: string
    toolResultJson?: unknown | null
    attachmentsJson?: Array<{
      id: string
      fileName: string
      fileType: string
      fileSize: number
    }> | null
    isStreaming?: boolean
  }> = [
    ...serverMessages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
      toolResultJson: m.toolResultJson,
      attachmentsJson: m.attachmentsJson,
      isStreaming: false,
    })),
    ...localMessages
      .filter(
        (lm) => !serverMessages.some((sm) => sm.id === lm.id)
      )
      .map((lm) => ({
        id: lm.id,
        role: lm.role,
        content: lm.content,
        toolResultJson: lm.toolResultJson ?? null,
        attachmentsJson: lm.attachmentsJson,
        isStreaming: lm.isStreaming,
      })),
  ]

  const handleFilesReady = useCallback((files: UploadedFile[]) => {
    setPendingFiles((prev) => [...prev, ...files])
  }, [])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed && pendingFiles.length === 0) return
    if (isLoading) return

    setIsLoading(true)
    const messageContent =
      trimmed ||
      `I've uploaded ${pendingFiles.length} file${pendingFiles.length > 1 ? "s" : ""} for analysis.`
    const messageId = crypto.randomUUID()

    // Add user message locally
    const userMessage: LocalMessage = {
      id: messageId,
      role: "user",
      content: messageContent,
      attachmentsJson: pendingFiles.map((f) => ({
        id: f.id,
        fileName: f.fileName,
        fileType: f.fileType,
        fileSize: f.fileSize,
      })),
    }
    setLocalMessages((prev) => [...prev, userMessage])
    setInput("")

    // Add streaming assistant placeholder
    const assistantId = crypto.randomUUID()
    setLocalMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
      },
    ])

    const filesToSend = [...pendingFiles]
    setPendingFiles([])

    try {
      const allMessageHistory = [
        ...serverMessages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
        { id: messageId, role: "user" as const, content: messageContent },
      ]

      const response = await fetch("/api/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          messages: allMessageHistory,
          streamId: crypto.randomUUID(),
          attachments: filesToSend.length > 0 ? filesToSend : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      // Read chatId from response header
      const responseChatId = response.headers.get("X-Chat-Id")
      if (!chatId && responseChatId) {
        onChatCreated(responseChatId)
      }

      // Read SSE stream directly from the response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let buffer = ""

        const processChunks = async () => {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })

            // Parse SSE events from buffer
            const lines = buffer.split("\n")
            buffer = lines.pop() ?? ""

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const chunk = JSON.parse(line.slice(6)) as {
                    type: string
                    text?: string
                    chatId?: string
                  }

                  if (chunk.type === "text" && chunk.text) {
                    setLocalMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantId
                          ? { ...m, content: m.content + (chunk.text ?? "") }
                          : m
                      )
                    )
                  }

                  if (chunk.type === "finish") {
                    setLocalMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantId
                          ? { ...m, isStreaming: false }
                          : m
                      )
                    )
                    setIsLoading(false)
                    onMessagesUpdated()
                    return
                  }
                } catch {
                  // Ignore parse errors
                }
              }
            }
          }

          // Stream ended without finish event
          setLocalMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, isStreaming: false } : m
            )
          )
          setIsLoading(false)
          onMessagesUpdated()
        }

        processChunks().catch(() => {
          setLocalMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, isStreaming: false } : m
            )
          )
          setIsLoading(false)
          onMessagesUpdated()
        })
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      )
      // Remove streaming placeholder
      setLocalMessages((prev) => prev.filter((m) => m.id !== assistantId))
      setIsLoading(false)
    }
  }

  const handleRunAnalysis = async () => {
    if (!chatId || isAnalysisRunning) return

    setIsAnalysisRunning(true)
    try {
      const response = await fetch("/api/chat/feedback/run-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId }),
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
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to run analysis"
      )
    } finally {
      setIsAnalysisRunning(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const showEmptyState = allMessages.length === 0 && !isLoading

  return (
    <div className="flex h-[600px] flex-col rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" strokeWidth={1.75} />
          <span className="text-sm font-medium">Feedback Assistant</span>
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

          {allMessages.map((msg) => (
            <FeedbackChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              toolResultJson={msg.toolResultJson}
              attachmentsJson={msg.attachmentsJson}
              isStreaming={msg.isStreaming}
            />
          ))}
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
            disabled={
              isLoading && !input.trim() && pendingFiles.length === 0
            }
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
