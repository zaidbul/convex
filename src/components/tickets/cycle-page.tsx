import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { CalendarRange, RefreshCw, Target } from "lucide-react"
import {
  getFilterPillSelection,
  serializeIssueQueryFilters,
} from "@/components/tickets/filter-state"
import { IssueRow } from "@/components/tickets/issue-row"
import { TicketHeader } from "@/components/tickets/ticket-header"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  cyclesQueryOptions,
  issuesQueryOptions,
  teamQueryOptions,
} from "@/query/options/tickets"
import { CycleIssuePicker } from "./cycle-issue-picker"
import {
  formatCycleDateRange,
  getCycleForView,
  getCycleProgress,
  getCycleStatusLabel,
  getIssuesForCycle,
  type CycleViewKind,
} from "./cycle-utils"
import type { Cycle, Issue, IssueQueryFilters, Team } from "./types"

type CyclePageProps = {
  teamSlug: string
  filters: IssueQueryFilters
  viewKind: CycleViewKind
}

export function CyclePage({ teamSlug, filters, viewKind }: CyclePageProps) {
  const navigate = useNavigate()
  const { data: team } = useSuspenseQuery(teamQueryOptions(teamSlug))
  const { data: cycles } = useSuspenseQuery(cyclesQueryOptions(teamSlug))
  const { data: filteredIssues } = useSuspenseQuery(
    issuesQueryOptions(teamSlug, filters),
  )
  const { data: allIssues = [] } = useQuery(
    issuesQueryOptions(teamSlug, { presetFilter: "all" }),
  )
  const cycle = getCycleForView(cycles, viewKind)
  const allCycleIssues = cycle ? getIssuesForCycle(allIssues, cycle.id) : []
  const visibleIssues = cycle ? getIssuesForCycle(filteredIssues, cycle.id) : []

  return (
    <div className="flex h-screen flex-col bg-surface-low">
      <TicketHeader
        team={team}
        activeFilter={getFilterPillSelection(filters, "active")}
        advancedFilters={filters.advancedFilters}
        onFilterChange={(presetFilter) =>
          navigate({
            search: () =>
              serializeIssueQueryFilters(
                { presetFilter },
                { omitActivePreset: true },
              ),
          } as unknown as Parameters<typeof navigate>[0])
        }
        onAdvancedFiltersChange={(advancedFilters) =>
          navigate({
            search: () =>
              serializeIssueQueryFilters(
                advancedFilters
                  ? { advancedFilters }
                  : { presetFilter: "active" },
                { omitActivePreset: true },
              ),
          } as unknown as Parameters<typeof navigate>[0])
        }
      />
      <CyclePageBody
        team={team}
        teamSlug={teamSlug}
        viewKind={viewKind}
        cycle={cycle}
        allCycleIssues={allCycleIssues}
        visibleIssues={visibleIssues}
        filters={filters}
      />
    </div>
  )
}

export function CyclePageBody({
  team,
  teamSlug,
  viewKind,
  cycle,
  allCycleIssues,
  visibleIssues,
  filters,
}: {
  team: Team
  teamSlug: string
  viewKind: CycleViewKind
  cycle: Cycle | null
  allCycleIssues: Issue[]
  visibleIssues: Issue[]
  filters: IssueQueryFilters
}) {
  if (!cycle) {
    const title = viewKind === "current" ? "No current cycle" : "No upcoming cycle"
    const description =
      viewKind === "current"
        ? "This team does not have an active cycle yet. Start an upcoming cycle to see work here."
        : "This team does not have a planned upcoming cycle yet. Create or schedule the next cycle to plan work here."

    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <Empty className="max-w-xl border-outline-variant/30 bg-surface px-8 py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <RefreshCw />
            </EmptyMedia>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>{description}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  const progress = getCycleProgress(allCycleIssues)
  const openIssues = Math.max(progress.total - progress.completed, 0)

  return (
    <ScrollArea className="flex-1">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-6">
        <section className="rounded-3xl border border-outline-variant/15 bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {team.name}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">
                    {cycle.name}
                  </h2>
                  <span className="rounded-full border border-outline-variant/20 bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant">
                    {getCycleStatusLabel(cycle)}
                  </span>
                </div>
                <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Target className="size-3.5" strokeWidth={1.5} />
                    Cycle {cycle.number}
                  </span>
                  <span className="text-outline-variant/60">/</span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarRange className="size-3.5" strokeWidth={1.5} />
                    {formatCycleDateRange(cycle.startDate, cycle.endDate)}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 self-start">
                <CycleIssuePicker
                  cycle={cycle}
                  teamSlug={teamSlug}
                  trigger={
                    <Button variant="outline" size="sm" className="gap-1.5">
                      Add issue
                    </Button>
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1.8fr)_repeat(3,minmax(0,1fr))]">
              <div className="rounded-2xl border border-outline-variant/10 bg-surface-container/40 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Progress
                  </span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <Progress value={progress.percentage} aria-label="Cycle progress" />
                <div className="mt-3 text-xs text-muted-foreground">
                  {progress.percentage}% complete
                </div>
              </div>

              <CycleStat label="Scope" value={`${allCycleIssues.length}`} />
              <CycleStat label="Open" value={`${openIssues}`} />
              <CycleStat label="Completed" value={`${progress.completed}`} />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-outline-variant/15 bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/10 px-4 py-3">
            <div>
              <h3 className="text-sm font-medium text-foreground">Issues</h3>
              <p className="text-xs text-muted-foreground">
                {filters.presetFilter || filters.advancedFilters
                  ? `${visibleIssues.length} issues match the current filter`
                  : `${visibleIssues.length} issues in this cycle`}
              </p>
            </div>
          </div>

          {visibleIssues.length === 0 ? (
            <div className="px-6 py-12">
              <Empty className="border-outline-variant/20 bg-surface-container/20 px-8 py-10">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <RefreshCw />
                  </EmptyMedia>
                  <EmptyTitle>
                    {allCycleIssues.length === 0
                      ? "No issues in this cycle"
                      : "No issues match this filter"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {allCycleIssues.length === 0
                      ? "Add work to this cycle from the picker above to start planning."
                      : "Change the filter pills or advanced filters above to see more issues in this cycle."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <div className="py-1">
              {visibleIssues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </section>
      </div>
    </ScrollArea>
  )
}

function CycleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/10 bg-surface-container/40 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-2xl font-medium tracking-tight text-foreground tabular-nums">
        {value}
      </div>
    </div>
  )
}
