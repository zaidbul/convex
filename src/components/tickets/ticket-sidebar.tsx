import { Link } from "@tanstack/react-router"
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
  ChevronDown,
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

export function TicketSidebar() {
  const { data: workspace } = useSuspenseQuery(workspaceQueryOptions())
  const { data: teams } = useSuspenseQuery(teamsQueryOptions())
  const workspaceName = workspace?.name ?? "No workspace"
  const workspaceInitial = workspaceName[0]?.toUpperCase() ?? "?"

  return (
    <>
      <SidebarHeader className="px-3 py-2">
        <div className="flex items-center justify-between">
          <SidebarMenuButton
            size="lg"
            className="gap-2 font-medium"
          >
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              {workspaceInitial}
            </span>
            <span className="truncate">{workspaceName}</span>
            <ChevronDown className="ml-auto size-4 text-on-surface-variant" strokeWidth={1.5} />
          </SidebarMenuButton>
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="size-7">
              <Search className="size-4" strokeWidth={1.5} />
            </Button>
            <Button variant="ghost" size="icon" className="size-7">
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
                <SidebarMenuButton render={<Link to="/tickets" />}>
                  <Inbox className="size-4" strokeWidth={1.5} />
                  <span>Inbox</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/tickets" />}>
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
    </>
  )
}
