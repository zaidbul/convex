import { describe, expect, test } from "vitest"
import { Route as AuthRoute } from "./_auth/route"
import { Route as SlugRoute } from "./_auth/$slug/route"

const runAuthBeforeLoad = AuthRoute.options.beforeLoad as (opts: unknown) => unknown
const runSlugBeforeLoad = SlugRoute.options.beforeLoad as (opts: unknown) => unknown

async function captureRedirect(fn: () => unknown | Promise<unknown>) {
  try {
    await fn()
    return null
  } catch (error) {
    return error as { options?: Record<string, unknown> }
  }
}

describe("auth route guards", () => {
  test("_auth redirects unauthenticated users to sign-in", async () => {
    const redirect = await captureRedirect(() =>
      runAuthBeforeLoad({
        context: {
          session: { userId: null, orgId: null, orgSlug: null, token: null },
        },
      })
    )

    expect(redirect).toMatchObject({
      options: { to: "/sign-in" },
    })
  })

  test("_auth redirects signed-in users without an org to org-select", async () => {
    const redirect = await captureRedirect(() =>
      runAuthBeforeLoad({
        context: {
          session: {
            userId: "user_1",
            orgId: null,
            orgSlug: null,
            token: "token",
          },
        },
      })
    )

    expect(redirect).toMatchObject({
      options: { to: "/org-select" },
    })
  })

  test("_auth allows signed-in users with an org", async () => {
    const redirect = await captureRedirect(() =>
      runAuthBeforeLoad({
        context: {
          session: {
            userId: "user_1",
            orgId: "org_1",
            orgSlug: "acme",
            token: "token",
          },
        },
      })
    )

    expect(redirect).toBeNull()
  })

  test("_auth/$slug redirects when the URL slug differs from the active org", async () => {
    const redirect = await captureRedirect(() =>
      runSlugBeforeLoad({
        context: {
          session: {
            userId: "user_1",
            orgId: "org_1",
            orgSlug: "acme",
            token: "token",
          },
        },
        params: { slug: "beta" },
      })
    )

    expect(redirect).toMatchObject({
      options: {
        to: "/$slug/tickets",
        params: { slug: "acme" },
        search: {},
      },
    })
  })

  test("_auth/$slug allows navigation when session state is valid", async () => {
    const redirect = await captureRedirect(() =>
      runSlugBeforeLoad({
        context: {
          session: {
            userId: "user_1",
            orgId: "org_1",
            orgSlug: "acme",
            token: "token",
          },
        },
        params: { slug: "acme" },
      })
    )

    expect(redirect).toBeNull()
  })
})
