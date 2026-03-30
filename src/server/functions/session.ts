import { createServerFn } from "@tanstack/react-start"

export const $fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  return {
    userId: "demo-user-001",
    orgId: "demo-workspace-001",
    orgSlug: "acme-corp",
    token: "demo-token",
  }
})
