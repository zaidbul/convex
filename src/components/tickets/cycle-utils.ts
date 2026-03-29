import type { Cycle, Issue } from "./types"

export type CycleViewKind = "current" | "upcoming"

export function getCycleForView(
  cycles: Cycle[],
  viewKind: CycleViewKind
): Cycle | null {
  const status = viewKind === "current" ? "active" : "upcoming"
  return cycles.find((cycle) => cycle.status === status) ?? null
}

export function getIssuesForCycle(issues: Issue[], cycleId: string): Issue[] {
  return issues.filter((issue) => issue.cycleId === cycleId)
}

export function getAssignableCycleIssues(
  issues: Issue[],
  cycleId: string
): Issue[] {
  return issues.filter((issue) => issue.cycleId !== cycleId)
}

export function getCycleProgress(issues: Issue[]) {
  let completed = 0
  let total = 0

  for (const issue of issues) {
    if (issue.status === "cancelled") {
      continue
    }

    total += 1

    if (issue.status === "done") {
      completed += 1
    }
  }

  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}

export function formatCycleDateRange(start: string, end: string): string {
  const startDate = new Date(`${start}T00:00:00`)
  const endDate = new Date(`${end}T00:00:00`)
  const startMonth = startDate.toLocaleString("en-US", { month: "short" })
  const endMonth = endDate.toLocaleString("en-US", { month: "short" })
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
}

export function getCycleStatusLabel(cycle: Cycle): string {
  switch (cycle.status) {
    case "active":
      return "Current cycle"
    case "upcoming":
      return "Upcoming cycle"
    case "completed":
      return "Completed cycle"
    default:
      return "Cycle"
  }
}
