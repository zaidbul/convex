import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreateCycleMutation } from "@/query/mutations/tickets"
import { cyclesQueryOptions } from "@/query/options/tickets"
import type { Cycle } from "./types"

function formatDateInput(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function getDefaultCycleValues(nextNumber: number) {
  const today = new Date()
  return {
    name: `Cycle ${nextNumber}`,
    startDate: formatDateInput(today),
    endDate: formatDateInput(addDays(today, 6)),
  }
}

interface CreateCycleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string
  teamSlug: string
  teamName?: string
  onSuccess?: (cycle: Cycle) => void
}

export function CreateCycleDialog({
  open,
  onOpenChange,
  teamId,
  teamSlug,
  teamName,
  onSuccess,
}: CreateCycleDialogProps) {
  const { data: cycles = [] } = useQuery(cyclesQueryOptions(teamSlug))
  const createCycle = useCreateCycleMutation(teamSlug)
  const nextCycleNumber = useMemo(
    () => cycles.reduce((max, cycle) => Math.max(max, cycle.number), 0) + 1,
    [cycles]
  )
  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  function resetForm() {
    const defaults = getDefaultCycleValues(nextCycleNumber)
    setName(defaults.name)
    setStartDate(defaults.startDate)
    setEndDate(defaults.endDate)
  }

  useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open, nextCycleNumber])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim() || !startDate || !endDate) {
      return
    }

    try {
      const cycle = await createCycle.mutateAsync({
        teamId,
        name: name.trim(),
        startDate,
        endDate,
      })
      toast.success(`${cycle.name} created`)
      onOpenChange(false)
      onSuccess?.(cycle)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create cycle"
      )
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetForm()
        }
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Cycle</DialogTitle>
          <DialogDescription>
            Create the next upcoming cycle{teamName ? ` for ${teamName}` : ""}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Cycle name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-muted-foreground">Start date</span>
              <Input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-muted-foreground">End date</span>
              <Input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </label>
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
              disabled={
                !name.trim() || !startDate || !endDate || createCycle.isPending
              }
            >
              {createCycle.isPending ? "Creating..." : "Create Cycle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
