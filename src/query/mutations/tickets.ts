import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createIssue,
  createIssueComment,
  updateIssueAssignee,
  updateIssueCycle,
  updateIssueDescription,
  updateIssueLabels,
  updateIssuePriority,
  updateIssueStatus,
  updateIssueTitle,
} from "@/server/functions/tickets"

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
    },
  })
}
