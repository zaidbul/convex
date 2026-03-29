import { auth, clerkClient } from "@clerk/tanstack-react-start/server"
import { eq, and } from "drizzle-orm"
import { db } from "@/db/connection"
import * as schema from "@/db/schema"
import { syncViewerContext, type ViewerContext } from "./tickets-data"

/**
 * Fast path: resolve the viewer from the local DB without calling Clerk APIs.
 *
 * On every request, `getViewerContext` needs to know the current user's ID and
 * their active workspace. The naive approach (and the original implementation)
 * calls `clerkClient().users.getUser()` and `clerkClient().organizations.getOrganization()`
 * on every request, adding 400-800ms of Clerk API latency before the actual
 * database query even starts.
 *
 * Once a user has been synced at least once (via `syncViewerContext`), their
 * record and workspace membership already exist in the local DB. This function
 * checks for that — two fast indexed lookups — and returns the ViewerContext
 * immediately, skipping the Clerk network calls entirely.
 *
 * Returns `null` when the user or membership hasn't been synced yet, which
 * causes `getViewerContext` to fall through to the full Clerk sync path.
 *
 * Note: because we skip the sync, profile changes in Clerk (name, avatar) won't
 * propagate until the user triggers a full sync (e.g. new org, cleared DB, or a
 * future background sync/webhook).
 */
async function tryFastViewerContext(
  userId: string,
  orgId: string | null
): Promise<ViewerContext | null> {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  })
  if (!user) return null

  if (!orgId) {
    return { userId, workspaceId: null }
  }

  const membership = await db.query.workspaceMemberships.findFirst({
    where: and(
      eq(schema.workspaceMemberships.workspaceId, orgId),
      eq(schema.workspaceMemberships.userId, userId)
    ),
  })
  if (!membership) return null

  return { userId, workspaceId: orgId }
}

/**
 * Resolves the authenticated viewer's context (userId + workspaceId).
 *
 * Uses a two-tier strategy:
 *  1. **Fast path** — `auth()` validates the JWT (no network call), then
 *     `tryFastViewerContext` checks if the user/workspace are already in the
 *     local DB. If so, returns immediately (~5-10ms).
 *  2. **Slow path** — If the local lookup misses (first login, new org), falls
 *     back to fetching the full user and org objects from Clerk's API and runs
 *     `syncViewerContext` to upsert them locally. Subsequent requests will then
 *     hit the fast path.
 */
export async function getViewerContext() {
  const authState = await auth()

  if (!authState.userId) {
    throw new Error("Unauthorized")
  }

  const cached = await tryFastViewerContext(
    authState.userId,
    authState.orgId ?? null
  )
  if (cached) return cached

  const client = clerkClient()
  const [clerkUser, organization] = await Promise.all([
    client.users.getUser(authState.userId),
    authState.orgId
      ? client.organizations.getOrganization({ organizationId: authState.orgId })
      : Promise.resolve(null),
  ])

  return syncViewerContext(db, {
    auth: {
      userId: authState.userId,
      orgId: authState.orgId ?? null,
      orgRole: authState.orgRole ?? null,
      orgSlug: authState.orgSlug ?? null,
    },
    clerkUser,
    organization: organization
      ? {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        }
      : null,
  })
}
