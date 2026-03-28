import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Calendar,
  File,
  FolderKanban,
  Home,
  LayoutDashboard,
  LineChart,
  User,
  Users,
} from "lucide-react";

import { DemoDashboardContent } from "@/components/layout-examples/demo-dashboard-content";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/layout-guides/sidebar-right")({
  component: SidebarRightRoutePage,
});

const sidebarItems = [
  { title: "Overview", icon: Home, active: true },
  { title: "Projects", icon: FolderKanban, active: false },
  { title: "Calendar", icon: Calendar, active: false },
  { title: "Reports", icon: LineChart, active: false },
  { title: "Team", icon: Users, active: false },
];

function SidebarRightRoutePage() {
  return (
    <SidebarProvider>
      <main className="bg-background relative flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 bg-surface/80 backdrop-blur-[20px] px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Example workspace</span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell />
              Alerts
            </Button>
            <Button size="sm">
              <File />
              New report
            </Button>
          </div>
        </header>

        {/* TanStack Router <Outlet /> should render here. Keep this main slot unpadded. */}
        <div className="space-y-4 p-4">
          <DemoDashboardContent />
        </div>
      </main>

      <Sidebar side="right" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" isActive>
                <LayoutDashboard />
                <span>Template Layouts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <User />
                <span>Demo User</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
