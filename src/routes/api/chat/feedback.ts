import { createFileRoute } from "@tanstack/react-router"
import { streamText, stepCountIs } from "ai"
import { openai } from "@ai-sdk/openai"
import { db } from "@/db/connection"
import * as schema from "@/db/schema"
import { getViewerContext } from "@/server/functions/viewer-context"
import {
  createFeedbackChatForViewer,
  getFeedbackChatForViewer,
  saveFeedbackChatMessage,
  updateFeedbackChatReadiness,
  linkImportToChat,
} from "@/server/functions/feedback-chat-data"
import {
  createFeedbackChatTools,
  feedbackChatSystemPrompt,
  FEEDBACK_CHAT_MODEL,
} from "@/server/functions/feedback-chat-agent"
import { feedbackChatRedis } from "@/server/lib/redis"

const STREAM_STATUS_PREFIX = "feedback-chat:stream:"
const streamStatusKey = (id: string) => `${STREAM_STATUS_PREFIX}${id}`

export const Route = createFileRoute("/api/chat/feedback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const viewerContext = await getViewerContext()
        if (!viewerContext.workspaceId) {
          return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = (await request.json()) as {
          chatId?: string
          messages?: Array<{ id: string; role: string; content: string }>
          streamId?: string
          attachments?: Array<{
            id: string
            fileName: string
            fileType: string
            fileSize: number
            rawContent: string
          }>
        }

        const messages = body.messages ?? []
        if (messages.length === 0) {
          return Response.json({ error: "No messages" }, { status: 400 })
        }

        // Ensure chat exists
        let chatId = body.chatId
        if (!chatId) {
          const chat = await createFeedbackChatForViewer(db, viewerContext, {})
          chatId = chat.id
        }

        const streamId = body.streamId || crypto.randomUUID()
        const lastUserMessage = messages[messages.length - 1]

        // Save user message
        await saveFeedbackChatMessage(db, chatId, {
          id: lastUserMessage.id || crypto.randomUUID(),
          role: "user",
          content: lastUserMessage.content,
          attachmentsJson: body.attachments?.map((a) => ({
            id: a.id,
            fileName: a.fileName,
            fileType: a.fileType,
            fileSize: a.fileSize,
          })) ?? null,
        })

        // Save attachments to DB if present
        if (body.attachments) {
          for (const att of body.attachments) {
            await db
              .insert(schema.feedbackChatAttachments)
              .values({
                id: att.id,
                chatId,
                messageId: lastUserMessage.id || crypto.randomUUID(),
                fileName: att.fileName,
                fileType: att.fileType,
                fileSize: att.fileSize,
                rawContent: att.rawContent,
                createdAt: new Date().toISOString(),
              })
              .onConflictDoNothing()
          }
        }

        // Load full history from DB for context
        const chatDetail = await getFeedbackChatForViewer(db, viewerContext, chatId)
        const historyMessages = chatDetail?.messages ?? []

        // Build context for the AI about any attachments in this message
        // The AI does NOT need to see or relay raw file content — the tool reads directly from the DB
        let attachmentContext = ""
        if (body.attachments && body.attachments.length > 0) {
          attachmentContext = body.attachments
            .map(
              (att) =>
                `\n\n[File uploaded: "${att.fileName}" (${att.fileType}, ${att.fileSize} bytes)]\n` +
                `Call the processUploadedFile tool with attachmentId: "${att.id}", fileName: "${att.fileName}", fileType: "${att.fileType}"`
            )
            .join("\n")
        }

        const tools = createFeedbackChatTools(viewerContext)

        // Convert history to model messages
        const modelMessages = historyMessages.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content:
            m.role === "user" && m === historyMessages[historyMessages.length - 1] && attachmentContext
              ? m.content + attachmentContext
              : m.content,
        }))

        const statusKey = streamStatusKey(streamId)
        await feedbackChatRedis.set(statusKey, "streaming", { ex: 3600 })

        // Stream using AI SDK data stream protocol — enables tool calls, reasoning, and
        // structured parts to be sent to the frontend's useChat hook automatically
        const result = streamText({
          model: openai(FEEDBACK_CHAT_MODEL),
          system: feedbackChatSystemPrompt,
          messages: modelMessages,
          tools,
          stopWhen: stepCountIs(8),
          onFinish: async ({ text, steps }) => {
            // Build structured parts from steps for rich message rendering
            const partsJson: Record<string, unknown>[] = []
            const toolCalls: Array<{ toolName: string; args: unknown }> = []
            const toolResults: Array<{ toolName: string; result: unknown }> = []

            for (const step of steps) {
              if (step.text) {
                partsJson.push({ type: "text", text: step.text })
              }
              for (const tc of step.toolCalls) {
                const tcTyped = tc as Record<string, unknown>
                toolCalls.push({ toolName: tcTyped.toolName as string, args: tcTyped.args })
                partsJson.push({
                  type: "tool-call",
                  toolCallId: tcTyped.toolCallId,
                  toolName: tcTyped.toolName,
                  args: tcTyped.args,
                })
              }
              for (const tr of step.toolResults) {
                const trTyped = tr as Record<string, unknown>
                toolResults.push({ toolName: trTyped.toolName as string, result: trTyped.result })
                partsJson.push({
                  type: "tool-result",
                  toolCallId: trTyped.toolCallId,
                  toolName: trTyped.toolName,
                  result: trTyped.result,
                })
              }
            }

            // Save assistant message with parts
            await saveFeedbackChatMessage(db, chatId!, {
              id: crypto.randomUUID(),
              role: "assistant",
              content: text,
              toolCallsJson: toolCalls,
              toolResultJson: toolResults,
              partsJson: partsJson.length > 0 ? partsJson : null,
            })

            // Extract readiness score and import links from tool results
            for (const tr of toolResults) {
              if (
                tr.toolName === "updateReadinessScore" &&
                tr.result &&
                typeof tr.result === "object"
              ) {
                const score = (tr.result as { score?: number }).score
                if (typeof score === "number") {
                  await updateFeedbackChatReadiness(db, chatId!, score)
                }
              }

              if (
                tr.toolName === "processUploadedFile" &&
                tr.result &&
                typeof tr.result === "object"
              ) {
                const importId = (tr.result as { importId?: string }).importId
                if (typeof importId === "string") {
                  await linkImportToChat(db, chatId!, importId)
                }
              }
            }

            await feedbackChatRedis.set(statusKey, "completed", { ex: 3600 })
          },
        })

        return result.toUIMessageStreamResponse({
          headers: {
            "X-Chat-Id": chatId,
            "X-Stream-Id": streamId,
          },
        })
      },
    },
  },
})
