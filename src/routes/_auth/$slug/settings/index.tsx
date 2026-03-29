import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/$slug/settings/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$slug/settings/general",
      params: { slug: params.slug },
    })
  },
})
