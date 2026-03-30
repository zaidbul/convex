// @vitest-environment jsdom

import { describe, expect, test } from "vitest"

import { Route as SignInRoute } from "./sign-in/index"
import { Route as SignUpRoute } from "./sign-up"

type RedirectLike = { to?: string; params?: Record<string, string> }

async function captureRedirect(fn: () => unknown | Promise<unknown>) {
  try {
    await fn()
    return null
  } catch (error) {
    return error as RedirectLike
  }
}

describe("auth entry routes", () => {
  test("sign-in beforeLoad redirects to the demo dashboard", async () => {
    const redirect = await captureRedirect(() =>
      (SignInRoute as unknown as { options: { beforeLoad: () => void } }).options.beforeLoad()
    )

    expect(redirect).toMatchObject({
      options: {
        to: "/$slug/tickets/dashboard",
        params: { slug: "acme-corp" },
      },
    })
  })

  test("sign-up beforeLoad redirects to the demo dashboard", async () => {
    const redirect = await captureRedirect(() =>
      (SignUpRoute as unknown as { options: { beforeLoad: () => void } }).options.beforeLoad()
    )

    expect(redirect).toMatchObject({
      options: {
        to: "/$slug/tickets/dashboard",
        params: { slug: "acme-corp" },
      },
    })
  })
})
