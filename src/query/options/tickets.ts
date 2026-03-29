import { queryOptions } from "@tanstack/react-query"
import {
  getWorkspace,
  getTeams,
  getTeamBySlug,
  getCycles,
  getIssues,
  getIssueById,
  getTeamMembers,
  getLabels,
  getIssueActivity,
  getIssueComments,
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
