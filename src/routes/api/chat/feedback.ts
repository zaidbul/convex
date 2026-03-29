import { createFileRoute } from "@tanstack/react-router"
import { convertToModelMessages, streamText, stepCountIs, type UIMessage } from "ai"
import { openai } from "@ai-sdk/openai"
import { db } from "@/db/connection"
import * as schema from "@/db/schema"
import { getViewerContext } from "@/server/functions/viewer-context"
import {
  createFeedbackChatForViewer,
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

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is Extract<UIMessage["parts"][number], { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("\n")
}

function withAttachmentContext(
  messages: UIMessage[],
  targetMessageId: string,
  attachmentContext: string
): UIMessage[] {
  if (!attachmentContext) return messages

  return messages.map((message) => {
    if (message.id !== targetMessageId) return message

    return {
      ...message,
      parts: [...message.parts, { type: "text", text: attachmentContext }],
    }
  })
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  try {
    return JSON.stringify(error)
  } catch {
    return "Unknown feedback chat error"
  }
}

export const Route = createFileRoute("/api/chat/feedback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const viewerContext = await getViewerContext()
          if (!viewerContext.workspaceId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
          }

          const body = (await request.json()) as {
            chatId?: string
            messages?: UIMessage[]
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

          const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")
          if (!lastUserMessage) {
            return Response.json({ error: "No user message" }, { status: 400 })
          }

          // Ensure chat exists
          let chatId = body.chatId
          if (!chatId) {
            const chat = await createFeedbackChatForViewer(db, viewerContext, {})
            chatId = chat.id
          }

          const streamId = body.streamId || crypto.randomUUID()
          const lastUserMessageId = lastUserMessage.id || crypto.randomUUID()
          const lastUserMessageText = getMessageText(lastUserMessage)

          // Save user message
          await saveFeedbackChatMessage(db, chatId, {
            id: lastUserMessageId,
            role: "user",
            content: lastUserMessageText,
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
                  messageId: lastUserMessageId,
                  fileName: att.fileName,
                  fileType: att.fileType,
                  fileSize: att.fileSize,
                  rawContent: att.rawContent,
                  createdAt: new Date().toISOString(),
                })
                .onConflictDoNothing()
            }
          }

          // The AI does NOT need to see or relay raw file content — the tool reads directly from the DB
          const attachmentContext =
            body.attachments && body.attachments.length > 0
              ? body.attachments
                  .map(
                    (att) =>
                      `[File uploaded: "${att.fileName}" (${att.fileType}, ${att.fileSize} bytes)]
Call the processUploadedFile tool with attachmentId: "${att.id}", fileName: "${att.fileName}", fileType: "${att.fileType}"`
                  )
                  .join("\n\n")
              : ""

          const tools = createFeedbackChatTools(viewerContext)
          const modelMessages = await convertToModelMessages(
            withAttachmentContext(messages, lastUserMessage.id, attachmentContext),
            { tools }
          )

          const statusKey = streamStatusKey(streamId)
          await feedbackChatRedis.set(statusKey, "streaming", { ex: 3600 })

          // Stream using AI SDK UI message protocol so tool calls and reasoning reach useChat correctly.
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
            onError: (error) => {
              const message = getErrorMessage(error)
              console.error("feedback chat stream error", error)
              return message
            },
          })
        } catch (error) {
          console.error("feedback chat request failed", error)
          return new Response(getErrorMessage(error), {
            status: 500,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          })
        }
      },
    },
  },
})
