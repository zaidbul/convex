import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useAuth } from "@clerk/tanstack-react-start"

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
})

function AuthLayout() {
  const { isSignedIn, isLoaded, orgSlug } = useAuth()

  if (!isLoaded) return null

  if (!isSignedIn) {
    window.location.href = "/sign-in"
    return null
  }

  if (!orgSlug) {
    window.location.href = "/org-select"
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
