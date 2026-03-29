import { issueStatuses } from "@/db/schema"
import type { Issue, IssueStatus } from "./types"

export const boardColumns: IssueStatus[] = [...issueStatuses]

export function groupIssuesByStatus(
  issues: Issue[],
): Record<IssueStatus, Issue[]> {
  const grouped = Object.fromEntries(
    boardColumns.map((status) => [status, [] as Issue[]]),
  ) as Record<IssueStatus, Issue[]>

  for (const issue of issues) {
    grouped[issue.status].push(issue)
  }

  return grouped
}
