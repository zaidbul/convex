import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { statusColorMap, priorityConfig } from "@/components/tickets/constants"
import type { CrossTeamIssue } from "@/server/functions/tickets-data"

interface DashboardMyIssuesProps {
  issues: CrossTeamIssue[]
  slug: string
}

export function DashboardMyIssues({ issues, slug }: DashboardMyIssuesProps) {
  const displayed = issues.slice(0, 10)

  return (
    <Card className="border-outline-variant/10">
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium">Assigned to Me</CardTitle>
        <Badge variant="outline" className="rounded-full text-[10px]">
          {issues.length}
        </Badge>
      </CardHeader>
      <CardContent className="px-0 pb-1">
        {displayed.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No issues assigned to you
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {displayed.map((issue) => (
              <Link
                key={issue.id}
                to="/$slug/tickets/$teamSlug/issue/$issueId"
                params={{
                  slug,
                  teamSlug: issue.teamSlug,
                  issueId: issue.id,
                }}
                className="flex items-center gap-2 px-5 py-2.5 transition-colors hover:bg-surface-container/60"
              >
                {/* Priority indicator */}
                <span
                  className={cn(
                    "text-[10px] font-medium w-5 shrink-0",
                    priorityConfig[issue.priority].color
                  )}
                  title={priorityConfig[issue.priority].label}
                >
                  {issue.priority === "none"
                    ? "—"
                    : priorityConfig[issue.priority].label.charAt(0)}
                </span>

                {/* Status dot */}
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    statusColorMap[issue.status]
                  )}
                />

                {/* Identifier */}
                <span className="shrink-0 text-xs font-mono text-on-surface-variant">
                  {issue.identifier}
                </span>

                {/* Title */}
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {issue.title}
                </span>
              </Link>
            ))}
          </div>
        )}

        {issues.length > 10 && (
          <div className="px-5 pt-2 pb-3">
            <Link
              to="/$slug/tickets"
              params={{ slug }}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all {issues.length} issues
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
