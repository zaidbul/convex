import { useState, type ReactElement } from "react"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, Circle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useUpdateIssueCycleMutation } from "@/query/mutations/tickets"
import { issuesQueryOptions } from "@/query/options/tickets"
import { getAssignableCycleIssues } from "./cycle-utils"
import type { Cycle } from "./types"

export function CycleIssuePicker({
  cycle,
  teamSlug,
  trigger,
  align = "end",
}: {
  cycle: Cycle
  teamSlug: string
  trigger?: ReactElement
  align?: "start" | "center" | "end"
}) {
  const [open, setOpen] = useState(false)
  const updateCycle = useUpdateIssueCycleMutation()
  const { data: teamIssues = [] } = useQuery(issuesQueryOptions(teamSlug))
  const assignableIssues = getAssignableCycleIssues(teamIssues, cycle.id)

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 shrink-0"
      aria-label={`Add issue to ${cycle.name}`}
    >
      <Plus className="size-3.5" strokeWidth={1.5} />
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger ?? defaultTrigger} />
      <PopoverContent align={align} className="w-80 p-0">
        <PopoverHeader className="border-b border-outline-variant/10 px-4 py-3">
          <PopoverTitle className="text-sm">Add issue to {cycle.name}</PopoverTitle>
          <PopoverDescription className="text-xs">
            Select any team issue not already assigned to this cycle.
          </PopoverDescription>
        </PopoverHeader>

        <Command>
          <CommandInput placeholder="Search issues..." className="h-9" />
          <CommandList>
            <CommandEmpty>No matching issues found.</CommandEmpty>
            <CommandGroup>
              {assignableIssues.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Every visible team issue is already in this cycle.
                </div>
              ) : (
                assignableIssues.map((issue) => (
                  <CommandItem
                    key={issue.id}
                    value={`${issue.identifier} ${issue.title}`}
                    disabled={updateCycle.isPending}
                    onSelect={() => {
                      updateCycle.mutate(
                        { issueId: issue.id, cycleId: cycle.id },
                        {
                          onSuccess: () => setOpen(false),
                        }
                      )
                    }}
                    className="items-start gap-3 py-3"
                  >
                    <Circle className="mt-0.5 size-3 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        {issue.identifier}
                      </div>
                      <div className="truncate text-sm">{issue.title}</div>
                    </div>
                    {issue.cycleId && issue.cycleId !== cycle.id ? (
                      <CheckCircle2 className="mt-0.5 size-3 text-muted-foreground" />
                    ) : null}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
