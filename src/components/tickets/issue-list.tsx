import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { CycleGroup } from "./cycle-group"
import { IssueRow } from "./issue-row"
import type { Cycle, Issue } from "./types"

export function IssueList({
  teamSlug,
  cycles,
  issues,
}: {
  teamSlug: string
  cycles: Cycle[]
  issues: Issue[]
}) {
  const issuesByCycle = cycles.map((cycle) => ({
    cycle,
    issues: issues.filter((issue) => issue.cycleId === cycle.id),
  }))

  // Issues without a cycle
  const uncycledIssues = issues.filter(
    (issue) => !issue.cycleId || !cycles.find((c) => c.id === issue.cycleId)
  )

  if (issues.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <Empty className="max-w-xl border-outline-variant/20 bg-surface px-8 py-12">
          <EmptyHeader>
            <EmptyTitle>No issues yet</EmptyTitle>
            <EmptyDescription>
              {cycles.length > 0
                ? "This team has active cycles but no issues yet. Create an issue to get started."
                : "This team does not have any cycles or issues in the database yet."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="py-1">
        {issuesByCycle.map(({ cycle, issues: cycleIssues }) => (
          <CycleGroup
            key={cycle.id}
            teamSlug={teamSlug}
            cycle={cycle}
            issues={cycleIssues}
          />
        ))}

        {uncycledIssues.length > 0 && (
          <div className="py-2">
            <div className="px-4 py-1">
              <span className="text-xs text-on-surface-variant font-medium">
                No cycle
              </span>
            </div>
            {uncycledIssues.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
