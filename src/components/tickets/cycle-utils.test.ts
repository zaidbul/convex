import { describe, expect, test } from "vitest"
import {
  formatCycleDateRange,
  getAssignableCycleIssues,
  getCycleForView,
  getCycleProgress,
  getIssuesForCycle,
} from "./cycle-utils"
import type { Cycle, Issue } from "./types"

const cycles: Cycle[] = [
  {
    id: "cycle-active",
    name: "Cycle 12",
    number: 12,
    startDate: "2026-03-23",
    endDate: "2026-03-29",
    status: "active",
  },
  {
    id: "cycle-upcoming",
    name: "Cycle 13",
    number: 13,
    startDate: "2026-03-30",
    endDate: "2026-04-05",
    status: "upcoming",
  },
]

const issues: Issue[] = [
  {
    id: "issue-1",
    identifier: "PLT-1",
    title: "Done work",
    status: "done",
    priority: "high",
    priorityScore: 3,
    labels: [],
    assignees: [],
    cycleId: "cycle-active",
    dueDate: null,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "issue-2",
    identifier: "PLT-2",
    title: "Todo work",
    status: "todo",
    priority: "medium",
    priorityScore: 2,
    labels: [],
    assignees: [],
    cycleId: "cycle-active",
    dueDate: null,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "issue-3",
    identifier: "PLT-3",
    title: "Cancelled work",
    status: "cancelled",
    priority: "low",
    priorityScore: 1,
    labels: [],
    assignees: [],
    cycleId: "cycle-active",
    dueDate: null,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "issue-4",
    identifier: "PLT-4",
    title: "Unscheduled work",
    status: "backlog",
    priority: "none",
    priorityScore: 0,
    labels: [],
    assignees: [],
    cycleId: null,
    dueDate: null,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
]

describe("cycle utils", () => {
  test("selects current and upcoming cycles by status", () => {
    expect(getCycleForView(cycles, "current")?.id).toBe("cycle-active")
    expect(getCycleForView(cycles, "upcoming")?.id).toBe("cycle-upcoming")
    expect(getCycleForView([], "current")).toBeNull()
  })

  test("filters issues for a cycle and excludes already assigned picker issues", () => {
    expect(getIssuesForCycle(issues, "cycle-active").map((issue) => issue.id)).toEqual([
      "issue-1",
      "issue-2",
      "issue-3",
    ])

    expect(
      getAssignableCycleIssues(issues, "cycle-active").map((issue) => issue.id)
    ).toEqual(["issue-4"])
  })

  test("computes progress from non-cancelled issues only", () => {
    expect(getCycleProgress(getIssuesForCycle(issues, "cycle-active"))).toEqual({
      completed: 1,
      total: 2,
      percentage: 50,
    })
  })

  test("formats the cycle date range", () => {
    expect(formatCycleDateRange("2026-03-23", "2026-03-29")).toBe("Mar 23 - Mar 29")
  })
})
