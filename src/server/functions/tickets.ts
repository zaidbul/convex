import { createServerFn } from "@tanstack/react-start"
import { auth, clerkClient } from "@clerk/tanstack-react-start/server"
import { db } from "@/db/connection"
import type { IssuePriority, IssueStatus } from "@/components/tickets/types"
import {
  createIssueForViewer,
  getAccessibleTeamBySlug,
  getIssueByIdForViewer,
  getWorkspaceForViewer,
  listCyclesForViewerTeam,
  listIssuesForViewerTeam,
  listTeamsForViewer,
  syncViewerContext,
} from "./tickets-data"

async function getViewerContext() {
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

export const getWorkspace = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return getWorkspaceForViewer(db, viewerContext)
})

export const getTeams = createServerFn({ method: "GET" }).handler(async () => {
  const viewerContext = await getViewerContext()
  return listTeamsForViewer(db, viewerContext)
})

export const getTeamBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { teamSlug: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    const team = await getAccessibleTeamBySlug(db, viewerContext, data.teamSlug)

    if (!team) {
      throw new Error(`Team not found: ${data.teamSlug}`)
    }

    return team
  })

export const getCycles = createServerFn({ method: "GET" })
  .inputValidator((data: { teamSlug: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listCyclesForViewerTeam(db, viewerContext, data.teamSlug)
  })

export const getIssues = createServerFn({ method: "GET" })
  .inputValidator((data: { teamSlug: string; filter?: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listIssuesForViewerTeam(db, viewerContext, data.teamSlug, data.filter)
  })

export const createIssue = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      teamId: string
      title: string
      description?: string
      status?: string
      priority?: string
    }) => data
  )
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return createIssueForViewer(db, viewerContext, {
      teamId: data.teamId,
      title: data.title,
      description: data.description,
      status: (data.status ?? "backlog") as IssueStatus,
      priority: (data.priority ?? "none") as IssuePriority,
    })
  })

export const getIssueById = createServerFn({ method: "GET" })
  .inputValidator((data: { issueId: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return getIssueByIdForViewer(db, viewerContext, data.issueId)
  })
