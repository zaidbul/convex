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

export const Route = createFileRoute("/sign-in/")({
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
  },
  component: SignInPage,
})

function SignInPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/org-select" />
    </div>
  )
}
