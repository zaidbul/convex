import { useNavigate } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  NotificationList,
  type NotificationItem,
} from "@/components/notifications/notification-list"

interface DashboardActivityFeedProps {
  notifications: NotificationItem[]
  slug: string
}

export function DashboardActivityFeed({
  notifications,
  slug,
}: DashboardActivityFeedProps) {
  const navigate = useNavigate()

  function handleSelect(notification: NotificationItem) {
    if (
      notification.entityType === "issue" &&
      notification.metadata.teamSlug
    ) {
      navigate({
        to: "/$slug/tickets/$teamSlug/issue/$issueId",
        params: {
          slug,
          teamSlug: notification.metadata.teamSlug,
          issueId: notification.entityId,
        },
      })
    }
  }

  return (
    <Card className="border-outline-variant/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationList
          notifications={notifications}
          compact
          emptyMessage="No recent activity"
          onSelect={handleSelect}
        />
      </CardContent>
    </Card>
  )
}
