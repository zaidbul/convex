import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/$slug")({
  beforeLoad: ({ context, params }) => {
    if (!context.session.userId) {
      throw redirect({ to: "/sign-in" })
    }

    if (context.session.orgSlug && context.session.orgSlug !== params.slug) {
      throw redirect({
        to: "/$slug/tickets",
        params: { slug: context.session.orgSlug },
        search: {},
      })
    }
  },
  component: SlugLayout,
})

function SlugLayout() {
  return <Outlet />
}
