import { queryOptions } from "@tanstack/react-query"
import {
  getSavedView,
  getSavedViews,
  getWorkspace,
  getTeams,
  getProjects,
  getTeamBySlug,
  getCycles,
  getIssues,
  getIssueById,
  getIssueFavorite,
  getTeamMembers,
  getLabels,
  getIssueActivity,
  getIssueComments,
  getDashboardStats,
  getMyIssues,
  getActiveCycles,
} from "@/server/functions/tickets"
import type { IssueFilter, IssueQueryFilters } from "@/components/tickets/types"
import {
  getUnreadNotificationCount,
  listNotifications,
  listRecentNotifications,
} from "@/server/functions/notifications"

export const workspaceQueryOptions = () =>
  queryOptions({
    queryKey: ["workspace"],
    queryFn: () => getWorkspace(),
  })

export const teamsQueryOptions = () =>
  queryOptions({
    queryKey: ["teams"],
    queryFn: () => getTeams(),
  })

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  })

export const teamQueryOptions = (teamSlug: string) =>
  queryOptions({
    queryKey: ["team", teamSlug],
    queryFn: () => getTeamBySlug({ data: { teamSlug } }),
  })

export const cyclesQueryOptions = (teamSlug: string) =>
  queryOptions({
    queryKey: ["cycles", teamSlug],
    queryFn: () => getCycles({ data: { teamSlug } }),
  })

function normalizeIssueFilters(
  filters?: string | IssueFilter | IssueQueryFilters,
): IssueQueryFilters | undefined {
  if (!filters) {
    return undefined
  }

  if (typeof filters === "string") {
    return { presetFilter: filters as IssueFilter }
  }

  return filters
}

export const issuesQueryOptions = (
  teamSlug: string,
  filters?: string | IssueFilter | IssueQueryFilters,
) => {
  const normalizedFilters = normalizeIssueFilters(filters)

  return queryOptions({
    queryKey: ["issues", teamSlug, JSON.stringify(normalizedFilters ?? {})],
    queryFn: () => getIssues({ data: { teamSlug, filter: normalizedFilters } }),
  })
}

export const issueDetailQueryOptions = (issueId: string) =>
  queryOptions({
    queryKey: ["issue", issueId],
    queryFn: () => getIssueById({ data: { issueId } }),
    enabled: !!issueId,
  })

export const teamMembersQueryOptions = (teamId: string) =>
  queryOptions({
    queryKey: ["team-members", teamId],
    queryFn: () => getTeamMembers({ data: { teamId } }),
    enabled: !!teamId,
  })

export const labelsQueryOptions = () =>
  queryOptions({
    queryKey: ["labels"],
    queryFn: () => getLabels(),
  })

export const savedViewsQueryOptions = () =>
  queryOptions({
    queryKey: ["saved-views"],
    queryFn: () => getSavedViews(),
  })

export const savedViewQueryOptions = (viewId: string) =>
  queryOptions({
    queryKey: ["saved-view", viewId],
    queryFn: () => getSavedView({ data: { viewId } }),
    enabled: !!viewId,
  })

export const issueActivityQueryOptions = (issueId: string) =>
  queryOptions({
    queryKey: ["issue-activity", issueId],
    queryFn: () => getIssueActivity({ data: { issueId } }),
    enabled: !!issueId,
  })

export const issueCommentsQueryOptions = (issueId: string) =>
  queryOptions({
    queryKey: ["issue-comments", issueId],
    queryFn: () => getIssueComments({ data: { issueId } }),
    enabled: !!issueId,
  })

export const issueFavoriteQueryOptions = (issueId: string) =>
  queryOptions({
    queryKey: ["issue-favorite", issueId],
    queryFn: () => getIssueFavorite({ data: { issueId } }),
    enabled: !!issueId,
  })

export const notificationsQueryOptions = (input?: {
  scope?: "all" | "unread"
  type?: "all" | "assignment" | "status" | "comment" | "mention" | "cycle"
  limit?: number
  offset?: number
}) =>
  queryOptions({
    queryKey: [
      "notifications",
      input?.scope ?? "all",
      input?.type ?? "all",
      input?.limit ?? 25,
      input?.offset ?? 0,
    ],
    queryFn: () => listNotifications({ data: input ?? {} }),
    refetchInterval: 30_000,
  })

export const recentNotificationsQueryOptions = (limit = 10) =>
  queryOptions({
    queryKey: ["notifications", "recent", limit],
    queryFn: () => listRecentNotifications({ data: { limit } }),
    refetchInterval: 30_000,
  })

export const unreadNotificationCountQueryOptions = () =>
  queryOptions({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => getUnreadNotificationCount(),
    refetchInterval: 15_000,
  })

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export const dashboardStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
  })

export const myIssuesQueryOptions = (limit = 20) =>
  queryOptions({
    queryKey: ["my-issues", limit],
    queryFn: () => getMyIssues({ data: { limit } }),
  })

export const activeCyclesQueryOptions = () =>
  queryOptions({
    queryKey: ["active-cycles"],
    queryFn: () => getActiveCycles(),
  })
