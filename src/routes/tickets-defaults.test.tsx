import { describe, expect, test, vi } from "vitest"

vi.mock("@/query/options/session", () => ({
  sessionQuery: {},
}))

vi.mock("@/query/options/tickets", () => ({
  issuesQueryOptions: vi.fn(),
  teamQueryOptions: vi.fn(),
  cyclesQueryOptions: vi.fn(),
}))

vi.mock("@/query/mutations/tickets", () => ({
  useCreateSavedViewMutation: vi.fn(),
}))

import { Route as RootRoute } from "./__root"
import { Route as IssuesRoute } from "./_auth/$slug/tickets/$teamSlug/issues"
import { Route as CurrentCycleRoute } from "./_auth/$slug/tickets/$teamSlug/cycles/current"
import { Route as UpcomingCycleRoute } from "./_auth/$slug/tickets/$teamSlug/cycles/upcoming"

describe("tickets route defaults", () => {
  test("does not install a blocking root pending component", () => {
    expect(RootRoute.options.pendingComponent).toBeUndefined()
  })

  test("derives all-issues filters for the team issues route", () => {
    const deps = IssuesRoute.options.loaderDeps?.({
      search: {},
    } as never)

    expect(deps).toEqual({
      filters: {
        presetFilter: "all",
      },
    })
  })

  test("derives all-issues filters for cycle routes", () => {
    const currentDeps = CurrentCycleRoute.options.loaderDeps?.({
      search: {},
    } as never)
    const upcomingDeps = UpcomingCycleRoute.options.loaderDeps?.({
      search: {},
    } as never)

    expect(currentDeps).toEqual({
      filters: {
        presetFilter: "all",
      },
    })
    expect(upcomingDeps).toEqual({
      filters: {
        presetFilter: "all",
      },
    })
  })
})
