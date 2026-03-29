import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/$slug/tickets/synthesize/")({
  component: SynthesizeIndex,
})

function SynthesizeIndex() {
  const { slug } = Route.useParams()
  return (
    <Navigate
      to="/$slug/tickets/synthesize/chat"
      params={{ slug }}
      replace
    />
  )
}
