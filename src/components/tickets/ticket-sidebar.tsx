import { useState } from "react"
import { Link, useParams } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
  Inbox,
  CircleUser,
  Search,
  Plus,
  Rocket,
  FolderKanban,
  Eye,
  MoreHorizontal,
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
  workspaceQueryOptions,
} from "@/query/options/tickets"
import { TeamTree } from "./team-tree"
import { WorkspaceDropdown } from "./workspace-dropdown"
import { CreateIssueDialog } from "./create-issue-dialog"

export function TicketSidebar() {
  const params = useParams({ strict: false })
  const slug = (params as { slug?: string }).slug
  const { data: workspace } = useSuspenseQuery(workspaceQueryOptions())
  const { data: teams } = useSuspenseQuery(teamsQueryOptions())
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  return (
    <>
      <SidebarHeader className="px-3 py-2">
        <div className="flex items-center justify-between">
          <WorkspaceDropdown workspace={workspace} />
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="size-7">
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
                      to="/$slug/tickets"
                      params={{ slug: slug! }}
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
                    <Link
                      to="/$slug/tickets"
                      params={{ slug: slug! }}
                    />
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
                <SidebarMenuButton>
                  <Rocket className="size-4" strokeWidth={1.5} />
                  <span>Initiatives</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FolderKanban className="size-4" strokeWidth={1.5} />
                  <span>Projects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Eye className="size-4" strokeWidth={1.5} />
                  <span>Views</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MoreHorizontal className="size-4" strokeWidth={1.5} />
                  <span>More</span>
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
            <SidebarMenuButton>
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
