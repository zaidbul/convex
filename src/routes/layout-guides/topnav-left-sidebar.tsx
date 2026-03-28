import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Search,
  User,
  Calendar,
  FolderKanban,
  Home,
  LineChart,
  Users,
} from "lucide-react";

import { DemoDashboardContent } from "@/components/layout-examples/demo-dashboard-content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/layout-guides/topnav-left-sidebar")({
  component: TopNavLeftSidebarRoutePage,
});

const sidebarItems = [
  { title: "Overview", icon: Home },
  { title: "Projects", icon: FolderKanban },
  { title: "Calendar", icon: Calendar },
  { title: "Reports", icon: LineChart },
  { title: "Team", icon: Users },
];

function TopNavLeftSidebarRoutePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface-low">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2 font-medium">
            <LayoutDashboard className="h-4 w-4" />
            App Suite
          </div>
          <nav className="hidden items-center gap-4 text-xs text-on-surface-variant md:flex">
            <a href="#">Products</a>
            <a href="#">Analytics</a>
            <a href="#">Billing</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search />
              Search
            </Button>
            <Button variant="outline" size="icon-sm">
              <User />
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-4 sm:px-6">
        <aside className="hidden w-60 shrink-0 rounded-md bg-surface-high p-3 md:block">
          <p className="px-2 pb-2 text-xs font-medium text-on-surface-variant">Workspace</p>
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
        <main className="flex-1">
          {/* TanStack Router <Outlet /> should render here. Keep this main slot unpadded. */}
          <div className="space-y-4">
            <DemoDashboardContent />
          </div>
        </main>
      </div>
    </div>
  );
}
