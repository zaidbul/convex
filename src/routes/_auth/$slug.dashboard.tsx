import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/$slug/dashboard")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$slug/tickets/dashboard",
      params: { slug: params.slug },
    })
  },
})
