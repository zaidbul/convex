import { Link, useParams } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
  ChevronLeft,
  Settings,
  Users2,
  UserCircle,
  Layers,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { workspaceQueryOptions } from "@/query/options/tickets"

type NavItem = {
  label: string
  to: string
  icon: React.ElementType
}

type NavGroup = {
  title: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { label: "General", to: "/$slug/settings/general", icon: Settings },
      { label: "Teams", to: "/$slug/settings/teams", icon: Layers },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Members", to: "/$slug/settings/members", icon: Users2 },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", to: "/$slug/settings/profile", icon: UserCircle },
    ],
  },
]

export function SettingsNav() {
  const params = useParams({ strict: false })
  const slug = (params as { slug?: string }).slug
  const { data: workspace } = useSuspenseQuery(workspaceQueryOptions())

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="space-y-2 px-3 py-3">
        <div className="text-sm font-medium text-on-surface truncate group-data-[collapsible=icon]:hidden">
          {workspace?.name ?? "Settings"}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-1.5 px-0 text-muted-foreground hover:text-foreground"
          render={
            <Link
              to="/$slug/tickets"
              params={{ slug: slug! }}
              search={{}}
            />
          }
        >
          <ChevronLeft className="size-4" />
          <span className="group-data-[collapsible=icon]:hidden">
            Back to app
          </span>
        </Button>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    render={
                      <Link
                        to={item.to}
                        params={{ slug: slug! }}
                      />
                    }
                  >
                    <item.icon className="size-4" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
