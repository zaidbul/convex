import { auth, clerkClient } from "@clerk/tanstack-react-start/server"
import { db } from "@/db/connection"
import { syncViewerContext } from "./tickets-data"

export async function getViewerContext() {
  const authState = await auth()

  if (!authState.userId) {
    throw new Error("Unauthorized")
  }

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
