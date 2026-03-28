import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote, updateNote, deleteNote } from "@/server/functions/notes"

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { title: string; content?: string }) =>
      createNote({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })
}

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { noteId: string; title?: string; content?: string }) =>
      updateNote({ data: input }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      queryClient.invalidateQueries({ queryKey: ["note", variables.noteId] })
    },
  })
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { noteId: string }) =>
      deleteNote({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })
}
