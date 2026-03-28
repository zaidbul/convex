import { createFileRoute, redirect } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { FolderKanban } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  teamsQueryOptions,
  workspaceQueryOptions,
} from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/tickets/")({
  beforeLoad: async ({ context, params }) => {
    const teams = await context.queryClient.ensureQueryData(teamsQueryOptions())

    if (teams[0]) {
      throw redirect({
        to: "/$slug/tickets/$teamSlug/issues",
        params: { slug: params.slug, teamSlug: teams[0].slug },
        search: { issueId: undefined },
      })
    }
  },
  component: TicketsIndexPage,
})

function TicketsIndexPage() {
  const { data: workspace } = useSuspenseQuery(workspaceQueryOptions())

  return (
    <div className="flex h-screen items-center justify-center bg-surface-low p-6">
      <Empty className="max-w-xl border-outline-variant/30 bg-surface px-8 py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderKanban />
          </EmptyMedia>
          <EmptyTitle>No teams available</EmptyTitle>
          <EmptyDescription>
            {workspace
              ? `${workspace.name} does not have any team memberships for you yet.`
              : "Join or activate a Clerk organization to start using the ticket workspace."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
