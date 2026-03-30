// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const navigateMock = vi.fn()
const createTeamMutationMock = vi.fn()
const toastSuccessMock = vi.fn()
const toastErrorMock = vi.fn()

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ slug: "acme-corp" }),
}))

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}))

vi.mock("lucide-react", () => ({
  Check: () => <span>Check</span>,
  ChevronDown: () => <span>ChevronDown</span>,
  Layers: () => <span>Layers</span>,
  Plus: () => <span>Plus</span>,
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
}))

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

vi.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    ...props
  }: React.LabelHTMLAttributes<HTMLLabelElement>) => <label {...props}>{children}</label>,
}))

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AvatarImage: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock("@/components/ui/sidebar", () => ({
  SidebarMenuButton: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
}))

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode
    open?: boolean
  }) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuTrigger: ({
    children,
    render,
  }: {
    children: React.ReactNode
    render?: React.ReactNode
  }) => (
    <div>
      {render}
      {children}
    </div>
  ),
}))

vi.mock("@/query/mutations/settings", () => ({
  useCreateTeamMutation: () => ({
    mutateAsync: createTeamMutationMock,
    isPending: false,
  }),
}))

import { WorkspaceDropdown } from "./workspace-dropdown"

function renderDropdown() {
  return render(<WorkspaceDropdown workspace={{ id: "workspace_1", name: "Acme" }} />)
}

describe("WorkspaceDropdown", () => {
  beforeEach(() => {
    navigateMock.mockReset()
    createTeamMutationMock.mockReset()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  test("shows team actions and demo user info", () => {
    renderDropdown()

    expect(screen.getByText("Create team")).not.toBeNull()
    expect(screen.getByText("Manage teams")).not.toBeNull()
    expect(screen.getByText("Demo User")).not.toBeNull()
    expect(screen.getByText("demo@acme-corp.com")).not.toBeNull()
  })

  test("quick-create navigates to the new team issues page", async () => {
    createTeamMutationMock.mockResolvedValue({
      id: "team_1",
      slug: "platform",
    })

    renderDropdown()

    fireEvent.click(screen.getByText("Create team"))
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Platform" } })
    fireEvent.change(screen.getByLabelText("Identifier"), { target: { value: "PLT" } })
    fireEvent.click(screen.getByRole("button", { name: "Create team" }))

    await waitFor(() => {
      expect(createTeamMutationMock).toHaveBeenCalledWith({
        name: "Platform",
        identifier: "PLT",
        color: "#6366f1",
      })
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/$slug/tickets/$teamSlug/issues",
        params: {
          slug: "acme-corp",
          teamSlug: "platform",
        },
      })
    })
  })
})
