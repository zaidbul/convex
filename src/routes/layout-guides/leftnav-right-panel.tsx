import { createFileRoute } from "@tanstack/react-router";
import { Calendar, FolderKanban, Home, LineChart, Users } from "lucide-react";

import { DemoDashboardContent } from "@/components/layout-examples/demo-dashboard-content";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/layout-guides/leftnav-right-panel")({
  component: LeftNavRightPanelRoutePage,
});

const sidebarItems = [
  { title: "Overview", icon: Home },
  { title: "Projects", icon: FolderKanban },
  { title: "Calendar", icon: Calendar },
  { title: "Reports", icon: LineChart },
  { title: "Team", icon: Users },
];

function LeftNavRightPanelRoutePage() {
  return (
    <div className="h-svh overflow-hidden bg-background">
      <div className="grid h-full grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="sticky top-0 h-svh overflow-y-auto bg-surface-low p-3">
          <p className="px-2 pb-3 text-xs font-medium text-on-surface-variant">Navigator</p>
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <a
                key={item.title}
                href="#"
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
                  index === 0
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.title}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 overflow-y-auto">
          {/* TanStack Router <Outlet /> should render here. Keep this main slot unpadded. */}
          <div className="space-y-4 p-4">
            <DemoDashboardContent />
          </div>
        </main>

        <aside className="sticky top-0 hidden h-svh overflow-y-auto bg-surface-low p-3 xl:block">
          <p className="px-2 pb-3 text-xs font-medium text-on-surface-variant">Context</p>
          <div className="space-y-2">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Properties</CardTitle>
              </CardHeader>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Related Items</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
