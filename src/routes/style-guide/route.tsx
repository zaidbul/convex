import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { Palette } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide")({
  component: StyleGuideLayout,
});

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

const themePages = [
  { path: "/style-guide", label: "Theme & Basics" },
  { path: "/style-guide/featured", label: "Featured & Heroes" },
];

const componentShowcases = [
  { path: "/style-guide/data-entry", label: "Data Entry & Forms" },
  { path: "/style-guide/search-filter", label: "Search & Filters" },
  { path: "/style-guide/date-time", label: "Date & Time" },
  { path: "/style-guide/scheduling", label: "Scheduling & Calendars" },
  { path: "/style-guide/command-palette", label: "Command Palette" },
  { path: "/style-guide/navigation", label: "Navigation" },
  { path: "/style-guide/sheets", label: "Sheets & Drawers" },
  { path: "/style-guide/empty-states", label: "Empty States" },
];

const patternPages = [
  { path: "/layout-guides", label: "Layout Guides" },
  { path: "/style-guide/auth", label: "Authentication" },
  { path: "/style-guide/landing", label: "Landing Page" },
  { path: "/style-guide/dashboard", label: "Dashboard" },
  { path: "/style-guide/charts", label: "Charts & Data Viz" },
  { path: "/style-guide/realtime", label: "Real-time Updates" },
  { path: "/style-guide/chat", label: "Chat & Messaging" },
  { path: "/style-guide/media", label: "Media & Files" },
  { path: "/style-guide/blog", label: "Blog & Editorial" },
  { path: "/style-guide/settings", label: "Settings" },
  { path: "/style-guide/pricing", label: "Pricing" },
  { path: "/style-guide/onboarding", label: "Onboarding" },
  { path: "/style-guide/wizards", label: "Wizards & Flows" },
];

// ============================================================================
// LAYOUT COMPONENT
// ============================================================================

function StyleGuideLayout() {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname || "";
  const isIndex = currentPath === "/style-guide" || currentPath === "/style-guide/";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Fixed Sidebar */}
      <aside className="w-56 bg-surface-low flex flex-col shrink-0 sticky top-0 h-screen overflow-hidden">
        {/* Header - Just a title, not a link */}
        <div className="p-4 bg-surface-container">
          <div className="flex items-center gap-2 text-sm font-display font-semibold">
            <Palette className="h-4 w-4" />
            Style Guide
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 min-h-0">
          <nav className="p-4 space-y-6">
            {/* Theme / Basics */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Theme
              </h3>
              <div className="space-y-0.5">
                {themePages.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block px-2 py-1.5 text-sm rounded-md transition-colors",
                      isIndex && item.path === "/style-guide"
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-container",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Component Showcases */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Components
              </h3>
              <div className="space-y-0.5">
                {componentShowcases.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block px-2 py-1.5 text-sm rounded-md transition-colors",
                      currentPath === item.path
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-container",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Pattern Pages */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Patterns
              </h3>
              <div className="space-y-0.5">
                {patternPages.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block px-2 py-1.5 text-sm rounded-md transition-colors",
                      currentPath === item.path
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-container",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 bg-surface-container flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
