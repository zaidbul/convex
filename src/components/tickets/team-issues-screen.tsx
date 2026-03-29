import { useSuspenseQuery } from "@tanstack/react-query"
import { IssueList } from "@/components/tickets/issue-list"
import { IssueBoard } from "@/components/tickets/issue-board"
import { cyclesQueryOptions, issuesQueryOptions, teamQueryOptions } from "@/query/options/tickets"
import { getFilterPillSelection } from "./filter-state"
import type { ViewMode } from "./filter-state"
import { TicketHeader } from "./ticket-header"
import type { IssueFilter, IssueQueryFilters } from "./types"

export function TeamIssuesScreen({
  teamSlug,
  filters,
  defaultFilter = "active",
  savedViewName,
  viewMode = "list",
  onPresetChange,
  onAdvancedFiltersChange,
  onViewModeChange,
  onSaveView,
  onUpdateView,
}: {
  teamSlug: string
  filters: IssueQueryFilters
  defaultFilter?: IssueFilter
  savedViewName?: string
  viewMode?: ViewMode
  onPresetChange: (filter: IssueFilter) => void
  onAdvancedFiltersChange: (filters?: IssueQueryFilters["advancedFilters"]) => void
  onViewModeChange?: (mode: ViewMode) => void
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
        viewMode={viewMode}
        onFilterChange={onPresetChange}
        onAdvancedFiltersChange={onAdvancedFiltersChange}
        onViewModeChange={onViewModeChange}
        onSaveView={onSaveView}
        onUpdateView={onUpdateView}
      />
      {viewMode === "board" ? (
        <IssueBoard teamSlug={teamSlug} issues={issues} />
      ) : (
        <IssueList teamSlug={teamSlug} cycles={cycles} issues={issues} />
      )}
    </div>
  )
}
