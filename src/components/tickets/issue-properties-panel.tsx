import { useQuery } from "@tanstack/react-query"
import { Check, ChevronDown, Circle, Plus, User as UserIcon } from "lucide-react"
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
    <div className="flex items-center justify-between py-1.5 px-3 text-sm hover:bg-accent/50 rounded-md -mx-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between px-2 pt-4 pb-1">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <ChevronDown className="size-3 text-muted-foreground" />
    </div>
  )
}

function StatusDropdown({ issue }: { issue: IssueDetail }) {
  const updateStatus = useUpdateIssueStatusMutation()
  const current = statusConfig[issue.status]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm hover:text-foreground transition-colors">
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
              {issue.status === status && (
                <Check className="size-3 ml-auto" />
              )}
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
          "flex items-center gap-1.5 text-sm hover:text-foreground transition-colors",
          issue.priority === "none" ? "text-muted-foreground" : current.color,
        )}
      >
        <span>{issue.priority === "none" ? "Set priority" : current.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {issuePriorities.map((priority) => {
          const config = priorityConfig[priority]
          return (
            <DropdownMenuItem
              key={priority}
              onClick={() => updatePriority.mutate({ issueId: issue.id, priority })}
              className={cn("gap-2", config.color)}
            >
              <span>{config.label}</span>
              {issue.priority === priority && (
                <Check className="size-3 ml-auto" />
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
      <PopoverTrigger className="flex items-center gap-1.5 text-sm hover:text-foreground transition-colors">
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
                  updateAssignee.mutate({ issueId: issue.id, assigneeUserId: null })
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
                    updateAssignee.mutate({ issueId: issue.id, assigneeUserId: member.id })
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
                    <Check className="size-3 ml-auto" />
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

function CycleDropdown({ issue, teamSlug }: { issue: IssueDetail; teamSlug: string }) {
  const updateCycle = useUpdateIssueCycleMutation()
  const { data: cycles = [] } = useQuery(cyclesQueryOptions(teamSlug))
  const currentCycle = cycles.find((c) => c.id === issue.cycleId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm hover:text-foreground transition-colors">
        {currentCycle ? (
          <>
            <Circle className="size-3 text-primary" />
            <span>{currentCycle.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">No cycle</span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onClick={() => updateCycle.mutate({ issueId: issue.id, cycleId: null })}
          className="gap-2"
        >
          <span className="text-muted-foreground">No cycle</span>
          {!issue.cycleId && <Check className="size-3 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {cycles.map((cycle) => (
          <DropdownMenuItem
            key={cycle.id}
            onClick={() => updateCycle.mutate({ issueId: issue.id, cycleId: cycle.id })}
            className="gap-2"
          >
            <Circle className="size-3 text-primary" />
            <span>{cycle.name}</span>
            {issue.cycleId === cycle.id && (
              <Check className="size-3 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DueDateField({ issue }: { issue: IssueDetail }) {
  const updateDueDate = useUpdateIssueDueDateMutation()

  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={issue.dueDate ?? ""}
        onChange={(event) =>
          updateDueDate.mutate({
            issueId: issue.id,
            dueDate: event.target.value || null,
          })
        }
        className="h-8 w-[148px]"
      />
      {issue.dueDate ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            updateDueDate.mutate({
              issueId: issue.id,
              dueDate: null,
            })
          }
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
                "rounded-full border-0 px-2 py-0 text-[10px] font-medium h-5",
                labelColorMap[label.color] ?? "bg-muted text-muted-foreground",
              )}
            >
              {label.name}
            </Badge>
          ))}
        </div>
      )}
      <Popover>
        <PopoverTrigger className="flex items-center gap-1.5 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
                        labelColorMap[label.color] ?? "bg-muted",
                      )}
                    />
                    <span>{label.name}</span>
                    {currentLabelIds.has(label.id) && (
                      <Check className="size-3 ml-auto" />
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
      <div className="space-y-0.5 mt-1">
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
          className="flex items-center gap-1.5 px-2 py-1 text-sm text-muted-foreground transition-colors opacity-50 cursor-not-allowed"
        >
          <Plus className="size-3" />
          <span>Add to project</span>
        </button>
      </div>

      <SectionHeader label="Relations" />
      <div className="mt-1 px-2 text-xs text-muted-foreground py-1">
        No relations
      </div>
    </div>
  )
}
