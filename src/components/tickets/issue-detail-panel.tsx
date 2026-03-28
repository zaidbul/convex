import { useQuery } from "@tanstack/react-query"
import { issueDetailQueryOptions } from "@/query/options/tickets"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { DescriptionEditor } from "@/components/editor/DescriptionEditor"
import type { IssueStatus, IssuePriority } from "./types"
import { labelColorMap } from "./constants"

const statusConfig: Record<IssueStatus, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "bg-muted-foreground/40" },
  todo: { label: "Todo", color: "bg-muted-foreground/60" },
  "in-progress": { label: "In Progress", color: "bg-amber-500" },
  "in-review": { label: "In Review", color: "bg-purple-500" },
  done: { label: "Done", color: "bg-green-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500/50" },
}

const priorityConfig: Record<IssuePriority, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: "text-red-500" },
  high: { label: "High", color: "text-orange-500" },
  medium: { label: "Medium", color: "text-amber-500" },
  low: { label: "Low", color: "text-blue-500" },
  none: { label: "None", color: "text-muted-foreground" },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function IssueDetailPanel({
  issueId,
  open,
  onOpenChange,
}: {
  issueId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { data: issue, isLoading, isError } = useQuery(issueDetailQueryOptions(issueId))

  const status = issue ? statusConfig[issue.status] : null
  const priority = issue ? priorityConfig[issue.priority] : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-2xl">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="size-6" />
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-destructive">Failed to load issue</p>
          </div>
        ) : !issue ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Issue not found</p>
          </div>
        ) : (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {issue.identifier}
                </span>
                {status && (
                  <Badge variant="outline" className="gap-1.5 rounded-full text-xs">
                    <span className={cn("size-2 rounded-full", status.color)} />
                    {status.label}
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-lg">{issue.title}</SheetTitle>
              <SheetDescription>
                Created by {issue.creator.name} on {formatDate(issue.createdAt)}
              </SheetDescription>
            </SheetHeader>

            <SheetBody className="space-y-6 pb-6">
              {/* Properties */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <div className="mt-1 flex items-center gap-1.5">
                    {status && <span className={cn("size-2 rounded-full", status.color)} />}
                    {status?.label}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground">Priority</span>
                  <div className={cn("mt-1", priority?.color)}>
                    {priority?.label}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground">Assignee</span>
                  <div className="mt-1">
                    {issue.assignees.length > 0 ? (
                      <div className="flex items-center gap-2">
                        {issue.assignees.map((user) => (
                          <div key={user.id} className="flex items-center gap-1.5">
                            <Avatar className="size-5">
                              <AvatarImage src={user.avatarUrl} />
                              <AvatarFallback className="text-[8px]">
                                {user.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground">Updated</span>
                  <div className="mt-1">{formatDate(issue.updatedAt)}</div>
                </div>
              </div>

              {/* Labels */}
              {issue.labels.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Labels</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {issue.labels.map((label) => (
                      <Badge
                        key={label.id}
                        variant="outline"
                        className={cn(
                          "rounded-full border-0 px-2.5 py-0.5 text-xs font-medium",
                          labelColorMap[label.color] ?? "bg-muted text-muted-foreground"
                        )}
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Description */}
              <div>
                <span className="text-sm font-medium text-foreground">Description</span>
                <div className="mt-2">
                  <DescriptionEditor
                    issueId={issue.id}
                    initialMarkdown={issue.description}
                  />
                </div>
              </div>
            </SheetBody>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
