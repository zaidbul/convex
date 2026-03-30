import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/$slug/tickets/synthesize/chat")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$slug/tickets/synthesize/dashboard",
      params: { slug: params.slug },
    })
  },
  component: () => null,
})
