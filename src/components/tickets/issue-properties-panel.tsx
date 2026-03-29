import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Check,
  Circle,
  Plus,
  User as UserIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { issueStatuses, issuePriorities } from "@/db/schema"
import {
  teamMembersQueryOptions,
  labelsQueryOptions,
  cyclesQueryOptions,
} from "@/query/options/tickets"
import {
  useUpdateIssueStatusMutation,
  useUpdateIssuePriorityMutation,
  useUpdateIssueAssigneeMutation,
  useUpdateIssueCycleMutation,
  useUpdateIssueDueDateMutation,
  useUpdateIssueLabelsMutation,
} from "@/query/mutations/tickets"
import { CreateCycleDialog } from "./create-cycle-dialog"
import { statusConfig, priorityConfig, labelColorMap } from "./constants"
import type { IssueDetail } from "./types"

function PropertyRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="-mx-1 flex items-center justify-between rounded-md px-3 py-1.5 text-sm hover:bg-accent/50">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between px-2 pt-4 pb-1">
      <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  )
}

function StatusDropdown({ issue }: { issue: IssueDetail }) {
  const updateStatus = useUpdateIssueStatusMutation()
  const current = statusConfig[issue.status]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm transition-colors hover:text-foreground">
        <span className={cn("size-2 rounded-full", current.color)} />
        <span>{current.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {issueStatuses.map((status) => {
          const config = statusConfig[status]
          return (
            <DropdownMenuItem
              key={status}
              onClick={() => updateStatus.mutate({ issueId: issue.id, status })}
              className="gap-2"
            >
              <span className={cn("size-2 rounded-full", config.color)} />
              <span>{config.label}</span>
              {issue.status === status && <Check className="ml-auto size-3" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PriorityDropdown({ issue }: { issue: IssueDetail }) {
  const updatePriority = useUpdateIssuePriorityMutation()
  const current = priorityConfig[issue.priority]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-1.5 text-sm transition-colors hover:text-foreground",
          issue.priority === "none" ? "text-muted-foreground" : current.color
        )}
      >
        <span>
          {issue.priority === "none" ? "Set priority" : current.label}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {issuePriorities.map((priority) => {
          const config = priorityConfig[priority]
          return (
            <DropdownMenuItem
              key={priority}
              onClick={() =>
                updatePriority.mutate({ issueId: issue.id, priority })
              }
              className={cn("gap-2", config.color)}
            >
              <span>{config.label}</span>
              {issue.priority === priority && (
                <Check className="ml-auto size-3" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AssigneeDropdown({ issue }: { issue: IssueDetail }) {
  const updateAssignee = useUpdateIssueAssigneeMutation()
  const { data: members = [] } = useQuery(teamMembersQueryOptions(issue.teamId))
  const assignee = issue.assignees[0]

  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-1.5 text-sm transition-colors hover:text-foreground">
        {assignee ? (
          <>
            <Avatar className="size-4">
              <AvatarImage src={assignee.avatarUrl} />
              <AvatarFallback className="text-[7px]">
                {assignee.initials}
              </AvatarFallback>
            </Avatar>
            <span>{assignee.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Unassigned</span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0">
        <Command>
          <CommandInput placeholder="Search members..." className="h-8" />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() =>
                  updateAssignee.mutate({
                    issueId: issue.id,
                    assigneeUserId: null,
                  })
                }
                className="gap-2"
              >
                <UserIcon className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Unassigned</span>
              </CommandItem>
              {members.map((member) => (
                <CommandItem
                  key={member.id}
                  onSelect={() =>
                    updateAssignee.mutate({
                      issueId: issue.id,
                      assigneeUserId: member.id,
                    })
                  }
                  className="gap-2"
                >
                  <Avatar className="size-4">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback className="text-[7px]">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.name}</span>
                  {assignee?.id === member.id && (
                    <Check className="ml-auto size-3" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function CycleDropdown({
  issue,
  teamSlug,
}: {
  issue: IssueDetail
  teamSlug: string
}) {
  const [createCycleOpen, setCreateCycleOpen] = useState(false)
  const updateCycle = useUpdateIssueCycleMutation()
  const { data: cycles = [] } = useQuery(cyclesQueryOptions(teamSlug))
  const currentCycle = cycles.find((c) => c.id === issue.cycleId)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm transition-colors hover:text-foreground">
          {currentCycle ? (
            <>
              <Circle className="size-3 text-primary" />
              <span>{currentCycle.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">No cycle</span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem
            onClick={() =>
              updateCycle.mutate({ issueId: issue.id, cycleId: null })
            }
            className="gap-2"
          >
            <span className="text-muted-foreground">No cycle</span>
            {!issue.cycleId && <Check className="ml-auto size-3" />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {cycles.length === 0 ? (
            <DropdownMenuItem
              onClick={() => setCreateCycleOpen(true)}
              className="gap-2"
            >
              <Plus className="size-3.5 text-muted-foreground" />
              <span>Create cycle</span>
            </DropdownMenuItem>
          ) : (
            cycles.map((cycle) => (
              <DropdownMenuItem
                key={cycle.id}
                onClick={() =>
                  updateCycle.mutate({ issueId: issue.id, cycleId: cycle.id })
                }
                className="gap-2"
              >
                <Circle className="size-3 text-primary" />
                <span>{cycle.name}</span>
                {issue.cycleId === cycle.id && (
                  <Check className="ml-auto size-3" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateCycleDialog
        open={createCycleOpen}
        onOpenChange={setCreateCycleOpen}
        teamId={issue.teamId}
        teamSlug={teamSlug}
      />
    </>
  )
}

function DueDateField({ issue }: { issue: IssueDetail }) {
  const updateDueDate = useUpdateIssueDueDateMutation()
  const [localDate, setLocalDate] = useState(issue.dueDate ?? "")

  useEffect(() => {
    setLocalDate(issue.dueDate ?? "")
  }, [issue.dueDate])

  const commitDate = () => {
    const next = localDate || null
    if (next !== (issue.dueDate ?? null)) {
      updateDueDate.mutate({ issueId: issue.id, dueDate: next })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={localDate}
        onChange={(event) => setLocalDate(event.target.value)}
        onBlur={commitDate}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            commitDate()
          }
        }}
        className="h-8 w-[148px]"
      />
      {issue.dueDate ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setLocalDate("")
            updateDueDate.mutate({
              issueId: issue.id,
              dueDate: null,
            })
          }}
        >
          Clear
        </Button>
      ) : null}
    </div>
  )
}

function LabelsSection({ issue }: { issue: IssueDetail }) {
  const updateLabels = useUpdateIssueLabelsMutation()
  const { data: allLabels = [] } = useQuery(labelsQueryOptions())
  const currentLabelIds = new Set(issue.labels.map((l) => l.id))

  const handleToggle = (labelId: string) => {
    const next = currentLabelIds.has(labelId)
      ? issue.labels.filter((l) => l.id !== labelId).map((l) => l.id)
      : [...issue.labels.map((l) => l.id), labelId]
    updateLabels.mutate({ issueId: issue.id, labelIds: next })
  }

  return (
    <div>
      {issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 px-2 pb-1">
          {issue.labels.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className={cn(
                "h-5 rounded-full border-0 px-2 py-0 text-[10px] font-medium",
                labelColorMap[label.color] ?? "bg-muted text-muted-foreground"
              )}
            >
              {label.name}
            </Badge>
          ))}
        </div>
      )}
      <Popover>
        <PopoverTrigger className="flex items-center gap-1.5 px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <Plus className="size-3" />
          <span>Add label</span>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-52 p-0">
          <Command>
            <CommandInput placeholder="Search labels..." className="h-8" />
            <CommandList>
              <CommandEmpty>No labels found.</CommandEmpty>
              <CommandGroup>
                {allLabels.map((label) => (
                  <CommandItem
                    key={label.id}
                    onSelect={() => handleToggle(label.id)}
                    className="gap-2"
                  >
                    <div
                      className={cn(
                        "size-3 rounded-full",
                        labelColorMap[label.color] ?? "bg-muted"
                      )}
                    />
                    <span>{label.name}</span>
                    {currentLabelIds.has(label.id) && (
                      <Check className="ml-auto size-3" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function IssuePropertiesPanel({
  issue,
  teamSlug,
}: {
  issue: IssueDetail
  teamSlug: string
}) {
  return (
    <div className="p-3">
      <SectionHeader label="Properties" />
      <div className="mt-1 space-y-0.5">
        <PropertyRow label="Status">
          <StatusDropdown issue={issue} />
        </PropertyRow>
        <PropertyRow label="Priority">
          <PriorityDropdown issue={issue} />
        </PropertyRow>
        <PropertyRow label="Assignee">
          <AssigneeDropdown issue={issue} />
        </PropertyRow>
        <PropertyRow label="Cycle">
          <CycleDropdown issue={issue} teamSlug={teamSlug} />
        </PropertyRow>
        <PropertyRow label="Due date">
          <DueDateField issue={issue} />
        </PropertyRow>
      </div>

      <SectionHeader label="Labels" />
      <div className="mt-1">
        <LabelsSection issue={issue} />
      </div>

      <SectionHeader label="Project" />
      <div className="mt-1">
        <button
          type="button"
          disabled
          className="flex cursor-not-allowed items-center gap-1.5 px-2 py-1 text-sm text-muted-foreground opacity-50 transition-colors"
        >
          <Plus className="size-3" />
          <span>Add to project</span>
        </button>
      </div>

      <SectionHeader label="Relations" />
      <div className="mt-1 px-2 py-1 text-xs text-muted-foreground">
        No relations
      </div>
    </div>
  )
}
