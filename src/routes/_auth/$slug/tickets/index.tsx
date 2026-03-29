import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { Bell } from "lucide-react"
import { NotificationList, notificationTypeOptions } from "@/components/notifications/notification-list"
import { navigateToNotification } from "@/components/notifications/notification-navigation"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/query/mutations/tickets"
import { notificationsQueryOptions } from "@/query/options/tickets"

const PAGE_SIZE = 25
type InboxSearch = {
  scope?: "unread"
  type?: "assignment" | "status" | "comment" | "mention" | "cycle"
  page?: number
}

export const Route = createFileRoute("/_auth/$slug/tickets/")({
  validateSearch: (search: Record<string, unknown>): InboxSearch => ({
    scope: search.scope === "unread" ? "unread" : undefined,
    type:
      typeof search.type === "string" &&
      ["assignment", "status", "comment", "mention", "cycle"].includes(search.type)
        ? (search.type as "assignment" | "status" | "comment" | "mention" | "cycle")
        : undefined,
    page:
      typeof search.page === "number"
        ? Math.max(1, search.page)
        : typeof search.page === "string"
          ? Math.max(1, Number.parseInt(search.page, 10) || 1)
          : undefined,
  }),
  loader: async ({ context, location }) => {
    const search = location.search as InboxSearch
    const scope = search.scope ?? "all"
    const type = search.type ?? "all"
    const page = search.page ?? 1

    await context.queryClient.ensureQueryData(
      notificationsQueryOptions({
        scope,
        type,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      }),
    )
  },
  component: NotificationsInboxPage,
})

function NotificationsInboxPage() {
  const { slug } = Route.useParams()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const scope = search.scope ?? "all"
  const type = search.type ?? "all"
  const page = search.page ?? 1
  const markAsRead = useMarkNotificationAsReadMutation()
  const markAllAsRead = useMarkAllNotificationsAsReadMutation()
  const { data } = useQuery(
    notificationsQueryOptions({
      scope,
      type,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
  )

  const notifications = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasUnread = notifications.some((notification) => !notification.readAt)

  return (
    <div className="flex h-screen flex-col bg-surface-low">
      <div className="border-b border-outline-variant/15 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Inbox</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Assignments, mentions, comments, and status changes.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => markAllAsRead.mutate()}
            disabled={!hasUnread || markAllAsRead.isPending}
          >
            Mark all read
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-6 py-5">
        <Tabs
          value={scope}
          onValueChange={(value) => {
            navigate({
              search: (prev) => ({
                ...prev,
                scope: value === "unread" ? "unread" : undefined,
                page: undefined,
              }),
            })
          }}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          {notificationTypeOptions.map((option) => (
            <Button
              key={option.value}
              variant={type === option.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    type: option.value === "all" ? undefined : option.value,
                    page: undefined,
                  }),
                })
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {total === 0 ? (
          <Empty className="max-w-xl border-outline-variant/20 bg-surface px-8 py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell />
              </EmptyMedia>
              <EmptyTitle>No notifications yet</EmptyTitle>
              <EmptyDescription>
                Activity across your teams will show up here once people start assigning, commenting,
                mentioning, and moving work.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <NotificationList
              notifications={notifications}
              emptyMessage="No notifications match the current filters."
              onMarkAsRead={(notificationId) => markAsRead.mutate({ notificationId })}
              onSelect={(notification) => {
                if (!notification.readAt) {
                  markAsRead.mutate({ notificationId: notification.id })
                }
                navigateToNotification(navigate, slug, notification)
              }}
            />

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        page: Math.max(1, page - 1),
                      }),
                    })
                  }}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        page: Math.min(totalPages, page + 1),
                      }),
                    })
                  }}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
