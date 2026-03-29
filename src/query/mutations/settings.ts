import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createTeam,
  deleteTeam,
  removeMember,
  updateMemberRole,
  updateTeam,
  updateWorkspaceName,
} from "@/server/functions/settings"
import type { workspaceMembershipRoles } from "@/db/schema"

export function useUpdateWorkspaceNameMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { name: string }) => updateWorkspaceName({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace"] })
    },
  })
}

export function useCreateTeamMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { name: string; identifier: string; color: string }) =>
      createTeam({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      queryClient.invalidateQueries({ queryKey: ["teams-with-stats"] })
    },
  })
}

export function useUpdateTeamMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: {
      teamId: string
      name: string
      identifier: string
      color: string
    }) => updateTeam({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      queryClient.invalidateQueries({ queryKey: ["teams-with-stats"] })
    },
  })
}

export function useDeleteTeamMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { teamId: string }) => deleteTeam({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      queryClient.invalidateQueries({ queryKey: ["teams-with-stats"] })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })
}

export function useUpdateMemberRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: {
      userId: string
      role: (typeof workspaceMembershipRoles)[number]
    }) => updateMemberRole({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members"] })
    },
  })
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { userId: string }) => removeMember({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members"] })
    },
  })
}
