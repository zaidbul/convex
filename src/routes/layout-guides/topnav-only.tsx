import { createFileRoute } from "@tanstack/react-router";
import { Menu, User } from "lucide-react";

import { DemoDashboardContent } from "@/components/layout-examples/demo-dashboard-content";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/layout-guides/topnav-only")({
  component: TopNavOnlyRoutePage,
});

function TopNavOnlyRoutePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface-low">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Button variant="outline" size="icon-sm">
            <Menu />
          </Button>
          <div className="font-medium">Top Navigation Shell</div>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm">
              Overview
            </Button>
            <Button variant="ghost" size="sm">
              Reports
            </Button>
            <Button variant="ghost" size="sm">
              Team
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <User />
            Account
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl">
        {/* TanStack Router <Outlet /> should render here. Keep this main slot unpadded. */}
        <div className="space-y-4 p-4">
          <DemoDashboardContent />
        </div>
      </main>
    </div>
  );
}
