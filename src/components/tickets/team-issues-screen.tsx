import { useSuspenseQuery } from "@tanstack/react-query"
import { IssueList } from "@/components/tickets/issue-list"
import { cyclesQueryOptions, issuesQueryOptions, teamQueryOptions } from "@/query/options/tickets"
import { getFilterPillSelection } from "./filter-state"
import { TicketHeader } from "./ticket-header"
import type { IssueFilter, IssueQueryFilters } from "./types"

export function TeamIssuesScreen({
  teamSlug,
  filters,
  defaultFilter = "active",
  savedViewName,
  onPresetChange,
  onAdvancedFiltersChange,
  onSaveView,
  onUpdateView,
}: {
  teamSlug: string
  filters: IssueQueryFilters
  defaultFilter?: IssueFilter
  savedViewName?: string
  onPresetChange: (filter: IssueFilter) => void
  onAdvancedFiltersChange: (filters?: IssueQueryFilters["advancedFilters"]) => void
  onSaveView?: () => void
  onUpdateView?: () => void
}) {
  const { data: team } = useSuspenseQuery(teamQueryOptions(teamSlug))
  const { data: cycles } = useSuspenseQuery(cyclesQueryOptions(teamSlug))
  const { data: issues } = useSuspenseQuery(issuesQueryOptions(teamSlug, filters))

  return (
    <div className="flex h-screen flex-col bg-surface-low">
      <TicketHeader
        team={team}
        activeFilter={getFilterPillSelection(filters, defaultFilter)}
        advancedFilters={filters.advancedFilters}
        savedViewName={savedViewName}
        onFilterChange={onPresetChange}
        onAdvancedFiltersChange={onAdvancedFiltersChange}
        onSaveView={onSaveView}
        onUpdateView={onUpdateView}
      />
      <IssueList teamSlug={teamSlug} cycles={cycles} issues={issues} />
    </div>
  )
}
