import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery, useQuery } from "@tanstack/react-query"
import { useState, useCallback, useRef } from "react"
import { Plus, FileText, Trash2 } from "lucide-react"
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { IssueEditor } from "@/components/editor/IssueEditor"
import { notesListQueryOptions, noteDetailQueryOptions } from "@/query/options/notes"
import { useCreateNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } from "@/query/mutations/notes"
import {
  teamsQueryOptions,
  workspaceQueryOptions,
} from "@/query/options/tickets"
import { TicketSidebar } from "@/components/tickets/ticket-sidebar"

export const Route = createFileRoute("/_auth/$slug/notes")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(workspaceQueryOptions()),
      context.queryClient.ensureQueryData(teamsQueryOptions()),
      context.queryClient.ensureQueryData(notesListQueryOptions()),
    ])
  },
  component: NotesPage,
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function NotesPage() {
  const { data: notes } = useSuspenseQuery(notesListQueryOptions())
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [noteTitle, setNoteTitle] = useState("")

  const createNote = useCreateNoteMutation()
  const updateNote = useUpdateNoteMutation()
  const deleteNote = useDeleteNoteMutation()

  const { data: selectedNote } = useQuery(
    noteDetailQueryOptions(selectedNoteId ?? ""),
  )

  const handleCreateNote = async () => {
    const result = await createNote.mutateAsync({
      title: "Untitled",
      content: "",
    })
    setSelectedNoteId(result.id)
    setNoteTitle("Untitled")
  }

  const handleSelectNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    setSelectedNoteId(noteId)
    setNoteTitle(note?.title ?? "")
  }

  const titleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTitleChange = useCallback((title: string) => {
    setNoteTitle(title)
    if (selectedNoteId) {
      if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current)
      titleDebounceRef.current = setTimeout(() => {
        updateNote.mutate({ noteId: selectedNoteId, title })
      }, 400)
    }
  }, [selectedNoteId, updateNote])

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote.mutateAsync({ noteId })
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null)
      setNoteTitle("")
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "330px",
        } as React.CSSProperties
      }
    >
      <Sidebar side="left" collapsible="offcanvas">
        <TicketSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-screen bg-surface-low">
          {/* Notes List Sidebar */}
          <div className="w-72 border-r border-outline-variant/10 bg-surface flex flex-col">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Notes</h2>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={handleCreateNote}
                disabled={createNote.isPending}
              >
                <Plus className="size-4" strokeWidth={1.5} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
              {notes.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FileText className="mx-auto size-8 text-muted-foreground/40" strokeWidth={1} />
                  <p className="mt-2 text-sm text-muted-foreground">No notes yet</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={handleCreateNote}
                  >
                    Create your first note
                  </Button>
                </div>
              ) : (
                notes.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => handleSelectNote(note.id)}
                    className={`group flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                      selectedNoteId === note.id
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {note.title || "Untitled"}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(note.updatedAt)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNote(note.id)
                      }}
                      className="ml-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-y-auto">
            {selectedNoteId ? (
              <div className="mx-auto max-w-3xl px-8 py-8">
                <IssueEditor
                  issueId={selectedNoteId}
                  title={noteTitle}
                  onTitleChange={handleTitleChange}
                  initialMarkdown={selectedNote?.content}
                  autoSave={true}
                  saveMode="note"
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FileText className="mx-auto size-12 text-muted-foreground/30" strokeWidth={1} />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Select a note or create a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
