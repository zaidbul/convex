import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/layout-guides/master-detail")({
  component: MasterDetailRoutePage,
});

function MasterDetailRoutePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:grid-cols-[300px_1fr] sm:px-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-surface-low rounded-t-md">
            <CardTitle>Items</CardTitle>
            <CardDescription>Choose a record from the list.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 p-0">
            {Array.from({ length: 20 }).map((_, index) => (
              <button
                key={`item-${index}`}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-left text-xs transition-colors",
                  index === 0 ? "bg-primary/5" : "hover:bg-surface-container",
                )}
              >
                <div>
                  <span className="font-medium">TKT-{1000 + index}</span>
                  <p className="text-[10px] text-on-surface-variant">
                    {
                      [
                        "Fix login timeout",
                        "Update billing page",
                        "Add export CSV",
                        "Refactor auth flow",
                        "Improve search UX",
                        "Add dark mode toggle",
                        "Fix mobile layout",
                        "Update onboarding",
                        "API rate limiting",
                        "Migrate to v3 SDK",
                        "Add 2FA support",
                        "Fix email templates",
                        "Cache invalidation",
                        "Add audit logging",
                        "Improve perf",
                        "Fix date parsing",
                        "Add webhooks",
                        "SSO integration",
                        "Fix pagination",
                        "Add bulk actions",
                      ][index]
                    }
                  </p>
                </div>
                <Badge variant={index % 3 === 0 ? "secondary" : "outline"}>
                  {index % 3 === 0 ? "Done" : index % 3 === 1 ? "Open" : "Review"}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        <div>
          {/* TanStack Router <Outlet /> should render here for the detail pane. Keep this slot unpadded. */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>TKT-1000 — Fix login timeout</CardTitle>
                <CardDescription>
                  Users are being logged out after 5 minutes of inactivity instead of the expected
                  30 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 lg:grid-cols-3">
                  <div className="rounded-md bg-surface-high p-3">
                    <p className="text-[10px] text-on-surface-variant">Status</p>
                    <p className="text-xs font-medium">In Progress</p>
                  </div>
                  <div className="rounded-md bg-surface-high p-3">
                    <p className="text-[10px] text-on-surface-variant">Assignee</p>
                    <p className="text-xs font-medium">Sarah Chen</p>
                  </div>
                  <div className="rounded-md bg-surface-high p-3">
                    <p className="text-[10px] text-on-surface-variant">Priority</p>
                    <p className="text-xs font-medium">High</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-on-surface-variant space-y-3">
                <p>
                  The session timeout is currently hardcoded to 5 minutes in the auth middleware.
                  This needs to be updated to read from the environment configuration where it's set
                  to 30 minutes.
                </p>
                <p>
                  Root cause: The recent refactor of the auth module introduced a new middleware
                  chain that bypasses the config loader. The timeout value is being pulled from the
                  default config instead of the environment-specific override.
                </p>
                <p>Steps to reproduce:</p>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>Log in to the application</li>
                  <li>Leave the browser idle for 6 minutes</li>
                  <li>Attempt any action — user is redirected to login</li>
                  <li>Expected: Session should remain active for 30 minutes</li>
                </ol>
                <p>Acceptance criteria:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Session timeout reads from environment config</li>
                  <li>Default timeout remains 30 minutes when no config is set</li>
                  <li>Add integration test for session expiry</li>
                  <li>Update documentation for auth middleware chain</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    user: "Sarah Chen",
                    action: "changed status from Open to In Progress",
                    time: "2h ago",
                  },
                  {
                    user: "James Wilson",
                    action: "added comment: 'I can reproduce this consistently'",
                    time: "3h ago",
                  },
                  { user: "Sarah Chen", action: "assigned themselves", time: "3h ago" },
                  { user: "Alex Kumar", action: "set priority to High", time: "4h ago" },
                  { user: "Emily Park", action: "created this ticket", time: "5h ago" },
                  { user: "Emily Park", action: "added label: authentication", time: "5h ago" },
                  { user: "Bot", action: "linked to PR #831", time: "1h ago" },
                  {
                    user: "Sarah Chen",
                    action: "pushed 2 commits to fix/login-timeout",
                    time: "45 min ago",
                  },
                ].map((item, index) => (
                  <div
                    key={`activity-${index}`}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">{item.user}</p>
                      <p className="text-xs text-on-surface-variant">{item.action}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-on-surface-variant">{item.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: "TKT-987", title: "Auth middleware refactor", relation: "Caused by" },
                  { id: "TKT-1012", title: "Add session refresh endpoint", relation: "Blocks" },
                  { id: "TKT-1005", title: "Update auth documentation", relation: "Related" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md bg-surface-high px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-medium">{item.id}</p>
                      <p className="text-[10px] text-on-surface-variant">{item.title}</p>
                    </div>
                    <Badge variant="outline">{item.relation}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
