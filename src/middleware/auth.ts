import { createMiddleware } from "@tanstack/react-start"

export const authMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  // TODO: Wire up your auth provider (Clerk, Auth0, etc.)
  // Example with Clerk:
  // import { auth } from "@clerk/tanstack-react-start/server"
  // const { userId, orgId } = await auth()
  // if (!userId) throw new Error("Unauthorized")
  // return next({ context: { userId, orgId } })
  return next({ context: {} })
})
