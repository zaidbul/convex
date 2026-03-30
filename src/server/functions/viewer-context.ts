import type { ViewerContext } from "./tickets-data"

export async function getViewerContext(): Promise<ViewerContext> {
  return { userId: "demo-user-001", workspaceId: "demo-workspace-001" }
}
