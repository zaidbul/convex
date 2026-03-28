import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"
import { SignIn } from "@clerk/tanstack-react-start"

const fetchAuthForRedirect = createServerFn({ method: "GET" }).handler(
  async () => {
    const { userId, orgSlug } = await auth()
    return { userId: userId ?? null, orgSlug: orgSlug ?? null }
  }
)

export const Route = createFileRoute("/sign-in/$")({
  beforeLoad: async () => {
    const authState = await fetchAuthForRedirect()
    if (authState.userId && authState.orgSlug) {
      throw redirect({
        to: "/$slug/tickets",
        params: { slug: authState.orgSlug },
      })
    }
    if (authState.userId) {
      throw redirect({ to: "/org-select" })
    }
    // Not authenticated — render SignIn to allow Clerk OAuth callbacks (e.g. /sign-in/sso-callback)
  },
  component: SignInCatchAll,
})

function SignInCatchAll() {
  return (
    <div className="grid min-h-screen place-items-center">
      <SignIn />
    </div>
  )
}
