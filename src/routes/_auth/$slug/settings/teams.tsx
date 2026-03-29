import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useUpdateTeamMutation,
} from "@/query/mutations/settings"
import { teamsWithStatsQueryOptions } from "@/query/options/settings"
import type { TeamWithMemberCount } from "@/server/functions/settings-data"

const TEAM_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#6b7280", // gray
]

export const Route = createFileRoute("/_auth/$slug/settings/teams")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(teamsWithStatsQueryOptions())
  },
  component: TeamsSettingsPage,
})

type TeamFormState = {
  name: string
  identifier: string
  color: string
}

function TeamsSettingsPage() {
  const { data: teams } = useSuspenseQuery(teamsWithStatsQueryOptions())
  const createTeam = useCreateTeamMutation()
  const updateTeam = useUpdateTeamMutation()
  const deleteTeam = useDeleteTeamMutation()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<TeamWithMemberCount | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TeamWithMemberCount | null>(null)
  const [form, setForm] = useState<TeamFormState>({ name: "", identifier: "", color: TEAM_COLORS[0] })

  const openCreate = () => {
    setForm({ name: "", identifier: "", color: TEAM_COLORS[0] })
    setCreateOpen(true)
  }

  const openEdit = (team: TeamWithMemberCount) => {
    setForm({ name: team.name, identifier: team.identifier, color: team.color })
    setEditTarget(team)
  }

  const handleCreateSubmit = async () => {
    if (!form.name.trim() || !form.identifier.trim()) return
    try {
      await createTeam.mutateAsync({
        name: form.name.trim(),
        identifier: form.identifier.trim(),
        color: form.color,
      })
      toast.success("Team created")
      setCreateOpen(false)
    } catch {
      toast.error("Failed to create team")
    }
  }

  const handleEditSubmit = async () => {
    if (!editTarget || !form.name.trim() || !form.identifier.trim()) return
    try {
      await updateTeam.mutateAsync({
        teamId: editTarget.id,
        name: form.name.trim(),
        identifier: form.identifier.trim(),
        color: form.color,
      })
      toast.success("Team updated")
      setEditTarget(null)
    } catch {
      toast.error("Failed to update team")
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteTeam.mutateAsync({ teamId: deleteTarget.id })
      toast.success("Team deleted")
      setDeleteTarget(null)
    } catch {
      toast.error("Failed to delete team")
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Teams</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage teams in your workspace.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New team
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All teams</CardTitle>
          <CardDescription>
            {teams.length} {teams.length === 1 ? "team" : "teams"} in this workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Identifier</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="size-3 shrink-0 rounded-sm"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="font-medium text-foreground">{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {team.identifier}
                  </TableCell>
                  <TableCell>{team.memberCount}</TableCell>
                  <TableCell>{team.issueCount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="size-7">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(team)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(team)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create team</DialogTitle>
            <DialogDescription>
              Add a new team to organize issues and cycles.
            </DialogDescription>
          </DialogHeader>
          <TeamForm
            form={form}
            onChange={setForm}
            onSubmit={handleCreateSubmit}
            submitLabel={createTeam.isPending ? "Creating..." : "Create team"}
            disabled={createTeam.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={editTarget !== null}
        onOpenChange={(open) => { if (!open) setEditTarget(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit team</DialogTitle>
            <DialogDescription>
              Update team details.
            </DialogDescription>
          </DialogHeader>
          <TeamForm
            form={form}
            onChange={setForm}
            onSubmit={handleEditSubmit}
            submitLabel={updateTeam.isPending ? "Saving..." : "Save changes"}
            disabled={updateTeam.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{deleteTarget?.name}&rdquo; and all
              its {deleteTarget?.issueCount ?? 0} issues, cycles, and saved views. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
            >
              {deleteTeam.isPending ? "Deleting..." : "Delete team"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function TeamForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  disabled,
}: {
  form: TeamFormState
  onChange: (form: TeamFormState) => void
  onSubmit: () => void
  submitLabel: string
  disabled: boolean
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="team-name">Name</Label>
        <Input
          id="team-name"
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          placeholder="e.g. Engineering"
          className="rounded-lg"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="team-identifier">Identifier</Label>
        <Input
          id="team-identifier"
          value={form.identifier}
          onChange={(e) =>
            onChange({
              ...form,
              identifier: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5),
            })
          }
          placeholder="e.g. ENG"
          className="max-w-24 rounded-lg font-mono"
          maxLength={5}
        />
        <p className="text-xs text-muted-foreground">
          Used as the prefix for issue IDs (e.g. ENG-42).
        </p>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {TEAM_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange({ ...form, color })}
              className="size-7 rounded-md border-2 transition-colors"
              style={{
                backgroundColor: color,
                borderColor: form.color === color ? "var(--color-foreground)" : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={disabled || !form.name.trim() || !form.identifier.trim()}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}
