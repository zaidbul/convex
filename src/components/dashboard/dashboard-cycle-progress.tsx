import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
} from "@/components/ui/progress"
import type { ActiveCycleWithProgress } from "@/server/functions/tickets-data"

interface DashboardCycleProgressProps {
  cycles: ActiveCycleWithProgress[]
  slug: string
}

export function DashboardCycleProgress({
  cycles,
  slug,
}: DashboardCycleProgressProps) {
  return (
    <Card className="border-outline-variant/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Active Cycles</CardTitle>
      </CardHeader>
      <CardContent>
        {cycles.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No active cycles
          </div>
        ) : (
          <div className="space-y-4">
            {cycles.map(
              ({ cycle, teamName, teamSlug, totalIssues, completedIssues }) => {
                const pct =
                  totalIssues > 0
                    ? Math.round((completedIssues / totalIssues) * 100)
                    : 0

                return (
                  <Link
                    key={cycle.id}
                    to="/$slug/tickets/$teamSlug/issues"
                    params={{ slug, teamSlug }}
                    className="block space-y-1.5 rounded-lg p-2 -mx-2 transition-colors hover:bg-surface-container/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge
                          variant="outline"
                          className="shrink-0 rounded-full text-[10px]"
                        >
                          {teamName}
                        </Badge>
                        <span className="truncate text-sm font-medium text-foreground">
                          {cycle.name}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {pct}%
                      </span>
                    </div>

                    <Progress value={pct}>
                      <ProgressTrack className="h-2">
                        <ProgressIndicator />
                      </ProgressTrack>
                    </Progress>

                    <p className="text-xs text-muted-foreground">
                      {completedIssues} of {totalIssues} issues completed
                    </p>
                  </Link>
                )
              }
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
