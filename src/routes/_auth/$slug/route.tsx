import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { useAuth } from "@clerk/tanstack-react-start"
import { useEffect } from "react"

export const Route = createFileRoute("/_auth/$slug")({
  component: SlugLayout,
})

function SlugLayout() {
  const { orgSlug } = useAuth()
  const { slug } = Route.useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (orgSlug && orgSlug !== slug) {
      navigate({ to: "/$slug/tickets", params: { slug: orgSlug }, search: {} })
    }
  }, [orgSlug, slug, navigate])

  return <Outlet />
}
