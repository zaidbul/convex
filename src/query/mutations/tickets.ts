import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createIssue } from "@/server/functions/tickets"

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
