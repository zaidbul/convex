// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react"
import type { ComponentProps, ReactNode } from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { CycleIssuePicker } from "./cycle-issue-picker"

const useQueryMock = vi.fn()
const mutateMock = vi.fn()

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
}))

vi.mock("@/query/mutations/tickets", () => ({
  useUpdateIssueCycleMutation: () => ({
    mutate: mutateMock,
    isPending: false,
  }),
}))

vi.mock("@/query/options/tickets", () => ({
  issuesQueryOptions: () => ({
    queryKey: ["issues", "platform", "all"],
    queryFn: vi.fn(),
  }),
}))

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ render }: { render: ReactNode }) => <div>{render}</div>,
  PopoverContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverDescription: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock("@/components/ui/command", () => ({
  Command: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CommandInput: (props: ComponentProps<"input">) => <input {...props} />,
  CommandList: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CommandEmpty: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CommandGroup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CommandItem: ({
    children,
    onSelect,
    value,
    disabled,
  }: {
    children: ReactNode
    onSelect?: (value: string) => void
    value?: string
    disabled?: boolean
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect?.(value ?? "")}
    >
      {children}
    </button>
  ),
}))

describe("CycleIssuePicker", () => {
  beforeEach(() => {
    useQueryMock.mockReset()
    mutateMock.mockReset()
  })

  test("excludes issues already in the target cycle and reassigns selected work", () => {
    useQueryMock.mockReturnValue({
      data: [
        {
          id: "issue-1",
          identifier: "PLT-1",
          title: "Already scheduled",
          status: "todo",
          priority: "medium",
          priorityScore: 2,
          labels: [],
          assignees: [],
          cycleId: "cycle-1",
          createdAt: "2026-03-20T00:00:00.000Z",
          updatedAt: "2026-03-20T00:00:00.000Z",
        },
        {
          id: "issue-2",
          identifier: "PLT-2",
          title: "Needs planning",
          status: "backlog",
          priority: "none",
          priorityScore: 0,
          labels: [],
          assignees: [],
          cycleId: null,
          createdAt: "2026-03-20T00:00:00.000Z",
          updatedAt: "2026-03-20T00:00:00.000Z",
        },
      ],
    })

    render(
      <CycleIssuePicker
        teamSlug="platform"
        cycle={{
          id: "cycle-1",
          name: "Cycle 12",
          number: 12,
          startDate: "2026-03-23",
          endDate: "2026-03-29",
          status: "active",
        }}
      />
    )

    expect(screen.queryByText("Already scheduled")).toBeNull()
    fireEvent.click(screen.getByText("Needs planning"))

    expect(mutateMock).toHaveBeenCalledWith(
      { issueId: "issue-2", cycleId: "cycle-1" },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    )
  })
})
