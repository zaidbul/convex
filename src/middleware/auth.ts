import { createMiddleware } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"

export const authMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const { userId, orgId, orgSlug, sessionId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  return next({ context: { userId, orgId, orgSlug, sessionId } })
})
