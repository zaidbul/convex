import { ChevronRight, Flame, Plus } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
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

        <Button variant="ghost" size="icon" className="size-6 shrink-0">
          <Plus className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
        </Button>
      </div>

      <CollapsibleContent>
        {issues.map((issue) => (
          <IssueRow key={issue.id} issue={issue} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
