import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  archiveIssue,
  createSavedView,
  createIssue,
  createIssueComment,
  deleteSavedView,
  deleteIssue,
  updateCycleStatus,
  toggleIssueFavorite,
  updateIssueAssignee,
  updateIssueCycle,
  updateIssueDueDate,
  updateIssueDescription,
  updateIssueLabels,
  updateIssuePriority,
  updateIssueStatus,
  updateIssueTitle,
  updateSavedView,
} from "@/server/functions/tickets"
import type { IssueQueryFilters } from "@/components/tickets/types"
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
      dueDate?: string | null
    }) => createIssue({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"], refetchType: "active" })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      queryClient.invalidateQueries({ queryKey: ["my-issues"] })
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
      queryClient.invalidateQueries({ queryKey: ["issues"], refetchType: "active" })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["issue-activity", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
    },
  })
}

export function useUpdateIssuePriorityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; priority: string }) =>
      updateIssuePriority({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"], refetchType: "active" })
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
      queryClient.invalidateQueries({ queryKey: ["issues"], refetchType: "active" })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["issue-activity", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["my-issues"] })
    },
  })
}

export function useUpdateIssueCycleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; cycleId: string | null }) =>
      updateIssueCycle({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"], refetchType: "active" })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["issue-activity", variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useUpdateIssueDueDateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; dueDate: string | null }) =>
      updateIssueDueDate({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"], refetchType: "active" })
      queryClient.invalidateQueries({ queryKey: ["issue", variables.issueId] })
    },
  })
}

export function useUpdateIssueLabelsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string; labelIds: string[] }) =>
      updateIssueLabels({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"], refetchType: "active" })
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
      queryClient.invalidateQueries({ queryKey: ["issues"], refetchType: "active" })
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
      queryClient.invalidateQueries({ queryKey: ["active-cycles"] })
    },
  })
}

export function useArchiveIssueMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { issueId: string }) =>
      archiveIssue({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues"], refetchType: "active" })
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
      queryClient.invalidateQueries({ queryKey: ["issues"], refetchType: "active" })
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

export function useCreateSavedViewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: {
      teamId: string
      name: string
      presetFilter?: string
      advancedFilters?: IssueQueryFilters["advancedFilters"]
    }) => createSavedView({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["saved-views"] })
      queryClient.invalidateQueries({ queryKey: ["saved-view", data.id] })
    },
  })
}

export function useUpdateSavedViewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: {
      viewId: string
      name?: string
      presetFilter?: string | null
      advancedFilters?: IssueQueryFilters["advancedFilters"] | null
    }) => updateSavedView({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["saved-views"] })
      queryClient.invalidateQueries({ queryKey: ["saved-view", data.id] })
    },
  })
}

export function useDeleteSavedViewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { viewId: string }) => deleteSavedView({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["saved-views"] })
      queryClient.removeQueries({ queryKey: ["saved-view", variables.viewId] })
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
