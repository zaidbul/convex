import { useState } from "react"
import { Link, useParams } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
  LayoutDashboard,
  Inbox,
  CircleUser,
  Sparkles,
  Search,
  Plus,
  Eye,
  Settings,
  HelpCircle,
} from "lucide-react"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  teamsQueryOptions,
  savedViewsQueryOptions,
  workspaceQueryOptions,
} from "@/query/options/tickets"
import { TeamTree } from "./team-tree"
import { WorkspaceDropdown } from "./workspace-dropdown"
import { CreateIssueDialog } from "./create-issue-dialog"
import { useCommandPalette } from "./command-palette-provider"

export function TicketSidebar() {
  const params = useParams({ strict: false })
  const slug = (params as { slug?: string }).slug
  const activeViewId = (params as { viewId?: string }).viewId
  const { data: workspace } = useSuspenseQuery(workspaceQueryOptions())
  const { data: teams } = useSuspenseQuery(teamsQueryOptions())
  const { data: savedViews } = useSuspenseQuery(savedViewsQueryOptions())
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { setOpen: setCommandPaletteOpen } = useCommandPalette()

  return (
    <>
      <SidebarHeader className="px-3 py-2">
        <div className="flex items-center justify-between">
          <WorkspaceDropdown workspace={workspace} />
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setCommandPaletteOpen(true)}>
              <Search className="size-4" strokeWidth={1.5} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="size-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Primary nav */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      to="/$slug/tickets/feedback"
                      params={{ slug: slug! }}
                      search={{ suggestionId: undefined }}
                    />
                  }
                >
                  <Sparkles className="size-4" strokeWidth={1.5} />
                  <span>Feedback</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      to="/$slug/tickets/dashboard"
                      params={{ slug: slug! }}
                    />
                  }
                >
                  <LayoutDashboard className="size-4" strokeWidth={1.5} />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      to="/$slug/tickets"
                      params={{ slug: slug! }}
                      search={{}}
                    />
                  }
                >
                  <Inbox className="size-4" strokeWidth={1.5} />
                  <span>Inbox</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    teams.length > 0
                      ? <Link
                          to="/$slug/tickets/$teamSlug/issues"
                          params={{ slug: slug!, teamSlug: teams[0].slug }}
                          search={{ filter: "my-issues" }}
                        />
                      : <Link to="/$slug/tickets" params={{ slug: slug! }} search={{}} />
                  }
                >
                  <CircleUser className="size-4" strokeWidth={1.5} />
                  <span>My Issues</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Workspace section */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Workspace</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      to="/$slug/tickets/views"
                      params={{ slug: slug! }}
                    />
                  }
                >
                  <Eye className="size-4" strokeWidth={1.5} />
                  <span>Views</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {savedViews.map((view) => (
                <SidebarMenuItem key={view.id}>
                  <SidebarMenuButton
                    isActive={activeViewId === view.id}
                    render={
                      <Link
                        to="/$slug/tickets/views/$viewId"
                        params={{ slug: slug!, viewId: view.id }}
                      />
                    }
                    className="pl-8"
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: view.teamColor }}
                    />
                    <span className="truncate">{view.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      to="/$slug/tickets/settings"
                      params={{ slug: slug! }}
                    />
                  }
                >
                  <Settings className="size-4" strokeWidth={1.5} />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Teams section */}
        <SidebarGroup>
          <SidebarGroupLabel>Your teams</SidebarGroupLabel>
          <SidebarGroupContent>
            <TeamTree teams={teams} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="opacity-50 pointer-events-none">
              <HelpCircle className="size-4" strokeWidth={1.5} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <CreateIssueDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        teams={teams}
      />
    </>
  )
}
