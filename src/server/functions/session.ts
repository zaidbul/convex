import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"

export const $fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { userId, orgId, orgSlug, getToken } = await auth()

    let token = null
    if (userId) {
      try {
        token = await getToken()
      } catch {
        // Ignore token-fetch errors; downstream requests will behave as unauthenticated.
      }
    }

    return {
      userId: userId ?? null,
      orgId: orgId ?? null,
      orgSlug: orgSlug ?? null,
      token,
    }
  } catch {
    return { userId: null, orgId: null, orgSlug: null, token: null }
  }
})
