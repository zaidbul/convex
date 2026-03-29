// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { IssueDetailView } from "./issue-detail-view"
import type { IssueDetail, Team } from "./types"

const useQueryMock = vi.fn()
const useSuspenseQueryMock = vi.fn()
const mutateMock = vi.fn()

let currentIssue: IssueDetail

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
  useSuspenseQuery: (...args: unknown[]) => useSuspenseQueryMock(...args),
}))

vi.mock("@/query/mutations/tickets", () => ({
  useUpdateIssueTitleMutation: () => ({
    mutate: mutateMock,
  }),
}))

vi.mock("@/query/options/tickets", () => ({
  issueDetailQueryOptions: (issueId: string) => ({ queryKey: ["issue", issueId] }),
  teamMembersQueryOptions: (teamId: string) => ({ queryKey: ["team-members", teamId] }),
}))

vi.mock("@/components/editor/IssueEditor", () => ({
  IssueEditor: ({
    title,
    onTitleChange,
  }: {
    title: string
    onTitleChange: (nextTitle: string) => void
  }) => (
    <div>
      <div data-testid="issue-title">{title}</div>
      <button type="button" onClick={() => onTitleChange("Updated title")}>
        Change title
      </button>
    </div>
  ),
}))

vi.mock("./issue-detail-header", () => ({
  IssueDetailHeader: () => <div>Header</div>,
}))

vi.mock("./issue-properties-panel", () => ({
  IssuePropertiesPanel: () => <div>Properties</div>,
}))

vi.mock("./issue-activity-feed", () => ({
  IssueActivityFeed: () => <div>Activity</div>,
}))

const team: Team = {
  id: "team-1",
  slug: "platform",
  name: "Platform",
  identifier: "PLT",
  color: "#4f46e5",
}

function makeIssue(id: string, title: string): IssueDetail {
  return {
    id,
    identifier: `PLT-${id === "issue-1" ? "1" : "2"}`,
    title,
    description: null,
    status: "todo",
    priority: "medium",
    priorityScore: 2,
    labels: [],
    assignees: [],
    cycleId: null,
    dueDate: null,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
    teamId: team.id,
    creator: {
      id: "user-1",
      name: "Alice Example",
      initials: "AE",
    },
    completedAt: null,
    cancelledAt: null,
  }
}

describe("IssueDetailView", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mutateMock.mockClear()
    currentIssue = makeIssue("issue-1", "First issue")
    useSuspenseQueryMock.mockImplementation(() => ({ data: currentIssue }))
    useQueryMock.mockReturnValue({ data: [] })
  })

  test("clears the pending title save when the view unmounts", () => {
    const view = render(<IssueDetailView issueId="issue-1" team={team} />)

    fireEvent.click(screen.getByText("Change title"))
    view.unmount()

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(mutateMock).not.toHaveBeenCalled()
  })

  test("clears the pending title save when navigating to another issue", () => {
    const view = render(<IssueDetailView issueId="issue-1" team={team} />)

    fireEvent.click(screen.getByText("Change title"))

    currentIssue = makeIssue("issue-2", "Second issue")
    view.rerender(<IssueDetailView issueId="issue-2" team={team} />)

    expect(screen.getByTestId("issue-title").textContent).toBe("Second issue")

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(mutateMock).not.toHaveBeenCalled()
  })
})
