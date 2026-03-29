import { useState } from "react"
import { useNavigate, useParams } from "@tanstack/react-router"
import {
  useAuth,
  useUser,
  useOrganization,
  useOrganizationList,
  useClerk,
} from "@clerk/tanstack-react-start"
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Layers,
  LogOut,
  Plus,
} from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  createEmptyTeamForm,
  TeamForm,
  type TeamFormState,
} from "@/components/settings/team-form"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { getOrganizationDashboardPath, getOrganizationSlug, hardNavigate } from "@/lib/auth-routing"
import { useCreateTeamMutation } from "@/query/mutations/settings"
import type { Workspace } from "./types"

export function WorkspaceDropdown({ workspace }: { workspace: Workspace | null }) {
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { slug?: string }
  const { orgRole } = useAuth()
  const { user } = useUser()
  const { organization: currentOrg } = useOrganization()
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: true,
  })
  const { signOut } = useClerk()
  const createTeam = useCreateTeamMutation()

  const [createTeamOpen, setCreateTeamOpen] = useState(false)
  const [teamForm, setTeamForm] = useState<TeamFormState>(createEmptyTeamForm())

  const workspaceName = workspace?.name ?? "No workspace"
  const workspaceInitial = workspaceName[0]?.toUpperCase() ?? "?"
  const activeWorkspaceSlug =
    params.slug ??
    (currentOrg
      ? getOrganizationSlug({
          slug: currentOrg.slug,
          name: currentOrg.name,
        })
      : null)
  const canCreateTeam = orgRole === "org:admin" || orgRole === "org:owner"

  async function handleSwitchOrg(orgId: string, orgSlug: string | null) {
    if (orgId === currentOrg?.id) return
    if (!setActive) {
      return
    }

    const selectedOrg = userMemberships?.data?.find(
      (membership) => membership.organization.id === orgId
    )?.organization
    const destination = getOrganizationDashboardPath(
      getOrganizationSlug({
        slug: orgSlug,
        name: selectedOrg?.name,
      })
    )
    let handledNavigation = false

    await setActive({
      organization: orgId,
      redirectUrl: destination,
      navigate: async ({ decorateUrl }) => {
        handledNavigation = true
        hardNavigate(decorateUrl(destination))
      },
    })

    if (!handledNavigation) {
      hardNavigate(destination)
    }
  }

  async function handleCreateTeam() {
    if (!activeWorkspaceSlug || !teamForm.name.trim() || !teamForm.identifier.trim()) {
      return
    }

    try {
      const createdTeam = await createTeam.mutateAsync({
        name: teamForm.name.trim(),
        identifier: teamForm.identifier.trim(),
        color: teamForm.color,
      })

      toast.success("Team created")
      setCreateTeamOpen(false)
      setTeamForm(createEmptyTeamForm())
      navigate({
        to: "/$slug/tickets/$teamSlug/issues",
        params: {
          slug: activeWorkspaceSlug,
          teamSlug: createdTeam.slug,
        },
      })
    } catch {
      toast.error("Failed to create team")
    }
  }

  function handleManageTeams() {
    if (!activeWorkspaceSlug) return

    navigate({
      to: "/$slug/settings/teams",
      params: { slug: activeWorkspaceSlug },
    })
  }

  async function handleSignOut() {
    await signOut({ redirectUrl: "/sign-in" })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<SidebarMenuButton size="lg" className="gap-2 font-medium" />}
        >
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            {workspaceInitial}
          </span>
          <span className="truncate">{workspaceName}</span>
          <ChevronDown className="ml-auto size-4 text-on-surface-variant" strokeWidth={1.5} />
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="start" sideOffset={8} className="w-64">
          {user && (
            <>
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Avatar className="size-8">
                  <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
                  <AvatarFallback className="text-xs">
                    {(user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
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

          {userMemberships?.data && userMemberships.data.length > 0 && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                {userMemberships.data.map((membership) => {
                  const org = membership.organization
                  const isActive = org.id === currentOrg?.id

                  return (
                    <DropdownMenuItem key={org.id} onClick={() => handleSwitchOrg(org.id, org.slug)}>
                      <span className="flex size-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
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

          <DropdownMenuGroup>
            <DropdownMenuLabel>Teams</DropdownMenuLabel>
            {canCreateTeam && (
              <DropdownMenuItem
                onClick={() => {
                  setTeamForm(createEmptyTeamForm())
                  setCreateTeamOpen(true)
                }}
              >
                <Plus className="size-4" />
                <span>Create team</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleManageTeams}>
              <Layers className="size-4" />
              <span>Manage teams</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigate({ to: "/org-select", search: { intent: "switch" } })}
            >
              <ArrowLeftRight className="size-4" />
              <span>Switch workspace</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate({ to: "/org-select", search: { intent: "create" } })}
            >
              <Plus className="size-4" />
              <span>Create another workspace</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut className="size-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create team</DialogTitle>
            <DialogDescription>
              Add a new team to organize issues and cycles.
            </DialogDescription>
          </DialogHeader>
          <TeamForm
            form={teamForm}
            onChange={setTeamForm}
            onSubmit={handleCreateTeam}
            submitLabel={createTeam.isPending ? "Creating..." : "Create team"}
            disabled={createTeam.isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
