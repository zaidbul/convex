import { queryOptions } from "@tanstack/react-query"
import { $fetchClerkAuth } from "@/server/functions/session"

export const sessionQuery = queryOptions({
  queryKey: ["session"],
  queryFn: () => $fetchClerkAuth(),
  staleTime: 1000 * 60 * 5, // 5 minutes
})
