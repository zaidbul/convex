// @vitest-environment jsdom

import { render, screen } from "@testing-library/react"
import React, { type ReactElement, type ReactNode } from "react"
import { describe, expect, test, vi } from "vitest"
import { DashboardSuggestedDirections } from "./dashboard-suggested-directions"
import type { FeedbackSuggestion } from "@/components/tickets/types"

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children?: ReactNode
    to?: string
  }) => (
    <a href={to ?? "#"} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    render,
    nativeButton,
    ...props
  }: {
    children?: ReactNode
    render?: ReactElement
    nativeButton?: boolean
  }) => {
    if (render) {
      return React.cloneElement(render, {
        ...props,
        "data-native-button": String(nativeButton),
        children,
      })
    }

    return (
      <button data-native-button={String(nativeButton)} {...props}>
        {children}
      </button>
    )
  },
}))

const suggestions: FeedbackSuggestion[] = [
  {
    id: "suggestion-1",
    clusterId: "cluster-1",
    title: "Improve ticket search",
    summary: "Search is a repeated complaint across imports.",
    proposedSolution: "Add ranking and saved queries.",
    aiRationale: "Multiple signals mention discoverability.",
    status: "new",
    suggestedTeam: {
      id: "team-1",
      slug: "platform",
      name: "Platform",
      identifier: "PLT",
      color: "#4f46e5",
    },
    selectedTeam: null,
    confidence: 84,
    impactScore: 72,
    evidenceCount: 6,
    sourceDiversity: 3,
    priorityScore: 96,
    issueId: null,
    updatedAt: "2026-03-29T00:00:00.000Z",
  },
]

describe("DashboardSuggestedDirections", () => {
  test("renders suggestion rows with summary and team", () => {
    render(<DashboardSuggestedDirections suggestions={suggestions} slug="demo" />)

    expect(screen.getByText("Suggested Directions")).toBeTruthy()
    expect(screen.getByText("Improve ticket search")).toBeTruthy()
    expect(screen.getByText("Platform")).toBeTruthy()
    expect(screen.getByText("84%")).toBeTruthy()
  })

  test("renders the open hub control as a navigable non-native button link", () => {
    render(<DashboardSuggestedDirections suggestions={suggestions} slug="demo" />)

    const [openHubLink] = screen.getAllByRole("link", { name: /open hub/i })

    expect(openHubLink.getAttribute("href")).toBe(
      "/$slug/tickets/synthesize/suggestions"
    )
    expect(openHubLink.getAttribute("data-native-button")).toBe("false")
  })
})
