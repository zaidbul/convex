import { useNavigate, useParams } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { KanbanItem } from "@/components/ui/kanban"
import { IssueActionsContextMenu } from "./issue-actions-menu"
import { statusColorMap, labelColorMap, priorityConfig } from "./constants"
import type { Issue } from "./types"

export function IssueBoardCard({ issue }: { issue: Issue }) {
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { slug?: string; teamSlug?: string }

  const issueUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${params.slug}/tickets/${params.teamSlug}/issue/${issue.id}`
      : ""

  function handleClick() {
    if (!params.slug || !params.teamSlug) return
    navigate({
      to: "/$slug/tickets/$teamSlug/issue/$issueId",
      params: {
        slug: params.slug,
        teamSlug: params.teamSlug,
        issueId: issue.id,
      },
    })
  }

  return (
    <KanbanItem value={issue.id} asHandle>
      <IssueActionsContextMenu
        issueId={issue.id}
        issueIdentifier={issue.identifier}
        issueUrl={issueUrl}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="rounded-lg border border-outline-variant/15 bg-surface p-3 shadow-xs transition-colors hover:border-outline-variant/30"
          onClick={handleClick}
        >
          {/* Identifier + priority */}
          <div className="flex items-center justify-between gap-2">
            <span className="shrink-0 font-mono text-[11px] text-on-surface-variant">
              {issue.identifier}
            </span>
            <span
              className={cn(
                "text-[11px] font-medium",
                priorityConfig[issue.priority].color,
              )}
            >
              {issue.priorityScore > 0 ? priorityConfig[issue.priority].label : null}
            </span>
          </div>

          {/* Title */}
          <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-on-surface">
            {issue.title}
          </p>

          {/* Labels */}
          {issue.labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {issue.labels.map((label) => (
                <Badge
                  key={label.id}
                  variant="outline"
                  className={cn(
                    "h-5 rounded-full border-0 px-2 py-0 text-[10px] font-medium",
                    labelColorMap[label.color] ?? "bg-muted text-muted-foreground",
                  )}
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Bottom row: status dot + assignees */}
          <div className="mt-2.5 flex items-center justify-between">
            <span
              className={cn("size-2 shrink-0 rounded-full", statusColorMap[issue.status])}
            />
            {issue.assignees.length > 0 && (
              <div className="flex -space-x-1">
                {issue.assignees.map((user) => (
                  <Avatar key={user.id} className="size-5 ring-1 ring-surface">
                    <AvatarFallback className="text-[8px] bg-surface-high text-on-surface-variant font-medium">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
          </div>
        </div>
      </IssueActionsContextMenu>
    </KanbanItem>
  )
}
