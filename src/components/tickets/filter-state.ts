import type {
  FilterLogic,
  IssueAdvancedFilters,
  IssueFilter,
  IssuePriority,
  IssueQueryFilters,
  IssueStatus,
} from "./types"

export type ViewMode = "list" | "board"

export type TicketRouteSearch = {
  filter?: string
  logic?: string
  statuses?: string
  priorities?: string
  assigneeIds?: string
  labelIds?: string
  cycleIds?: string
  dueFrom?: string
  dueTo?: string
  view?: string
}

const issueFilters = new Set<IssueFilter>([
  "all",
  "active",
  "backlog",
  "backlog-not-estimated",
  "backlog-graded",
  "recently-added",
  "my-issues",
])

function splitCsv(value?: string) {
  if (!value) {
    return []
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  )
}

function joinCsv(values: string[]) {
  return values.length > 0 ? values.join(",") : undefined
}

function normalizeDate(value?: string) {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : undefined
}

export function isIssueFilter(value?: string): value is IssueFilter {
  return Boolean(value && issueFilters.has(value as IssueFilter))
}

export function normalizeTicketRouteSearch(
  search: Record<string, unknown>,
): TicketRouteSearch {
  const readString = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined

  const view = readString(search.view)

  return {
    filter: readString(search.filter),
    logic: readString(search.logic),
    statuses: readString(search.statuses),
    priorities: readString(search.priorities),
    assigneeIds: readString(search.assigneeIds),
    labelIds: readString(search.labelIds),
    cycleIds: readString(search.cycleIds),
    dueFrom: normalizeDate(readString(search.dueFrom)),
    dueTo: normalizeDate(readString(search.dueTo)),
    view: view === "board" ? "board" : undefined,
  }
}

export function hasAdvancedFilters(filters?: IssueAdvancedFilters) {
  if (!filters) {
    return false
  }

  return Boolean(
    filters.statuses.length > 0 ||
      filters.priorities.length > 0 ||
      filters.assigneeIds.length > 0 ||
      filters.labelIds.length > 0 ||
      filters.cycleIds.length > 0 ||
      filters.dueFrom ||
      filters.dueTo,
  )
}

export function parseIssueQueryFilters(
  search: TicketRouteSearch,
  options?: { defaultPresetFilter?: IssueFilter },
): IssueQueryFilters {
  const presetFilter = isIssueFilter(search.filter)
    ? search.filter
    : options?.defaultPresetFilter

  const advancedFilters: IssueAdvancedFilters = {
    logic: search.logic === "or" ? "or" : "and",
    statuses: splitCsv(search.statuses) as IssueStatus[],
    priorities: splitCsv(search.priorities) as IssuePriority[],
    assigneeIds: splitCsv(search.assigneeIds),
    labelIds: splitCsv(search.labelIds),
    cycleIds: splitCsv(search.cycleIds),
    dueFrom: normalizeDate(search.dueFrom),
    dueTo: normalizeDate(search.dueTo),
  }

  if (!hasAdvancedFilters(advancedFilters)) {
    return presetFilter ? { presetFilter } : {}
  }

  return { advancedFilters }
}

export function serializeIssueQueryFilters(
  filters: IssueQueryFilters,
  options?: { defaultPresetFilter?: IssueFilter },
): TicketRouteSearch {
  if (filters.advancedFilters && hasAdvancedFilters(filters.advancedFilters)) {
    return {
      logic: filters.advancedFilters.logic,
      statuses: joinCsv(filters.advancedFilters.statuses),
      priorities: joinCsv(filters.advancedFilters.priorities),
      assigneeIds: joinCsv(filters.advancedFilters.assigneeIds),
      labelIds: joinCsv(filters.advancedFilters.labelIds),
      cycleIds: joinCsv(filters.advancedFilters.cycleIds),
      dueFrom: normalizeDate(filters.advancedFilters.dueFrom),
      dueTo: normalizeDate(filters.advancedFilters.dueTo),
    }
  }

  const defaultPresetFilter = options?.defaultPresetFilter ?? "all"
  const presetFilter =
    filters.presetFilter === defaultPresetFilter
      ? undefined
      : filters.presetFilter

  return {
    filter: presetFilter,
  }
}

export function getFilterPillSelection(
  filters: IssueQueryFilters,
  fallback: IssueFilter = "all",
) {
  if (filters.advancedFilters && hasAdvancedFilters(filters.advancedFilters)) {
    return undefined
  }

  return filters.presetFilter ?? fallback
}

export function emptyAdvancedFilters(
  logic: FilterLogic = "and",
): IssueAdvancedFilters {
  return {
    logic,
    statuses: [],
    priorities: [],
    assigneeIds: [],
    labelIds: [],
    cycleIds: [],
  }
}

export function getViewMode(search: TicketRouteSearch): ViewMode {
  return search.view === "board" ? "board" : "list"
}
