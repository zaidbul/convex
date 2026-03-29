import { useSuspenseQuery } from "@tanstack/react-query"
import { IssueList } from "@/components/tickets/issue-list"
import { IssueBoard } from "@/components/tickets/issue-board"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { cyclesQueryOptions, issuesQueryOptions, teamQueryOptions } from "@/query/options/tickets"
import { getFilterPillSelection } from "./filter-state"
import type { ViewMode } from "./filter-state"
import { IssuePanelProvider, useIssuePanel } from "./issue-panel-provider"
import { IssueSidePanel } from "./issue-side-panel"
import { TicketHeader } from "./ticket-header"
import type { IssueFilter, IssueQueryFilters } from "./types"

function IssueContent({
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
  const { panelOpen } = useIssuePanel()

  const listOrBoard =
    viewMode === "board" ? (
      <IssueBoard teamSlug={teamSlug} issues={issues} />
    ) : (
      <IssueList teamSlug={teamSlug} cycles={cycles} issues={issues} />
    )

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
      {panelOpen ? (
        <ResizablePanelGroup className="flex-1 overflow-hidden">
          <ResizablePanel minSize={30}>
            {listOrBoard}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={35} minSize={25} maxSize={60}>
            <IssueSidePanel teamSlug={teamSlug} />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        listOrBoard
      )}
    </div>
  )
}

export function TeamIssuesScreen(
  props: {
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
  },
) {
  return (
    <IssuePanelProvider>
      <IssueContent {...props} />
    </IssuePanelProvider>
  )
}
