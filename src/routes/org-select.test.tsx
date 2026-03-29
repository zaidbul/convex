// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const useAuthMock = vi.fn()
const useUserMock = vi.fn()
const useOrganizationMock = vi.fn()
const useOrganizationListMock = vi.fn()
const useClerkMock = vi.fn()
const hardNavigateMock = vi.fn()
const routeSearchMock = vi.fn(() => ({}))

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({
    options,
    useSearch: () => routeSearchMock(),
  }),
}))

vi.mock("@clerk/tanstack-react-start", () => ({
  useAuth: (...args: unknown[]) => useAuthMock(...args),
  useUser: (...args: unknown[]) => useUserMock(...args),
  useOrganization: (...args: unknown[]) => useOrganizationMock(...args),
  useOrganizationList: (...args: unknown[]) => useOrganizationListMock(...args),
  useClerk: (...args: unknown[]) => useClerkMock(...args),
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

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AvatarImage: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div>Loading</div>,
}))

vi.mock("lucide-react", () => ({
  Plus: () => <span>Plus</span>,
  LogOut: () => <span>LogOut</span>,
  Building2: () => <span>Building2</span>,
  ArrowRight: () => <span>ArrowRight</span>,
}))

vi.mock("@/lib/auth-routing", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth-routing")>("@/lib/auth-routing")
  return {
    ...actual,
    hardNavigate: (...args: unknown[]) => hardNavigateMock(...args),
  }
})

import { OrgSelectPage } from "./org-select"

function makeMembership(id: string, name: string, slug: string | null) {
  return {
    organization: {
      id,
      name,
      slug,
      imageUrl: null,
      membersCount: 1,
    },
  }
}

function makeUser() {
  return {
    firstName: "Alice",
    lastName: "Example",
    fullName: "Alice Example",
    imageUrl: null,
    primaryEmailAddress: { emailAddress: "alice@example.com" },
  }
}

