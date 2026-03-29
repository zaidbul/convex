import { useState } from "react"
import { Archive, Copy, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
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
import {
  useArchiveIssueMutation,
  useDeleteIssueMutation,
} from "@/query/mutations/tickets"

interface IssueActionsProps {
  issueId: string
  issueIdentifier: string
  issueUrl: string
  onActionComplete?: () => void
}

function useIssueActions({ issueId, issueUrl, onActionComplete }: Omit<IssueActionsProps, "issueIdentifier">) {
  const archiveMutation = useArchiveIssueMutation()
  const deleteMutation = useDeleteIssueMutation()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(issueUrl)
      toast.success("Link copied to clipboard")
    } catch {
      toast.error("Failed to copy link")
    }
  }

  async function handleArchive() {
    try {
      await archiveMutation.mutateAsync({ issueId })
      toast.success("Issue archived")
      onActionComplete?.()
    } catch {
      toast.error("Failed to archive issue")
    }
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync({ issueId })
      toast.success("Issue deleted")
      onActionComplete?.()
    } catch {
      toast.error("Failed to delete issue")
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  return {
    handleCopyLink,
    handleArchive,
    handleDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isDeleting: deleteMutation.isPending,
  }
}

function DeleteConfirmDialog({
  issueIdentifier,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  issueIdentifier: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete issue?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {issueIdentifier}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function IssueActionsDropdown({
  issueId,
  issueIdentifier,
  issueUrl,
  onActionComplete,
  trigger,
  align = "end",
  side = "bottom",
}: IssueActionsProps & {
  trigger: React.ReactElement
  align?: "start" | "end"
  side?: "bottom" | "top"
}) {
  const actions = useIssueActions({ issueId, issueUrl, onActionComplete })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={trigger}>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} side={side} sideOffset={4}>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={actions.handleCopyLink}>
              <Copy className="size-4" />
              <span>Copy link</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={actions.handleArchive}>
              <Archive className="size-4" />
              <span>Archive</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              // Delay so the dropdown fully closes before the dialog opens,
              // preventing click-outside from immediately dismissing the dialog
              requestAnimationFrame(() => actions.setDeleteDialogOpen(true))
            }}
          >
            <Trash2 className="size-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmDialog
        issueIdentifier={issueIdentifier}
        open={actions.deleteDialogOpen}
        onOpenChange={actions.setDeleteDialogOpen}
        onConfirm={actions.handleDelete}
        isPending={actions.isDeleting}
      />
    </>
  )
}

export function IssueActionsContextMenu({
  issueId,
  issueIdentifier,
  issueUrl,
  onActionComplete,
  children,
}: IssueActionsProps & {
  children: React.ReactNode
}) {
  const actions = useIssueActions({ issueId, issueUrl, onActionComplete })

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem onClick={actions.handleCopyLink}>
              <Copy className="size-4" />
              <span>Copy link</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={actions.handleArchive}>
              <Archive className="size-4" />
              <span>Archive</span>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onClick={() => {
              requestAnimationFrame(() => actions.setDeleteDialogOpen(true))
            }}
          >
            <Trash2 className="size-4" />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DeleteConfirmDialog
        issueIdentifier={issueIdentifier}
        open={actions.deleteDialogOpen}
        onOpenChange={actions.setDeleteDialogOpen}
        onConfirm={actions.handleDelete}
        isPending={actions.isDeleting}
      />
    </>
  )
}
