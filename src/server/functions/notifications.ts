import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db/connection"
import {
  getUnreadNotificationCountForViewer,
  listNotificationsForViewer,
  listRecentNotificationsForViewer,
  markAllNotificationsAsReadForViewer,
  markNotificationAsReadForViewer,
  type NotificationFilterType,
  type NotificationScope,
} from "./notifications-data"
import { getViewerContext } from "./viewer-context"

export const listNotifications = createServerFn({ method: "GET" })
  .inputValidator(
    (data: {
      scope?: NotificationScope
      type?: NotificationFilterType
      limit?: number
      offset?: number
    }) => data,
  )
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listNotificationsForViewer(db, viewerContext, data)
  })

export const listRecentNotifications = createServerFn({ method: "GET" })
  .inputValidator((data: { limit?: number }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listRecentNotificationsForViewer(db, viewerContext, data)
  })

export const getUnreadNotificationCount = createServerFn({ method: "GET" }).handler(
  async () => {
    const viewerContext = await getViewerContext()
    return getUnreadNotificationCountForViewer(db, viewerContext)
  },
)

export const markNotificationAsRead = createServerFn({ method: "POST" })
  .inputValidator((data: { notificationId: string }) => data)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return markNotificationAsReadForViewer(db, viewerContext, data.notificationId)
  })

export const markAllNotificationsAsRead = createServerFn({ method: "POST" }).handler(
  async () => {
    const viewerContext = await getViewerContext()
    return markAllNotificationsAsReadForViewer(db, viewerContext)
  },
)
