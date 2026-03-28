import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"
import { OrganizationList } from "@clerk/tanstack-react-start"

const fetchAuthForOrgSelect = createServerFn({ method: "GET" }).handler(
  async () => {
    const { userId, orgSlug } = await auth()
    return { userId: userId ?? null, orgSlug: orgSlug ?? null }
  }
)

export const Route = createFileRoute("/org-select")({
  beforeLoad: async () => {
    const authState = await fetchAuthForOrgSelect()
    if (!authState.userId) {
      throw redirect({ to: "/sign-in" })
    }
    if (authState.orgSlug) {
      throw redirect({
        to: "/$slug/tickets",
        params: { slug: authState.orgSlug },
      })
    }
  },
  component: OrgSelectPage,
})

function OrgSelectPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="text-center">
        <h1 className="mb-6 font-display text-2xl font-bold text-foreground">
          Select a workspace
        </h1>
        <OrganizationList
          afterSelectOrganizationUrl="/:slug/tickets"
          afterCreateOrganizationUrl="/:slug/tickets"
        />
      </div>
    </div>
  )
}
