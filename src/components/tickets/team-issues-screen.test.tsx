// @vitest-environment jsdom

import { render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, test, vi } from "vitest"
import { keepPreviousData } from "@tanstack/react-query"
import { TeamIssuesScreen } from "./team-issues-screen"

const useSuspenseQueryMock = vi.fn()
const useQueryMock = vi.fn()
const issuesQueryOptionsMock = vi.fn()

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query"
  )

  return {
    ...actual,
    useSuspenseQuery: (...args: unknown[]) => useSuspenseQueryMock(...args),
    useQuery: (...args: unknown[]) => useQueryMock(...args),
  }
})

vi.mock("@/query/options/tickets", () => ({
  teamQueryOptions: vi.fn((teamSlug: string) => ({
    queryKey: ["team", teamSlug],
  })),
  cyclesQueryOptions: vi.fn((teamSlug: string) => ({
    queryKey: ["cycles", teamSlug],
  })),
  issuesQueryOptions: (...args: unknown[]) => issuesQueryOptionsMock(...args),
}))

vi.mock("./ticket-header", () => ({
  TicketHeader: ({ activeFilter }: { activeFilter?: string }) => (
    <div>header:{activeFilter ?? "none"}</div>
  ),
}))

vi.mock("./issue-list", () => ({
  IssueList: ({ issues }: { issues: Array<{ identifier: string }> }) => (
    <div>{issues.map((issue) => issue.identifier).join(",")}</div>
  ),
}))

vi.mock("./issue-board", () => ({
  IssueBoard: () => <div>board</div>,
}))

vi.mock("./create-cycle-dialog", () => ({
  CreateCycleDialog: () => null,
}))

vi.mock("./issue-panel-provider", () => ({
  IssuePanelProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useIssuePanel: () => ({ panelOpen: false }),
}))

vi.mock("./issue-side-panel", () => ({
  IssueSidePanel: () => null,
}))

describe("TeamIssuesScreen", () => {
  test("keeps rendering issue data with non-suspense queries and highlights all issues by default", () => {
    issuesQueryOptionsMock.mockReturnValue({
      queryKey: ["issues", "platform", '{"presetFilter":"all"}'],
      queryFn: vi.fn(),
    })

    useSuspenseQueryMock
      .mockReturnValueOnce({
        data: {
          id: "team-1",
          slug: "platform",
          name: "Platform",
          identifier: "PLT",
          color: "#4f46e5",
        },
      })
      .mockReturnValueOnce({
        data: [],
      })

    useQueryMock.mockReturnValue({
      data: [
        {
          id: "issue-1",
          identifier: "PLT-1",
          title: "Keep old rows visible",
          status: "todo",
          priority: "medium",
          priorityScore: 1,
          labels: [],
          assignees: [],
          cycleId: null,
          dueDate: null,
          createdAt: "2026-03-20T00:00:00.000Z",
          updatedAt: "2026-03-20T00:00:00.000Z",
        },
      ],
    })

    render(
      <TeamIssuesScreen
        teamSlug="platform"
        filters={{ presetFilter: "all" }}
        onPresetChange={() => undefined}
        onAdvancedFiltersChange={() => undefined}
      />
    )

    expect(screen.getByText("header:all")).toBeTruthy()
    expect(screen.getByText("PLT-1")).toBeTruthy()

    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        placeholderData: keepPreviousData,
        queryKey: ["issues", "platform", '{"presetFilter":"all"}'],
      })
    )
  })
})
