import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/$slug")({
  beforeLoad: async ({ params, context }) => {
    const authContext = context.auth as {
      orgSlug: string | null
    }
    if (authContext.orgSlug && authContext.orgSlug !== params.slug) {
      throw redirect({
        to: "/$slug/tickets",
        params: { slug: authContext.orgSlug },
      })
    }
  },
  component: SlugLayout,
})

function SlugLayout() {
  return <Outlet />
}
