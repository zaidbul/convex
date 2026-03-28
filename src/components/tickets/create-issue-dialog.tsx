import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateIssueMutation } from "@/query/mutations/tickets"
import type { IssueStatus, IssuePriority, Team } from "./types"

const statusOptions: { value: IssueStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "in-review", label: "In Review" },
]

const priorityOptions: { value: IssuePriority; label: string }[] = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

interface CreateIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teams: Team[]
  defaultTeamId?: string
}

export function CreateIssueDialog({
  open,
  onOpenChange,
  teams,
  defaultTeamId,
}: CreateIssueDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<IssueStatus>("backlog")
  const [priority, setPriority] = useState<IssuePriority>("none")
  const [teamId, setTeamId] = useState(defaultTeamId ?? teams[0]?.id ?? "")

  const createIssue = useCreateIssueMutation()

  function resetForm() {
    setTitle("")
    setDescription("")
    setStatus("backlog")
    setPriority("none")
    setTeamId(defaultTeamId ?? teams[0]?.id ?? "")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !teamId) return

    try {
      const result = await createIssue.mutateAsync({
        teamId,
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
      })
      toast.success(`Issue ${result.identifier} created`)
      resetForm()
      onOpenChange(false)
    } catch {
      toast.error("Failed to create issue")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm()
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Issue</DialogTitle>
          <DialogDescription>
            Create a new issue for your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <Textarea
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="resize-none"
          />

          <div className="flex flex-wrap items-center gap-3">
            {/* Team selector */}
            {teams.length > 1 && (
              <Select value={teamId} onValueChange={(val) => val && setTeamId(val)}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Status selector */}
            <Select value={status} onValueChange={(val) => val && setStatus(val as IssueStatus)}>
              <SelectTrigger size="sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority selector */}
            <Select value={priority} onValueChange={(val) => val && setPriority(val as IssuePriority)}>
              <SelectTrigger size="sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !teamId || createIssue.isPending}
            >
              {createIssue.isPending ? "Creating..." : "Create Issue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
