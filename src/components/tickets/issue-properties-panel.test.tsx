// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import { IssuePropertiesPanel } from "./issue-properties-panel"
import type { IssueDetail } from "./types"

const useQueryMock = vi.fn((options?: { queryKey?: unknown[] }) => {
  const queryKey = options?.queryKey ?? []

  if (queryKey[0] === "cycles") {
    return { data: [] }
  }

  return { data: [] }
})

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query"
  )

  return {
    ...actual,
    useQuery: (options: { queryKey?: unknown[] }) => useQueryMock(options),
  }
})

vi.mock("@/query/mutations/tickets", () => ({
  useUpdateIssueStatusMutation: () => ({ mutate: vi.fn() }),
  useUpdateIssuePriorityMutation: () => ({ mutate: vi.fn() }),
  useUpdateIssueAssigneeMutation: () => ({ mutate: vi.fn() }),
  useUpdateIssueCycleMutation: () => ({ mutate: vi.fn() }),
  useUpdateIssueDueDateMutation: () => ({ mutate: vi.fn() }),
  useUpdateIssueLabelsMutation: () => ({ mutate: vi.fn() }),
}))

vi.mock("@/query/options/tickets", () => ({
  teamMembersQueryOptions: (teamId: string) => ({
    queryKey: ["team-members", teamId],
  }),
  labelsQueryOptions: () => ({ queryKey: ["labels"] }),
  cyclesQueryOptions: (teamSlug: string) => ({
    queryKey: ["cycles", teamSlug],
  }),
}))

vi.mock("./create-cycle-dialog", () => ({
  CreateCycleDialog: ({ open }: { open: boolean }) =>
    open ? <div>Create cycle dialog open</div> : null,
}))

const issue: IssueDetail = {
  id: "issue-1",
  identifier: "PLT-1",
  title: "Ship cycle support",
  status: "todo",
  priority: "medium",
  priorityScore: 2,
  labels: [],
  assignees: [],
  cycleId: null,
  dueDate: null,
  createdAt: "2026-03-20T00:00:00.000Z",
  updatedAt: "2026-03-20T00:00:00.000Z",
  description: null,
  creator: {
    id: "user-1",
    name: "Alice Example",
    initials: "AE",
  },
  teamId: "team-1",
  completedAt: null,
  cancelledAt: null,
}

describe("IssuePropertiesPanel", () => {
  test("shows a create-cycle action when the team has no cycles", async () => {
    render(<IssuePropertiesPanel issue={issue} teamSlug="platform" />)

    fireEvent.click(screen.getByText("No cycle"))
    fireEvent.click(await screen.findByText("Create cycle"))

    expect(screen.getByText("Create cycle dialog open")).toBeTruthy()
  })
})
