import { useNavigate } from "@tanstack/react-router"
import { useUser, useOrganization, useOrganizationList, useClerk } from "@clerk/tanstack-react-start"
import {
  Check,
  ChevronDown,
  LogOut,
  Plus,
  ArrowLeftRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Workspace } from "./types"

export function WorkspaceDropdown({ workspace }: { workspace: Workspace | null }) {
  const navigate = useNavigate()
  const { user } = useUser()
  const { organization: currentOrg } = useOrganization()
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: { infinite: true },
  })
  const { signOut } = useClerk()

  const workspaceName = workspace?.name ?? "No workspace"
  const workspaceInitial = workspaceName[0]?.toUpperCase() ?? "?"

  async function handleSwitchOrg(orgId: string, orgSlug: string | null) {
    if (orgId === currentOrg?.id) return
    await setActive?.({ organization: orgId })
    if (orgSlug) {
      navigate({ to: "/$slug/tickets", params: { slug: orgSlug }, search: {} })
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate({ to: "/sign-in" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton size="lg" className="gap-2 font-medium" />
        }
      >
        <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
          {workspaceInitial}
        </span>
        <span className="truncate">{workspaceName}</span>
        <ChevronDown className="ml-auto size-4 text-on-surface-variant" strokeWidth={1.5} />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" sideOffset={8} className="w-64">
        {/* User info */}
        {user && (
          <>
            <div className="flex items-center gap-3 px-3 py-2.5">
              <Avatar className="size-8">
                <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
                <AvatarFallback className="text-xs">
                  {(user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-medium text-foreground">
                  {user.fullName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Organization list */}
        {userMemberships?.data && userMemberships.data.length > 0 && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              {userMemberships.data.map((membership) => {
                const org = membership.organization
                const isActive = org.id === currentOrg?.id
                return (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => handleSwitchOrg(org.id, org.slug)}
                  >
                    <span className="flex size-5 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-bold">
                      {org.name[0]?.toUpperCase()}
                    </span>
                    <span className="flex-1 truncate">{org.name}</span>
                    {isActive && <Check className="size-4 text-muted-foreground" />}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate({ to: "/org-select" })}>
            <ArrowLeftRight className="size-4" />
            <span>Switch workspace</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: "/org-select" })}>
            <Plus className="size-4" />
            <span>Create workspace</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut className="size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
