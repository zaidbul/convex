// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const authMock = vi.fn()
const useSignInMock = vi.fn()
const useSignUpMock = vi.fn()
const hardNavigateMock = vi.fn()

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  createFileRoute: () => (options: Record<string, unknown>) => ({ options }),
  redirect: (options: Record<string, unknown>) => ({ options }),
}))

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    handler: (fn: (...args: unknown[]) => unknown) => fn,
  }),
}))

vi.mock("@clerk/tanstack-react-start/server", () => ({
  auth: (...args: unknown[]) => authMock(...args),
}))

vi.mock("@clerk/tanstack-react-start", () => ({
  useSignIn: (...args: unknown[]) => useSignInMock(...args),
  useSignUp: (...args: unknown[]) => useSignUpMock(...args),
}))

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

vi.mock("@/components/ui/label", () => ({
  Label: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
}))

vi.mock("lucide-react", () => ({
  ChevronLeft: () => <span>ChevronLeft</span>,
}))

vi.mock("@/lib/auth-routing", () => ({
  hardNavigate: (...args: unknown[]) => hardNavigateMock(...args),
}))

import { Route as SignInRoute, SignInPage } from "./sign-in/index"
import { Route as SignUpRoute, SignUpPage } from "./sign-up"

type RedirectLike = { options?: Record<string, unknown> }

function createSignInResource() {
  const resource = {
    status: "needs_identifier",
    password: vi.fn(async () => {
      resource.status = "complete"
      return { error: null }
    }),
    finalize: vi.fn(async () => undefined),
    create: vi.fn(),
    sso: vi.fn(),
    resetPasswordEmailCode: {
      sendCode: vi.fn(),
      verifyCode: vi.fn(),
      submitPassword: vi.fn(),
    },
  }

  return resource
}

function createSignUpResource() {
  const resource = {
    status: "missing_requirements",
    unverifiedFields: [] as string[],
    password: vi.fn(async () => {
      resource.status = "complete"
      return { error: null }
    }),
    finalize: vi.fn(async () => undefined),
    sso: vi.fn(),
    verifications: {
      sendEmailCode: vi.fn(),
      verifyEmailCode: vi.fn(),
    },
  }

  return resource
}

async function captureRedirect(fn: () => unknown | Promise<unknown>) {
  try {
    await fn()
    return null
  } catch (error) {
    return error as RedirectLike
  }
}

describe("auth entry routes", () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    authMock.mockReset()
    useSignInMock.mockReset()
    useSignUpMock.mockReset()
    hardNavigateMock.mockReset()
  })

  test("sign-in beforeLoad redirects active-org users to the dashboard route", async () => {
    authMock.mockResolvedValue({ userId: "user_1", orgSlug: "acme" })

    const redirect = await captureRedirect(() => SignInRoute.options.beforeLoad?.({} as never))

    expect(redirect).toMatchObject({
      options: {
        to: "/$slug/tickets/dashboard",
        params: { slug: "acme" },
        search: {},
      },
    })
  })

  test("sign-up beforeLoad redirects active-org users to the dashboard route", async () => {
    authMock.mockResolvedValue({ userId: "user_1", orgSlug: "acme" })

    const redirect = await captureRedirect(() => SignUpRoute.options.beforeLoad?.({} as never))

    expect(redirect).toMatchObject({
      options: {
        to: "/$slug/tickets/dashboard",
        params: { slug: "acme" },
        search: {},
      },
    })
  })

  test("sign-in page does not navigate until auth completes", () => {
    useSignInMock.mockReturnValue({
      signIn: createSignInResource(),
      errors: undefined,
    })

    render(<SignInPage />)

    expect(hardNavigateMock).not.toHaveBeenCalled()
  })

  test("sign-in page hard navigates after a completed password login", async () => {
    const signIn = createSignInResource()
    useSignInMock.mockReturnValue({
      signIn,
      errors: undefined,
    })

    render(<SignInPage />)

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "alice@example.com" },
    })
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!)

    const passwordInput = await screen.findByPlaceholderText("Password")
    fireEvent.change(passwordInput, {
      target: { value: "secret-123" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Log in" }))

    await waitFor(() => {
      expect(signIn.finalize).toHaveBeenCalledTimes(1)
      expect(hardNavigateMock).toHaveBeenCalledWith("/org-select")
    })
  })

  test("sign-up page hard navigates after a completed password signup", async () => {
    const signUp = createSignUpResource()
    useSignUpMock.mockReturnValue({
      signUp,
      errors: undefined,
    })

    render(<SignUpPage />)

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "alice@example.com" },
    })
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!)

    const passwordInput = await screen.findByPlaceholderText(
      "Password (min 8 characters)"
    )
    fireEvent.change(passwordInput, {
      target: { value: "secret-123" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Create account" }))

    await waitFor(() => {
      expect(signUp.finalize).toHaveBeenCalledTimes(1)
      expect(hardNavigateMock).toHaveBeenCalledWith("/org-select")
    })
  })
})
