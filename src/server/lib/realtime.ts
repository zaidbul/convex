import { type InferRealtimeEvents, Realtime } from "@upstash/realtime"
import { type UIMessageChunk } from "ai"
import { z } from "zod"
import { feedbackChatRedis } from "./redis"

export const feedbackChatRealtimeSchema = {
  ai: { chunk: z.any() as z.ZodType<UIMessageChunk> },
}

export const feedbackChatRealtime = new Realtime({
  schema: feedbackChatRealtimeSchema,
  redis: feedbackChatRedis,
  history: true,
})

export type FeedbackChatRealtimeEvents = InferRealtimeEvents<typeof feedbackChatRealtime>
