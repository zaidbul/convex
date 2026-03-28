import { queryOptions } from "@tanstack/react-query"
import {
  getWorkspace,
  getTeams,
  getTeamBySlug,
  getCycles,
  getIssues,
  getIssueById,
} from "@/server/functions/tickets"

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

export const issuesQueryOptions = (teamSlug: string, filter?: string) =>
  queryOptions({
    queryKey: ["issues", teamSlug, filter ?? "all"],
    queryFn: () => getIssues({ data: { teamSlug, filter } }),
  })

export const issueDetailQueryOptions = (issueId: string) =>
  queryOptions({
    queryKey: ["issue", issueId],
    queryFn: () => getIssueById({ data: { issueId } }),
    enabled: !!issueId,
  })
