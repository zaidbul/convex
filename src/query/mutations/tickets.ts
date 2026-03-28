import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createIssue, updateIssueDescription } from "@/server/functions/tickets"

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
