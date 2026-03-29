import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db/connection"
import {
  getUnreadNotificationCountForViewer,
  listNotificationsForViewer,
  listRecentNotificationsForViewer,
  markAllNotificationsAsReadForViewer,
  markNotificationAsReadForViewer,
} from "./notifications-data"
import { getViewerContext } from "./viewer-context"
import {
  listNotificationsSchema,
  listRecentNotificationsSchema,
  markNotificationAsReadSchema,
} from "./validation-schemas"

export const listNotifications = createServerFn({ method: "GET" })
  .inputValidator(listNotificationsSchema)
  .handler(async ({ data }) => {
    const viewerContext = await getViewerContext()
    return listNotificationsForViewer(db, viewerContext, data)
  })

export const listRecentNotifications = createServerFn({ method: "GET" })
  .inputValidator(listRecentNotificationsSchema)
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
  .inputValidator(markNotificationAsReadSchema)
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