describe("OrgSelectPage", () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    useAuthMock.mockReset()
    useUserMock.mockReset()
    useOrganizationMock.mockReset()
    useOrganizationListMock.mockReset()
    useClerkMock.mockReset()
    hardNavigateMock.mockReset()
    routeSearchMock.mockReset()
    routeSearchMock.mockReturnValue({})
  })

  test("redirects signed-out users to sign-in", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      orgSlug: null,
    })
    useUserMock.mockReturnValue({ isLoaded: true, user: null })
    useOrganizationMock.mockReturnValue({ organization: null })
    useOrganizationListMock.mockReturnValue({
      isLoaded: true,
      userMemberships: { data: [] },
      setActive: vi.fn(),
      createOrganization: vi.fn(),
    })
    useClerkMock.mockReturnValue({ signOut: vi.fn() })

    render(<OrgSelectPage />)

    await waitFor(() => {
      expect(hardNavigateMock).toHaveBeenCalledWith("/sign-in")
    })
  })

  test("redirects users with an active organization to the dashboard", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      orgSlug: "acme",
    })
    useUserMock.mockReturnValue({ isLoaded: true, user: makeUser() })
    useOrganizationMock.mockReturnValue({ organization: null })
    useOrganizationListMock.mockReturnValue({
      isLoaded: true,
      userMemberships: { data: [] },
      setActive: vi.fn(),
      createOrganization: vi.fn(),
    })
    useClerkMock.mockReturnValue({ signOut: vi.fn() })

    render(<OrgSelectPage />)

    await waitFor(() => {
      expect(hardNavigateMock).toHaveBeenCalledWith("/acme/tickets/dashboard")
    })
  })

  test("auto-creates a workspace for first-time users and redirects to the dashboard", async () => {
    const createOrganization = vi.fn(async () => ({
      id: "org_new",
      name: "Alice Example",
      slug: "alice-example",
    }))
    const setActive = vi.fn(async ({ navigate }: { navigate?: (params: { decorateUrl: (url: string) => string }) => Promise<void> }) => {
      await navigate?.({ decorateUrl: (url) => url })
    })

    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      orgSlug: null,
    })
    useUserMock.mockReturnValue({ isLoaded: true, user: makeUser() })
    useOrganizationMock.mockReturnValue({ organization: null })
    useOrganizationListMock.mockReturnValue({
      isLoaded: true,
      userMemberships: { data: [] },
      setActive,
      createOrganization,
    })
    useClerkMock.mockReturnValue({ signOut: vi.fn() })

    render(<OrgSelectPage />)

    await waitFor(() => {
      expect(createOrganization).toHaveBeenCalledWith({ name: "Alice Example" })
      expect(setActive).toHaveBeenCalledTimes(1)
      expect(hardNavigateMock).toHaveBeenCalledWith("/alice-example/tickets/dashboard")
    })
  })

  test("auto-activates the only available workspace", async () => {
    const createOrganization = vi.fn()
    const setActive = vi.fn(async ({ navigate }: { navigate?: (params: { decorateUrl: (url: string) => string }) => Promise<void> }) => {
      await navigate?.({ decorateUrl: (url) => url })
    })

    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      orgSlug: null,
    })
    useUserMock.mockReturnValue({ isLoaded: true, user: makeUser() })
    useOrganizationMock.mockReturnValue({ organization: null })
    useOrganizationListMock.mockReturnValue({
      isLoaded: true,
      userMemberships: { data: [makeMembership("org_1", "Acme", "acme")] },
      setActive,
      createOrganization,
    })
    useClerkMock.mockReturnValue({ signOut: vi.fn() })

    render(<OrgSelectPage />)

    await waitFor(() => {
      expect(createOrganization).not.toHaveBeenCalled()
      expect(setActive).toHaveBeenCalledTimes(1)
      expect(hardNavigateMock).toHaveBeenCalledWith("/acme/tickets/dashboard")
    })
  })

  test("renders the picker for users with multiple workspaces and no active org", () => {
    const createOrganization = vi.fn()
    const setActive = vi.fn()

    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      orgSlug: null,
    })
    useUserMock.mockReturnValue({ isLoaded: true, user: makeUser() })
    useOrganizationMock.mockReturnValue({ organization: null })
    useOrganizationListMock.mockReturnValue({
      isLoaded: true,
      userMemberships: {
        data: [
          makeMembership("org_1", "Acme", "acme"),
          makeMembership("org_2", "Beta", "beta"),
        ],
      },
      setActive,
      createOrganization,
    })
    useClerkMock.mockReturnValue({ signOut: vi.fn() })

    render(<OrgSelectPage />)

    expect(screen.getAllByText("Acme").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Beta").length).toBeGreaterThan(0)
    expect(createOrganization).not.toHaveBeenCalled()
    expect(setActive).not.toHaveBeenCalled()
    expect(hardNavigateMock).not.toHaveBeenCalled()
  })

  test("opens the create form immediately for the create intent", () => {
    const createOrganization = vi.fn()
    const setActive = vi.fn()

    routeSearchMock.mockReturnValue({ intent: "create" })
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      orgSlug: "acme",
    })
    useUserMock.mockReturnValue({ isLoaded: true, user: makeUser() })
    useOrganizationMock.mockReturnValue({
      organization: {
        id: "org_1",
        name: "Acme",
        slug: "acme",
      },
    })
    useOrganizationListMock.mockReturnValue({
      isLoaded: true,
      userMemberships: { data: [makeMembership("org_1", "Acme", "acme")] },
      setActive,
      createOrganization,
    })
    useClerkMock.mockReturnValue({ signOut: vi.fn() })

    render(<OrgSelectPage />)

    expect(screen.getByText("Create a workspace")).not.toBeNull()
    expect(screen.getByPlaceholderText("Workspace name")).not.toBeNull()
    expect(hardNavigateMock).not.toHaveBeenCalled()
  })

  test("resolver side effects only run once across rerenders", async () => {
    const createOrganization = vi.fn(async () => ({
      id: "org_new",
      name: "Alice Example",
      slug: "alice-example",
    }))
    const setActive = vi.fn(async ({ navigate }: { navigate?: (params: { decorateUrl: (url: string) => string }) => Promise<void> }) => {
      await navigate?.({ decorateUrl: (url) => url })
    })

    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      orgSlug: null,
    })
    useUserMock.mockReturnValue({ isLoaded: true, user: makeUser() })
    useOrganizationMock.mockReturnValue({ organization: null })
    useOrganizationListMock.mockReturnValue({
      isLoaded: true,
      userMemberships: { data: [] },
      setActive,
      createOrganization,
    })
    useClerkMock.mockReturnValue({ signOut: vi.fn() })

    const view = render(<OrgSelectPage />)
    view.rerender(<OrgSelectPage />)

    await waitFor(() => {
      expect(createOrganization).toHaveBeenCalledTimes(1)
      expect(setActive).toHaveBeenCalledTimes(1)
    })
  })
})
