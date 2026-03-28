import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"

const fetchAuthState = createServerFn({ method: "GET" }).handler(async () => {
  const { userId, orgId, orgSlug, sessionId } = await auth()

  if (!userId) {
    throw redirect({ to: "/sign-in" })
  }

  return { userId, orgId: orgId ?? null, orgSlug: orgSlug ?? null, sessionId }
})

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const authContext = await fetchAuthState()
    return { auth: authContext }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
