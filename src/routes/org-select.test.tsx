// @vitest-environment jsdom

import { describe, expect, test } from "vitest"

import { Route as OrgSelectRoute } from "./org-select"

type RedirectLike = { to?: string; params?: Record<string, string> }

async function captureRedirect(fn: () => unknown | Promise<unknown>) {
  try {
    await fn()
    return null
  } catch (error) {
    return error as RedirectLike
  }
}

describe("OrgSelectRoute", () => {
  test("beforeLoad redirects to the demo dashboard", async () => {
    const redirect = await captureRedirect(() =>
      (OrgSelectRoute as unknown as { options: { beforeLoad: () => void } }).options.beforeLoad()
    )

    expect(redirect).toMatchObject({
      options: {
        to: "/$slug/tickets/dashboard",
        params: { slug: "acme-corp" },
      },
    })
  })
})
