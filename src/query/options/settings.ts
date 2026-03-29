import { queryOptions } from "@tanstack/react-query"
import { getWorkspaceMembers, getTeamsWithStats } from "@/server/functions/settings"

export const workspaceMembersQueryOptions = () =>
  queryOptions({
    queryKey: ["workspace-members"],
    queryFn: () => getWorkspaceMembers(),
  })

export const teamsWithStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["teams-with-stats"],
    queryFn: () => getTeamsWithStats(),
  })
