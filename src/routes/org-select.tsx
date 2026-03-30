import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/org-select")({
  beforeLoad: () => {
    throw redirect({ to: "/$slug/tickets/dashboard", params: { slug: "acme-corp" } })
  },
  component: () => null,
})
