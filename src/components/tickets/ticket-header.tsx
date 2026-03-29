import {
  Bell,
  LayoutGrid,
  List,
  PanelRight,
  Plus,
  SlidersHorizontal,
} from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { AdvancedFiltersSheet } from "./advanced-filters-sheet"
import { FilterPills } from "./filter-pills"
import { useIssuePanelSafe } from "./issue-panel-provider"
import type { ViewMode } from "./filter-state"
import type { IssueAdvancedFilters, IssueFilter, Team } from "./types"
import { NotificationList } from "@/components/notifications/notification-list"
import { navigateToNotification } from "@/components/notifications/notification-navigation"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useMarkNotificationAsReadMutation } from "@/query/mutations/tickets"
import {
  recentNotificationsQueryOptions,
  unreadNotificationCountQueryOptions,
} from "@/query/options/tickets"
import { cn } from "@/lib/utils"

export function TicketHeader({
  team,
  activeFilter,
  advancedFilters,
  savedViewName,
  viewMode = "list",
  onFilterChange,
  onAdvancedFiltersChange,
  onViewModeChange,
  onSaveView,
  onUpdateView,
  onCreateCycle,
}: {
  team: Team
  activeFilter?: IssueFilter
  advancedFilters?: IssueAdvancedFilters
  savedViewName?: string
  viewMode?: ViewMode
  onFilterChange?: (filter: IssueFilter) => void
  onAdvancedFiltersChange?: (filters?: IssueAdvancedFilters) => void
  onViewModeChange?: (mode: ViewMode) => void
  onSaveView?: () => void
  onUpdateView?: () => void
  onCreateCycle?: () => void
}) {
  const { slug } = useParams({ strict: false })
  const navigate = useNavigate()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const issuePanel = useIssuePanelSafe()
  const { data: unreadCount = 0 } = useQuery(
    unreadNotificationCountQueryOptions()
  )
  const { data: recentNotifications = [] } = useQuery(
    recentNotificationsQueryOptions(10)
  )
  const markAsRead = useMarkNotificationAsReadMutation()

  return (
    <div className="sticky top-0 z-10 flex flex-col bg-surface-low">
      {/* Row 1: Team name + actions */}
      <div className="flex items-center gap-2 border-b border-outline-variant/15 px-4 py-2.5">
        <SidebarTrigger className="md:hidden" />
        <span
          className="size-4 shrink-0 rounded-sm"
          style={{ backgroundColor: team.color }}
        />
        <h1 className="font-display text-sm font-medium tracking-tight text-on-surface">
          {team.name}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {onCreateCycle ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={onCreateCycle}
            >
              <Plus className="size-3.5" strokeWidth={1.5} />
              New cycle
            </Button>
          ) : null}
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative size-7"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell
                    className="size-4 text-on-surface-variant"
                    strokeWidth={1.5}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-4 rounded-full bg-primary px-1 text-[10px] leading-4 font-medium text-primary-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              }
            />
            <PopoverContent align="end" className="w-[380px] gap-3 p-0">
              <PopoverHeader className="border-b border-outline-variant/10 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <PopoverTitle className="text-sm">Notifications</PopoverTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!slug) return
                      navigate({
                        to: "/$slug/tickets",
                        params: { slug },
                        search: {},
                      })
                    }}
                  >
                    Open inbox
                  </Button>
                </div>
              </PopoverHeader>
              <div className="max-h-[420px] overflow-y-auto px-3 pb-3">
                <NotificationList
                  notifications={recentNotifications}
                  compact
                  emptyMessage="No recent notifications."
                  onMarkAsRead={(notificationId) =>
                    markAsRead.mutate({ notificationId })
                  }
                  onSelect={(notification) => {
                    if (!notification.readAt) {
                      markAsRead.mutate({ notificationId: notification.id })
                    }
                    if (slug) {
                      navigateToNotification(navigate, slug, notification)
                    }
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Row 2: Filter pills + toolbar */}
      <div className="flex items-center gap-2 px-4 py-1.5">
        <div className="min-w-0 flex-1">
          <FilterPills
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setFiltersOpen(true)}
            title="Advanced filters"
          >
            <SlidersHorizontal
              className="size-3.5 text-on-surface-variant"
              strokeWidth={1.5}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-7", viewMode === "list" && "bg-surface-high")}
            onClick={() => onViewModeChange?.("list")}
            title="List view"
          >
            <List
              className="size-3.5 text-on-surface-variant"
              strokeWidth={1.5}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-7", viewMode === "board" && "bg-surface-high")}
            onClick={() => onViewModeChange?.("board")}
            title="Board view"
          >
            <LayoutGrid
              className="size-3.5 text-on-surface-variant"
              strokeWidth={1.5}
            />
          </Button>
          {issuePanel ? (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-7",
                issuePanel.panelOpen && "bg-surface-high"
              )}
              onClick={issuePanel.togglePanel}
              title={issuePanel.panelOpen ? "Close panel" : "Open panel"}
            >
              <PanelRight
                className="size-3.5 text-on-surface-variant"
                strokeWidth={1.5}
              />
            </Button>
          ) : null}
        </div>
      </div>

      <AdvancedFiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        teamId={team.id}
        teamSlug={team.slug}
        presetFilter={activeFilter}
        advancedFilters={advancedFilters}
        savedViewName={savedViewName}
        onAdvancedFiltersChange={onAdvancedFiltersChange ?? (() => undefined)}
        onSaveView={onSaveView}
        onUpdateView={onUpdateView}
      />
    </div>
  )
}
