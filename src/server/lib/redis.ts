import { Redis } from "@upstash/redis"

export const feedbackChatRedis = Redis.fromEnv()
