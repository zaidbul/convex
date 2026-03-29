import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"
import { AuthenticateWithRedirectCallback } from "@clerk/tanstack-react-start"

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
        search: {},
      })
    }
    if (authState.userId) {
      throw redirect({ to: "/org-select" })
    }
  },
  component: SSOCallback,
})

function SSOCallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/org-select"
        signUpFallbackRedirectUrl="/org-select"
      />
    </div>
  )
}
