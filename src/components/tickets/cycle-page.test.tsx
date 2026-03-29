// @vitest-environment jsdom

import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import { CyclePageBody } from "./cycle-page"
import type { Cycle, Issue, Team } from "./types"

vi.mock("@/components/tickets/ticket-header", () => ({
  TicketHeader: () => <div>Ticket header</div>,
}))

vi.mock("@/query/options/tickets", () => ({
  teamQueryOptions: vi.fn(),
  cyclesQueryOptions: vi.fn(),
  issuesQueryOptions: vi.fn(),
}))

vi.mock("./issue-row", () => ({
  IssueRow: ({ issue }: { issue: Issue }) => <div>{issue.identifier}</div>,
}))

vi.mock("./cycle-issue-picker", () => ({
  CycleIssuePicker: () => <button type="button">Add issue</button>,
}))

const team: Team = {
  id: "team-1",
  slug: "platform",
  name: "Platform",
  identifier: "PLT",
  color: "#4f46e5",
}

const cycle: Cycle = {
  id: "cycle-1",
  name: "Cycle 12",
  number: 12,
  startDate: "2026-03-23",
  endDate: "2026-03-29",
  status: "active",
}

const allCycleIssues: Issue[] = [
  {
    id: "issue-1",
    identifier: "PLT-1",
    title: "Ship it",
    status: "done",
    priority: "high",
    priorityScore: 3,
    labels: [],
    assignees: [],
    cycleId: "cycle-1",
    dueDate: null,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "issue-2",
    identifier: "PLT-2",
    title: "Still open",
    status: "todo",
    priority: "medium",
    priorityScore: 2,
    labels: [],
    assignees: [],
    cycleId: "cycle-1",
    dueDate: null,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "issue-3",
    identifier: "PLT-3",
    title: "Cancelled",
    status: "cancelled",
    priority: "low",
    priorityScore: 1,
    labels: [],
    assignees: [],
    cycleId: "cycle-1",
    dueDate: null,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
]

describe("CyclePageBody", () => {
  test("renders the cycle summary and only the visible cycle issues", () => {
    render(
      <CyclePageBody
        team={team}
        teamSlug="platform"
        viewKind="current"
        cycle={cycle}
        allCycleIssues={allCycleIssues}
        visibleIssues={[allCycleIssues[1]!]}
        filters={{ presetFilter: "active" }}
      />
    )

    expect(screen.getAllByText("Cycle 12")).toHaveLength(2)
    expect(screen.getByText("Current cycle")).toBeTruthy()
    expect(screen.getByText("50% complete")).toBeTruthy()
    expect(screen.getByText("PLT-2")).toBeTruthy()
    expect(screen.queryByText("PLT-1")).toBeNull()
  })

  test("renders a non-error empty state when the selected cycle is missing", () => {
    render(
      <CyclePageBody
        team={team}
        teamSlug="platform"
        viewKind="upcoming"
        cycle={null}
        allCycleIssues={[]}
        visibleIssues={[]}
        filters={{}}
      />
    )

    expect(screen.getByText("No upcoming cycle")).toBeTruthy()
  })
})
