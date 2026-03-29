import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  archiveIssue,
  createIssue,
  createIssueComment,
  deleteIssue,
  updateCycleStatus,
  toggleIssueFavorite,
  updateIssueAssignee,
  updateIssueCycle,
  updateIssueDescription,
  updateIssueLabels,
  updateIssuePriority,
  updateIssueStatus,
  updateIssueTitle,
} from "@/server/functions/tickets"
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/server/functions/notifications"

export function useCreateIssueMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: {
      teamId: string
      title: string
      description?: string
      status?: string
      priority?: string
    }) => createIssue({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useUpdateIssueDescriptionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; description: string }) =>
      updateIssueDescription({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useUpdateIssueStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; status: string }) =>
      updateIssueStatus({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["issue-activity", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useUpdateIssuePriorityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; priority: string }) =>
      updateIssuePriority({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["issue-activity", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useUpdateIssueAssigneeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; assigneeUserId: string | null }) =>
      updateIssueAssignee({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["issue-activity", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useUpdateIssueCycleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; cycleId: string | null }) =>
      updateIssueCycle({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useUpdateIssueLabelsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; labelIds: string[] }) =>
      updateIssueLabels({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["issue-activity", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useUpdateIssueTitleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; title: string }) =>
      updateIssueTitle({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
    },
  })
}

export function useCreateIssueCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; body: string }) =>
      createIssueComment({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issue-comments", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["issue-activity", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useUpdateCycleStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { cycleId: string; status: string }) =>
      updateCycleStatus({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useArchiveIssueMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string }) =>
      archiveIssue({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useDeleteIssueMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string }) =>
      deleteIssue({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useToggleIssueFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string }) =>
      toggleIssueFavorite({ data: input }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["issue-favorite", variables.issueId] })
      const previous = queryClient.getQueryData<{ favorited: boolean }>(["issue-favorite", variables.issueId])
      queryClient.setQueryData(["issue-favorite", variables.issueId], (old: { favorited: boolean } | undefined) => ({
        favorited: !(old?.favorited ?? false),
      }))
      return { previous }
    },
    onError: (_error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["issue-favorite", variables.issueId], context.previous)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issue-favorite", variables.issueId] })
    },
  })
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { notificationId: string }) =>
      markNotificationAsRead({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
