import { CheckCircle2, ChevronRight, Flame, Play } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { useUpdateCycleStatusMutation } from "@/query/mutations/tickets"
import { IssueRow } from "./issue-row"
import type { Cycle, Issue } from "./types"

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00")
  const e = new Date(end + "T00:00:00")
  const sMonth = s.toLocaleString("en-US", { month: "short" })
  const eMonth = e.toLocaleString("en-US", { month: "short" })
  const sDay = s.getDate()
  const eDay = e.getDate()

  return `${sMonth} ${sDay} — ${eMonth} ${eDay}`
}

export function CycleGroup({
  cycle,
  issues,
}: {
  cycle: Cycle
  issues: Issue[]
}) {
  const updateCycleStatus = useUpdateCycleStatusMutation()
  const action =
    cycle.status === "upcoming"
      ? {
          label: "Start",
          icon: Play,
          nextStatus: "active" as const,
        }
      : cycle.status === "active"
        ? {
            label: "Complete",
            icon: CheckCircle2,
            nextStatus: "completed" as const,
          }
        : null

  return (
    <Collapsible defaultOpen className="group/cycle">
      <div className="flex items-center gap-2 px-4 py-2">
        <CollapsibleTrigger className="flex items-center gap-2 flex-1 min-w-0">
          <ChevronRight
            className="size-3.5 text-on-surface-variant transition-transform group-data-[state=open]/cycle:rotate-90"
            strokeWidth={1.5}
          />
          <Flame className="size-3.5 text-amber-500" strokeWidth={1.5} />
          <span className="text-sm font-medium text-on-surface">
            {cycle.name}
          </span>
          <span className="text-xs text-on-surface-variant tabular-nums">
            {issues.length}
          </span>
          <span className="text-xs text-on-surface-variant">
            {formatDateRange(cycle.startDate, cycle.endDate)}
          </span>
        </CollapsibleTrigger>

        {action ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 gap-1.5 px-2 text-xs"
            onClick={() =>
              updateCycleStatus.mutate({
                cycleId: cycle.id,
                status: action.nextStatus,
              })
            }
            disabled={updateCycleStatus.isPending}
          >
            <action.icon className="size-3.5" strokeWidth={1.5} />
            {action.label}
          </Button>
        ) : null}
      </div>

      <CollapsibleContent>
        {issues.map((issue) => (
          <IssueRow key={issue.id} issue={issue} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
