import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mainCards = [
  { title: "Revenue", value: "$124,000", delta: "+7.2% this month" },
  { title: "Active Users", value: "8,421", delta: "+2.1% this week" },
  { title: "Conversion", value: "4.8%", delta: "+0.3% today" },
  { title: "Open Tickets", value: "27", delta: "-5 resolved" },
];

const activityItems = [
  { user: "Sarah Chen", action: "deployed v2.4.1 to production", time: "2 min ago" },
  { user: "James Wilson", action: "merged PR #847 — Fix auth token refresh", time: "15 min ago" },
  { user: "Maria Garcia", action: "commented on issue #312", time: "32 min ago" },
  { user: "Alex Kumar", action: "created branch feature/user-export", time: "1h ago" },
  { user: "Emily Park", action: "updated project roadmap for Q2", time: "1h ago" },
  { user: "David Lee", action: "resolved 3 Sentry issues in billing module", time: "2h ago" },
  { user: "Nina Patel", action: "added new test suite for API endpoints", time: "2h ago" },
  { user: "Tom Anderson", action: "updated database migration scripts", time: "3h ago" },
  { user: "Lisa Zhang", action: "published documentation for v2.4", time: "3h ago" },
  { user: "Ryan O'Brien", action: "rotated production API keys", time: "4h ago" },
];

const recentProjects = [
  { name: "Dashboard Redesign", status: "In Progress", progress: 72, members: 5 },
  { name: "API v3 Migration", status: "Planning", progress: 15, members: 3 },
  { name: "Mobile App Launch", status: "In Progress", progress: 48, members: 8 },
  { name: "Security Audit", status: "Review", progress: 90, members: 2 },
  { name: "Data Pipeline Refactor", status: "In Progress", progress: 35, members: 4 },
  { name: "Customer Portal", status: "Planning", progress: 5, members: 6 },
];

const chartPlaceholderRows = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 45 },
  { month: "Apr", value: 73 },
  { month: "May", value: 64 },
  { month: "Jun", value: 81 },
  { month: "Jul", value: 76 },
  { month: "Aug", value: 92 },
  { month: "Sep", value: 85 },
  { month: "Oct", value: 88 },
  { month: "Nov", value: 79 },
  { month: "Dec", value: 95 },
];

export function DemoDashboardContent() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {mainCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle>{card.value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-on-surface-variant">{card.delta}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
          <CardDescription>
            Revenue trend across the year with month-over-month growth indicators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            {chartPlaceholderRows.map((row) => (
              <div key={row.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/20"
                  style={{ height: `${row.value * 1.5}px` }}
                />
                <span className="text-[10px] text-on-surface-variant">{row.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions from your team across all projects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityItems.map((item) => (
              <div
                key={item.time}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">{item.user}</p>
                  <p className="truncate text-xs text-on-surface-variant">{item.action}</p>
                </div>
                <span className="shrink-0 text-[10px] text-on-surface-variant">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Current sprint progress across teams.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{project.name}</span>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full bg-primary/60"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant">
                  {project.progress}% complete · {project.members} members
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Infrastructure Overview</CardTitle>
          <CardDescription>
            System health and resource utilization metrics for all environments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "API Gateway", cpu: "34%", memory: "62%", status: "Healthy" },
              { name: "Auth Service", cpu: "12%", memory: "45%", status: "Healthy" },
              { name: "Worker Pool", cpu: "78%", memory: "81%", status: "Warning" },
              { name: "Database Primary", cpu: "45%", memory: "72%", status: "Healthy" },
              { name: "Database Replica", cpu: "22%", memory: "68%", status: "Healthy" },
              { name: "Cache Layer", cpu: "56%", memory: "88%", status: "Warning" },
            ].map((service) => (
              <div key={service.name} className="rounded-md bg-surface-high p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{service.name}</span>
                  <Badge variant={service.status === "Healthy" ? "secondary" : "outline"}>
                    {service.status}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-on-surface-variant">
                  <span>CPU: {service.cpu}</span>
                  <span>RAM: {service.memory}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deployments</CardTitle>
          <CardDescription>Scheduled releases for the next two weeks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { version: "v2.5.0", date: "Mar 3, 2026", env: "Production", changes: 14 },
            { version: "v2.5.1-rc.1", date: "Mar 5, 2026", env: "Staging", changes: 6 },
            { version: "v2.6.0-alpha", date: "Mar 10, 2026", env: "Development", changes: 23 },
            { version: "v2.5.2", date: "Mar 12, 2026", env: "Production", changes: 3 },
            { version: "v3.0.0-beta.1", date: "Mar 15, 2026", env: "Staging", changes: 47 },
          ].map((deploy) => (
            <div
              key={deploy.version}
              className="flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs font-medium">{deploy.version}</p>
                <p className="text-[10px] text-on-surface-variant">
                  {deploy.changes} changes · {deploy.env}
                </p>
              </div>
              <span className="text-xs text-on-surface-variant">{deploy.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
