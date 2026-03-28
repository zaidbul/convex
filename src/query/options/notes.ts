import { queryOptions } from "@tanstack/react-query"
import { listNotes, getNoteById } from "@/server/functions/notes"

export const notesListQueryOptions = () =>
  queryOptions({
    queryKey: ["notes"],
    queryFn: () => listNotes(),
  })

export const noteDetailQueryOptions = (noteId: string) =>
  queryOptions({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById({ data: { noteId } }),
    enabled: !!noteId,
  })
