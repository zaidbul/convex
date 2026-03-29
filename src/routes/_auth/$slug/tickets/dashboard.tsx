import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
  dashboardStatsQueryOptions,
  myIssuesQueryOptions,
  activeCyclesQueryOptions,
  recentNotificationsQueryOptions,
  teamsQueryOptions,
  workspaceQueryOptions,
} from "@/query/options/tickets"
import { DashboardStatsCards } from "@/components/dashboard/dashboard-stats-cards"
import { DashboardMyIssues } from "@/components/dashboard/dashboard-my-issues"
import { DashboardCycleProgress } from "@/components/dashboard/dashboard-cycle-progress"
import { DashboardActivityFeed } from "@/components/dashboard/dashboard-activity-feed"
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions"

export const Route = createFileRoute("/_auth/$slug/tickets/dashboard")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(dashboardStatsQueryOptions()),
      context.queryClient.ensureQueryData(myIssuesQueryOptions(20)),
      context.queryClient.ensureQueryData(activeCyclesQueryOptions()),
      context.queryClient.ensureQueryData(recentNotificationsQueryOptions(8)),
      context.queryClient.ensureQueryData(teamsQueryOptions()),
      context.queryClient.ensureQueryData(workspaceQueryOptions()),
    ])
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { slug } = Route.useParams()

  const { data: stats } = useSuspenseQuery(dashboardStatsQueryOptions())
  const { data: myIssues } = useSuspenseQuery(myIssuesQueryOptions(20))
  const { data: activeCycles } = useSuspenseQuery(activeCyclesQueryOptions())
  const { data: notifications } = useSuspenseQuery(
    recentNotificationsQueryOptions(8)
  )
  const { data: teams } = useSuspenseQuery(teamsQueryOptions())
  const { data: workspace } = useSuspenseQuery(workspaceQueryOptions())

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        {workspace && (
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of {workspace.name}
          </p>
        )}
      </div>

      {/* Stats row */}
      <DashboardStatsCards stats={stats} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <DashboardMyIssues issues={myIssues} slug={slug} />
          <DashboardCycleProgress cycles={activeCycles} slug={slug} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <DashboardQuickActions teams={teams} slug={slug} />
          <DashboardActivityFeed notifications={notifications} slug={slug} />
        </div>
      </div>
    </div>
  )
}
