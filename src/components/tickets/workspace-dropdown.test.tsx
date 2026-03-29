// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const navigateMock = vi.fn()
const useAuthMock = vi.fn()
const useUserMock = vi.fn()
const useOrganizationMock = vi.fn()
const useOrganizationListMock = vi.fn()
const useClerkMock = vi.fn()
const createTeamMutationMock = vi.fn()
const toastSuccessMock = vi.fn()
const toastErrorMock = vi.fn()

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ slug: "acme" }),
}))

vi.mock("@clerk/tanstack-react-start", () => ({
  useAuth: (...args: unknown[]) => useAuthMock(...args),
  useUser: (...args: unknown[]) => useUserMock(...args),
  useOrganization: (...args: unknown[]) => useOrganizationMock(...args),
  useOrganizationList: (...args: unknown[]) => useOrganizationListMock(...args),
  useClerk: (...args: unknown[]) => useClerkMock(...args),
}))

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}))

vi.mock("lucide-react", () => ({
  ArrowLeftRight: () => <span>ArrowLeftRight</span>,
  Check: () => <span>Check</span>,
  ChevronDown: () => <span>ChevronDown</span>,
  Layers: () => <span>Layers</span>,
  LogOut: () => <span>LogOut</span>,
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
    useAuthMock.mockReset()
    useUserMock.mockReset()
    useOrganizationMock.mockReset()
    useOrganizationListMock.mockReset()
    useClerkMock.mockReset()
    createTeamMutationMock.mockReset()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()

    useUserMock.mockReturnValue({
      user: {
        firstName: "Alice",
        lastName: "Example",
        fullName: "Alice Example",
        imageUrl: null,
        primaryEmailAddress: { emailAddress: "alice@example.com" },
      },
    })
    useOrganizationMock.mockReturnValue({
      organization: {
        id: "org_1",
        name: "Acme",
        slug: "acme",
      },
    })
    useOrganizationListMock.mockReturnValue({
      userMemberships: {
        data: [
          {
            organization: {
              id: "org_1",
              name: "Acme",
              slug: "acme",
            },
          },
        ],
      },
      setActive: vi.fn(),
    })
    useClerkMock.mockReturnValue({ signOut: vi.fn() })
    useAuthMock.mockReturnValue({ orgRole: "org:admin" })
  })

  afterEach(() => {
    cleanup()
  })

  test("shows team and workspace actions for admins", () => {
    renderDropdown()

    expect(screen.getByText("Create team")).not.toBeNull()
    expect(screen.getByText("Manage teams")).not.toBeNull()
    expect(screen.getByText("Switch workspace")).not.toBeNull()
    expect(screen.getByText("Create another workspace")).not.toBeNull()
  })

  test("hides team creation for non-admins", () => {
    useAuthMock.mockReturnValue({ orgRole: "org:member" })

    renderDropdown()

    expect(screen.queryByText("Create team")).toBeNull()
    expect(screen.getByText("Manage teams")).not.toBeNull()
  })

  test("routes workspace creation through org-select intent=create", () => {
    renderDropdown()

    fireEvent.click(screen.getByText("Create another workspace"))

    expect(navigateMock).toHaveBeenCalledWith({
      to: "/org-select",
      search: { intent: "create" },
    })
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
          slug: "acme",
          teamSlug: "platform",
        },
      })
    })
  })
})
