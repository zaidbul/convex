import {
  Bell,
  SlidersHorizontal,
  LayoutGrid,
  PanelRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FilterPills } from "./filter-pills"
import type { IssueFilter, Team } from "./types"

export function TicketHeader({ team, activeFilter, onFilterChange }: { team: Team; activeFilter?: IssueFilter; onFilterChange?: (filter: IssueFilter) => void }) {
  return (
    <div className="sticky top-0 z-10 flex flex-col bg-surface-low">
      {/* Row 1: Team name + actions */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-outline-variant/15">
        <SidebarTrigger className="md:hidden" />
        <span
          className="size-4 shrink-0 rounded-sm"
          style={{ backgroundColor: team.color }}
        />
        <h1 className="font-display text-sm font-medium tracking-tight text-on-surface">
          {team.name}
        </h1>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" className="size-7" disabled title="Coming soon">
            <Bell className="size-4 text-on-surface-variant" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Row 2: Filter pills + toolbar */}
      <div className="flex items-center gap-2 px-4 py-1.5">
        <div className="flex-1 min-w-0">
          <FilterPills activeFilter={activeFilter} onFilterChange={onFilterChange} />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="size-7" disabled title="Coming soon">
            <SlidersHorizontal className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
          </Button>
          <Button variant="ghost" size="icon" className="size-7" disabled title="Coming soon">
            <LayoutGrid className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
          </Button>
          <Button variant="ghost" size="icon" className="size-7" disabled title="Coming soon">
            <PanelRight className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  )
}
