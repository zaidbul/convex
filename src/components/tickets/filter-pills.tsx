import { BarChart3, Inbox, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { IssueFilter } from "./types"

interface FilterOption {
  label: string
  value: IssueFilter
  icon?: React.ComponentType<{ className?: string }>
}

const filters: FilterOption[] = [
  { label: "All issues", value: "all" },
  { label: "Active", value: "active" },
  { label: "Backlog", value: "backlog" },
  { label: "Backlog Not Estimated", value: "backlog-not-estimated", icon: BarChart3 },
  { label: "Backlog Graded", value: "backlog-graded", icon: Inbox },
  { label: "Recently Added Backlog", value: "recently-added", icon: Clock },
]

export function FilterPills({
  activeFilter,
  onFilterChange,
}: {
  activeFilter?: IssueFilter
  onFilterChange?: (filter: IssueFilter) => void
}) {
  const handleClick = (value: IssueFilter) => {
    onFilterChange?.(value)
  }

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
      {filters.map((filter) => {
        const isActive = filter.value === activeFilter
        return (
          <button
            key={filter.value}
            onClick={() => handleClick(filter.value)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-surface-high text-on-surface shadow-[0_0_0_0.5px_rgba(255,255,255,0.16)]"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            )}
          >
            {filter.icon && <filter.icon className="size-3.5" />}
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
