import { useState } from "react"
import { useNavigate, useParams } from "@tanstack/react-router"
import {
  ChevronDown,
  Layers,
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
import { demoUser } from "@/lib/demo"
import { useCreateTeamMutation } from "@/query/mutations/settings"
import type { Workspace } from "./types"

export function WorkspaceDropdown({ workspace }: { workspace: Workspace | null }) {
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { slug?: string }
  const createTeam = useCreateTeamMutation()

  const [createTeamOpen, setCreateTeamOpen] = useState(false)
  const [teamForm, setTeamForm] = useState<TeamFormState>(createEmptyTeamForm())

  const workspaceName = workspace?.name ?? "No workspace"
  const workspaceInitial = workspaceName[0]?.toUpperCase() ?? "?"
  const activeWorkspaceSlug = params.slug ?? "acme-corp"

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
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar className="size-8">
              <AvatarImage src={demoUser.imageUrl ?? undefined} alt={demoUser.fullName} />
              <AvatarFallback className="text-xs">
                {(demoUser.firstName[0] ?? "") + (demoUser.lastName[0] ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                {demoUser.fullName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {demoUser.primaryEmailAddress.emailAddress}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>Teams</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setTeamForm(createEmptyTeamForm())
                setCreateTeamOpen(true)
              }}
            >
              <Plus className="size-4" />
              <span>Create team</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleManageTeams}>
              <Layers className="size-4" />
              <span>Manage teams</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
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
