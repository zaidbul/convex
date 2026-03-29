import { useEffect, useMemo, useRef, useState } from "react"
import type { DragEndEvent } from "@dnd-kit/core"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanOverlay,
} from "@/components/ui/kanban"
import { cn } from "@/lib/utils"
import { useUpdateIssueStatusMutation } from "@/query/mutations/tickets"
import { boardColumns, groupIssuesByStatus } from "./board-utils"
import { IssueBoardCard } from "./issue-board-card"
import { statusColorMap, statusConfig } from "./constants"
import type { Issue, IssueStatus } from "./types"

export function IssueBoard({
  issues,
}: {
  teamSlug: string
  issues: Issue[]
}) {
  const [columns, setColumns] = useState(() => groupIssuesByStatus(issues))
  const updateStatus = useUpdateIssueStatusMutation()
  const issuesRef = useRef(issues)

  // Sync local state when server data changes
  useEffect(() => {
    issuesRef.current = issues
    setColumns(groupIssuesByStatus(issues))
  }, [issues])

  // Build a lookup to find the original status of a dragged item
  const issueStatusMap = useMemo(() => {
    const map = new Map<string, IssueStatus>()
    for (const issue of issues) {
      map.set(issue.id, issue.status)
    }
    return map
  }, [issues])

  function handleDragEnd(event: DragEndEvent) {
    const { active } = event
    const issueId = active.id as string
    const originalStatus = issueStatusMap.get(issueId)
    if (!originalStatus) return

    // Find which column now contains this issue
    const newStatus = boardColumns.find((status) =>
      columns[status].some((i) => i.id === issueId),
    )

    if (newStatus && newStatus !== originalStatus) {
      updateStatus.mutate({ issueId, status: newStatus })
    }
  }

  if (issues.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <Empty className="max-w-xl border-outline-variant/20 bg-surface px-8 py-12">
          <EmptyHeader>
            <EmptyTitle>No issues yet</EmptyTitle>
            <EmptyDescription>
              This team does not have any issues matching the current filters.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  // Find the active issue for the overlay
  function findIssueById(id: string): Issue | undefined {
    for (const status of boardColumns) {
      const found = columns[status].find((i) => i.id === id)
      if (found) return found
    }
    return undefined
  }

  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto">
      <div className="p-4">
        <Kanban
          value={columns}
          onValueChange={setColumns}
          getItemValue={(issue: Issue) => issue.id}
          onDragEnd={handleDragEnd}
          flatCursor
        >
          <KanbanBoard className="items-start">
            {boardColumns.map((status) => (
              <KanbanColumn
                key={status}
                value={status}
                className="min-w-[280px] max-w-[280px] border-outline-variant/10 bg-surface-container/40"
              >
                {/* Column header */}
                <div className="flex items-center gap-2 px-1 py-1">
                  <span
                    className={cn("size-2 shrink-0 rounded-full", statusColorMap[status])}
                  />
                  <span className="text-xs font-medium text-on-surface">
                    {statusConfig[status].label}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {columns[status].length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {columns[status].map((issue) => (
                    <IssueBoardCard key={issue.id} issue={issue} />
                  ))}
                  {columns[status].length === 0 && (
                    <div className="flex items-center justify-center py-8 text-xs text-on-surface-variant">
                      No issues
                    </div>
                  )}
                </div>
              </KanbanColumn>
            ))}
          </KanbanBoard>

          <KanbanOverlay>
            {({ value }) => {
              const issue = findIssueById(value as string)
              if (!issue) return null
              return (
                <div className="rounded-lg border border-outline-variant/15 bg-surface p-3 shadow-md opacity-90">
                  <span className="font-mono text-[11px] text-on-surface-variant">
                    {issue.identifier}
                  </span>
                  <p className="mt-1 line-clamp-2 text-sm text-on-surface">
                    {issue.title}
                  </p>
                </div>
              )
            }}
          </KanbanOverlay>
        </Kanban>
      </div>
    </div>
  )
}
