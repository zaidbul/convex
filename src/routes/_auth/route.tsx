import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (!context.session.userId) {
      throw redirect({ to: "/sign-in" })
    }

    if (!context.session.orgSlug) {
      throw redirect({ to: "/org-select", search: { intent: undefined } })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Outlet />
    </div>
  )
}
