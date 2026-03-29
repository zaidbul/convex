import { Link, useParams } from "@tanstack/react-router"
import {
  ChevronRight,
  CircleDot,
  RefreshCw,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import type { Team } from "./types"

const teamNavItems = [
  { label: "Issues", icon: CircleDot, path: "issues" as const },
]

const cycleSubItems = [{ label: "Current" }, { label: "Upcoming" }]

export function TeamTree({ teams }: { teams: Team[] }) {
  const params = useParams({ strict: false })
  const activeTeamSlug = (params as { teamSlug?: string }).teamSlug

  if (teams.length === 0) {
    return (
      <div className="px-2 py-3 text-sm text-on-surface-variant">
        No teams yet.
      </div>
    )
  }

  return (
    <SidebarMenu>
      {teams.map((team) => (
        <TeamItem
          key={team.id}
          team={team}
          isActive={activeTeamSlug === team.slug}
        />
      ))}
    </SidebarMenu>
  )
}

function TeamItem({ team, isActive }: { team: Team; isActive: boolean }) {
  const params = useParams({ strict: false })
  const slug = (params as { slug?: string }).slug
  const activeTeamSlug = (params as { teamSlug?: string }).teamSlug

  return (
    <Collapsible defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton className="font-medium" />
          }
        >
          <span
            className="size-3 shrink-0 rounded-sm"
            style={{ backgroundColor: team.color }}
          />
          <span>{team.name}</span>
          <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {teamNavItems.map((item) => (
              <SidebarMenuSubItem key={item.path}>
                <SidebarMenuSubButton
                  isActive={
                    activeTeamSlug === team.slug && item.path === "issues"
                  }
                  render={
                    <Link
                      to="/$slug/tickets/$teamSlug/issues"
                      params={{ slug: slug!, teamSlug: team.slug }}
                      search={{ filter: undefined }}
                    />
                  }
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}

            {/* Cycles sub-section */}
            <Collapsible defaultOpen={isActive} className="group/cycles">
              <SidebarMenuSubItem>
                <CollapsibleTrigger
                  render={<SidebarMenuSubButton />}
                >
                  <RefreshCw className="size-4" />
                  <span>Cycles</span>
                  <ChevronRight className="ml-auto size-3 transition-transform group-data-[state=open]/cycles:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="ml-4 flex flex-col gap-0.5 py-0.5">
                    {cycleSubItems.map((sub) => (
                      <li key={sub.label}>
                        <SidebarMenuSubButton size="sm" className="opacity-50 pointer-events-none">
                          <span className="text-on-surface-variant">
                            {sub.label}
                          </span>
                        </SidebarMenuSubButton>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </SidebarMenuSubItem>
            </Collapsible>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
