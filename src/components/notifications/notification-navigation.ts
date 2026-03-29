import type { NavigateFn } from "@tanstack/react-router"
import type { NotificationItem } from "./notification-list"

export function navigateToNotification(
  navigate: NavigateFn,
  slug: string,
  notification: NotificationItem,
) {
  const teamSlug = notification.metadata.teamSlug

  if (!teamSlug) {
    return
  }

  if (notification.entityType === "issue") {
    navigate({
      to: "/$slug/tickets/$teamSlug/issue/$issueId",
      params: {
        slug,
        teamSlug,
        issueId: notification.entityId,
      },
    })
    return
  }

  navigate({
    to: "/$slug/tickets/$teamSlug/issues",
    params: {
      slug,
      teamSlug,
    },
    search: {
      filter: undefined,
    },
  })
}
