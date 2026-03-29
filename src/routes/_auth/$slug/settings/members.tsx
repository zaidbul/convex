import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { MoreHorizontal, Shield, UserMinus } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { workspaceMembershipRoles } from "@/db/schema"
import {
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "@/query/mutations/settings"
import { workspaceMembersQueryOptions } from "@/query/options/settings"
import type { WorkspaceMember } from "@/server/functions/settings-data"

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  guest: "Guest",
}

export const Route = createFileRoute("/_auth/$slug/settings/members")({
  component: MembersSettingsPage,
})

function MembersSettingsPage() {
  const { data: members } = useSuspenseQuery(workspaceMembersQueryOptions())
  const updateRole = useUpdateMemberRoleMutation()
  const removeMember = useRemoveMemberMutation()

  const [removeTarget, setRemoveTarget] = useState<WorkspaceMember | null>(null)

  // Current user is the viewer — we'll check by finding the owner or just disable self-actions
  // The server enforces role guards, so we primarily disable UI affordances

  const handleRoleChange = async (
    userId: string,
    role: (typeof workspaceMembershipRoles)[number]
  ) => {
    try {
      await updateRole.mutateAsync({ userId, role })
      toast.success("Role updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role")
    }
  }

  const handleRemove = async () => {
    if (!removeTarget) return
    try {
      await removeMember.mutateAsync({ userId: removeTarget.userId })
      toast.success(`${removeTarget.name} removed from workspace`)
      setRemoveTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove member")
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Members</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage who has access to this workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace members</CardTitle>
          <CardDescription>
            {members.length} {members.length === 1 ? "member" : "members"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={member.avatarUrl ?? undefined} />
                        <AvatarFallback className="text-[10px]">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                          {member.name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full text-[10px]">
                      {roleLabels[member.role] ?? member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.role !== "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="size-7">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          {(["admin", "member", "guest"] as const).map((role) =>
                            role !== member.role ? (
                              <DropdownMenuItem
                                key={role}
                                onClick={() => handleRoleChange(member.userId, role)}
                              >
                                <Shield className="size-4" />
                                Make {roleLabels[role]}
                              </DropdownMenuItem>
                            ) : null
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setRemoveTarget(member)}
                            className="text-destructive focus:text-destructive"
                          >
                            <UserMinus className="size-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={removeTarget !== null}
        onOpenChange={(open) => { if (!open) setRemoveTarget(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget?.name} will lose access to this workspace and be removed
              from all teams. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleRemove}>
              {removeMember.isPending ? "Removing..." : "Remove member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
