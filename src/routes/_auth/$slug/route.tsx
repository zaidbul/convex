import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/$slug")({
  beforeLoad: async ({ params, context }) => {
    const authContext = context.auth
    const orgSlug = authContext && typeof authContext === "object" && "orgSlug" in authContext
      ? (authContext as { orgSlug: string | null }).orgSlug
      : null
    if (orgSlug && orgSlug !== params.slug) {
      throw redirect({
        to: "/$slug/tickets",
        params: { slug: orgSlug },
      })
    }
  },
  component: SlugLayout,
})

function SlugLayout() {
  return <Outlet />
}
