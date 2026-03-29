import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db/connection"
import {
  createFeedbackChatForViewer,
  deleteFeedbackChatForViewer,
  getFeedbackChatForViewer,
  listFeedbackChatsForViewer,
  saveFeedbackChatAttachment,
} from "./feedback-chat-data"
import { getViewerContext } from "./viewer-context"
import {
  createFeedbackChatSchema,
  feedbackChatIdSchema,
  uploadFeedbackChatAttachmentSchema,
} from "./validation-schemas"

export const createFeedbackChat = createServerFn({ method: "POST" })
  .inputValidator(createFeedbackChatSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createFeedbackChatForViewer(db, viewerContext, data)
  })

export const getFeedbackChat = createServerFn({ method: "GET" })
  .inputValidator(feedbackChatIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return getFeedbackChatForViewer(db, viewerContext, data.chatId)
  })

export const listFeedbackChats = createServerFn({ method: "GET" }).handler(
  async () => {
    const viewerContext = await getViewerContext()
    return listFeedbackChatsForViewer(db, viewerContext)
  }
)

export const deleteFeedbackChat = createServerFn({ method: "POST" })
  .inputValidator(feedbackChatIdSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return deleteFeedbackChatForViewer(db, viewerContext, data.chatId)
  })

export const uploadFeedbackChatAttachment = createServerFn({ method: "POST" })
  .inputValidator(uploadFeedbackChatAttachmentSchema)
  .handler(async ({ data }) => {
    await getViewerContext()
    const id = crypto.randomUUID()
    const messageId = crypto.randomUUID()

    await saveFeedbackChatAttachment(db, {
      id,
      chatId: data.chatId,
      messageId,
      fileName: data.fileName,
      fileType: data.fileType,
      fileSize: data.rawContent.length,
      rawContent: data.rawContent,
    })

    return {
      id,
      messageId,
      fileName: data.fileName,
      fileType: data.fileType,
      fileSize: data.rawContent.length,
    }
  })
