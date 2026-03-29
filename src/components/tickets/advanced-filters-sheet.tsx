import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { issuePriorities, issueStatuses } from "@/db/schema"
import { cn } from "@/lib/utils"
import {
  cyclesQueryOptions,
  labelsQueryOptions,
  teamMembersQueryOptions,
} from "@/query/options/tickets"
import { emptyAdvancedFilters, hasAdvancedFilters } from "./filter-state"
import { priorityConfig, statusConfig } from "./constants"
import type {
  IssueAdvancedFilters,
  IssueFilter,
  IssuePriority,
  IssueStatus,
} from "./types"

type FilterOption = {
  value: string
  label: string
}

function FilterSelector({
  label,
  placeholder,
  options,
  values,
  onChange,
}: {
  label: string
  placeholder: string
  options: FilterOption[]
  values: string[]
  onChange: (values: string[]) => void
}) {
  const selectedLabel = useMemo(() => {
    if (values.length === 0) {
      return placeholder
    }

    if (values.length === 1) {
      return options.find((option) => option.value === values[0])?.label ?? placeholder
    }

    return `${values.length} selected`
  }, [options, placeholder, values])

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
            />
          }
        >
          <span className={cn(values.length === 0 && "text-muted-foreground")}>
            {selectedLabel}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[320px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No matches.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = values.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        onChange(
                          isSelected
                            ? values.filter((value) => value !== option.value)
                            : [...values, option.value],
                        )
                      }}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="ml-auto size-3.5" />}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function AdvancedFiltersSheet({
  open,
  onOpenChange,
  teamId,
  teamSlug,
  presetFilter,
  advancedFilters,
  onAdvancedFiltersChange,
  onSaveView,
  onUpdateView,
  savedViewName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string
  teamSlug: string
  presetFilter?: IssueFilter
  advancedFilters?: IssueAdvancedFilters
  onAdvancedFiltersChange: (filters?: IssueAdvancedFilters) => void
  onSaveView?: () => void
  onUpdateView?: () => void
  savedViewName?: string
}) {
  const { data: members = [] } = useQuery(teamMembersQueryOptions(teamId))
  const { data: labels = [] } = useQuery(labelsQueryOptions())
  const { data: cycles = [] } = useQuery(cyclesQueryOptions(teamSlug))

  const filters = advancedFilters ?? emptyAdvancedFilters()
  const showAdvancedState = hasAdvancedFilters(advancedFilters)

  const updateFilters = (next: IssueAdvancedFilters) => {
    onAdvancedFiltersChange(hasAdvancedFilters(next) ? next : undefined)
  }

  const statusOptions = issueStatuses.map((status) => ({
    value: status,
    label: statusConfig[status].label,
  }))

  const priorityOptions = issuePriorities.map((priority) => ({
    value: priority,
    label: priorityConfig[priority].label,
  }))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Live-filter this team’s issue list and save the current state as a reusable view.
          </SheetDescription>
          {presetFilter ? (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-outline-variant/15 bg-surface-container/30 px-3 py-2 text-xs text-muted-foreground">
              <span>Quick preset:</span>
              <Badge variant="outline" className="rounded-full">
                {presetFilter}
              </Badge>
              <span>Applying advanced filters replaces the preset.</span>
            </div>
          ) : null}
          {savedViewName ? (
            <div className="text-xs text-muted-foreground">
              Editing saved view <span className="font-medium text-foreground">{savedViewName}</span>
            </div>
          ) : null}
        </SheetHeader>

        <SheetBody className="space-y-5 pb-6">
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Match
            </div>
            <Select
              value={filters.logic}
              onValueChange={(value) =>
                updateFilters({
                  ...filters,
                  logic: value as "and" | "or",
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose logic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="and">Match all active filters</SelectItem>
                <SelectItem value="or">Match any active filter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FilterSelector
            label="Status"
            placeholder="Any status"
            options={statusOptions}
            values={filters.statuses}
            onChange={(statuses) =>
              updateFilters({
                ...filters,
                statuses: statuses as IssueStatus[],
              })
            }
          />

          <FilterSelector
            label="Priority"
            placeholder="Any priority"
            options={priorityOptions}
            values={filters.priorities}
            onChange={(priorities) =>
              updateFilters({
                ...filters,
                priorities: priorities as IssuePriority[],
              })
            }
          />

          <FilterSelector
            label="Assignee"
            placeholder="Any assignee"
            options={members.map((member) => ({
              value: member.id,
              label: member.name,
            }))}
            values={filters.assigneeIds}
            onChange={(assigneeIds) =>
              updateFilters({
                ...filters,
                assigneeIds,
              })
            }
          />

          <FilterSelector
            label="Labels"
            placeholder="Any label"
            options={labels.map((label) => ({
              value: label.id,
              label: label.name,
            }))}
            values={filters.labelIds}
            onChange={(labelIds) =>
              updateFilters({
                ...filters,
                labelIds,
              })
            }
          />

          <FilterSelector
            label="Cycle"
            placeholder="Any cycle"
            options={cycles.map((cycle) => ({
              value: cycle.id,
              label: cycle.name,
            }))}
            values={filters.cycleIds}
            onChange={(cycleIds) =>
              updateFilters({
                ...filters,
                cycleIds,
              })
            }
          />

          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Due Date Range
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                type="date"
                value={filters.dueFrom ?? ""}
                onChange={(event) =>
                  updateFilters({
                    ...filters,
                    dueFrom: event.target.value || undefined,
                  })
                }
              />
              <Input
                type="date"
                value={filters.dueTo ?? ""}
                onChange={(event) =>
                  updateFilters({
                    ...filters,
                    dueTo: event.target.value || undefined,
                  })
                }
              />
            </div>
          </div>

          {showAdvancedState ? (
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start px-0 text-sm text-muted-foreground"
              onClick={() => onAdvancedFiltersChange(undefined)}
            >
              Clear all advanced filters
            </Button>
          ) : null}
        </SheetBody>

        <SheetFooter>
          {onSaveView ? (
            <Button type="button" variant="outline" onClick={onSaveView}>
              Save as new view
            </Button>
          ) : null}
          {onUpdateView ? (
            <Button type="button" onClick={onUpdateView}>
              Update view
            </Button>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
