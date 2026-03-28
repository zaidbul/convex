import {
  Bell,
  SlidersHorizontal,
  LayoutGrid,
  PanelRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FilterPills } from "./filter-pills"
import type { Team } from "./types"

const teamColorMap: Record<string, string> = {
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
}

export function TicketHeader({ team }: { team: Team }) {
  return (
    <div className="sticky top-0 z-10 flex flex-col bg-surface-low">
      {/* Row 1: Team name + actions */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-outline-variant/15">
        <SidebarTrigger className="md:hidden" />
        <span
          className={`size-4 shrink-0 rounded-sm ${teamColorMap[team.color] ?? "bg-muted-foreground"}`}
        />
        <h1 className="font-display text-sm font-medium tracking-tight text-on-surface">
          {team.name}
        </h1>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" className="size-7">
            <Bell className="size-4 text-on-surface-variant" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Row 2: Filter pills + toolbar */}
      <div className="flex items-center gap-2 px-4 py-1.5">
        <div className="flex-1 min-w-0">
          <FilterPills />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="size-7">
            <SlidersHorizontal className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
          </Button>
          <Button variant="ghost" size="icon" className="size-7">
            <LayoutGrid className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
          </Button>
          <Button variant="ghost" size="icon" className="size-7">
            <PanelRight className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  )
}
