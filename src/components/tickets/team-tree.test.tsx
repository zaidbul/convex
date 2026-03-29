// @vitest-environment jsdom

import { render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, test, vi } from "vitest"
import { TeamTree } from "./team-tree"

const useParamsMock = vi.fn()
const useLocationMock = vi.fn()

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
  }: {
    to: string
    params: Record<string, string>
  }) => <a href="#" data-to={to} data-params={JSON.stringify(params)} />,
  useParams: (...args: unknown[]) => useParamsMock(...args),
  useLocation: (...args: unknown[]) => useLocationMock(...args),
}))

vi.mock("@/components/ui/collapsible", () => ({
  Collapsible: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CollapsibleContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  CollapsibleTrigger: ({
    children,
    render,
  }: {
    children: ReactNode
    render?: ReactNode
  }) => <div>{render ?? children}{render ? children : null}</div>,
}))

vi.mock("@/components/ui/sidebar", () => ({
  SidebarMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SidebarMenuButton: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SidebarMenuSub: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SidebarMenuSubItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SidebarMenuSubButton: ({
    children,
    isActive,
    render,
  }: {
    children: ReactNode
    isActive?: boolean
    render?: ReactNode
  }) => (
    <div data-active={isActive ? "true" : "false"}>
      {render}
      {children}
    </div>
  ),
}))

describe("TeamTree", () => {
  test("renders cycle links and marks the active cycle route", () => {
    useParamsMock.mockImplementation(() => ({
      slug: "acme",
      teamSlug: "platform",
    }))
    useLocationMock.mockReturnValue({
      pathname: "/acme/tickets/platform/cycles/current",
    })

    render(
      <TeamTree
        teams={[
          {
            id: "team-1",
            slug: "platform",
            name: "Platform",
            identifier: "PLT",
            color: "#4f46e5",
          },
        ]}
      />
    )

    const current = screen.getByText("Current").closest("[data-active]")
    const upcoming = screen.getByText("Upcoming").closest("[data-active]")

    expect(current?.getAttribute("data-active")).toBe("true")
    expect(upcoming?.getAttribute("data-active")).toBe("false")
    expect(document.querySelectorAll("a")).toHaveLength(3)
  })
})
