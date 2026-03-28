import { Bell, CheckSquare, LifeBuoy, List, Mail, Search, Settings, User } from "lucide-react";

export function LayoutPatternLegend() {
  return (
    <div className="grid gap-3 text-xs text-on-surface-variant md:grid-cols-3">
      <div className="rounded-md bg-surface-high p-3">
        <p className="font-medium text-foreground">Sidebar Patterns</p>
        <p className="mt-1">
          Use for productivity apps with dense navigation and frequent context switches.
        </p>
      </div>
      <div className="rounded-md bg-surface-high p-3">
        <p className="font-medium text-foreground">Hybrid / Workspace</p>
        <p className="mt-1">
          Use when users need global nav plus deep workspace-specific structure.
        </p>
      </div>
      <div className="rounded-md bg-surface-high p-3">
        <p className="font-medium text-foreground">Specialized</p>
        <p className="mt-1">
          Focused shells for auth, settings, data tables, and marketing experiences.
        </p>
      </div>
    </div>
  );
}

export const layoutPatternChecks = [
  { label: "Navigation depth", icon: List },
  { label: "Global controls", icon: CheckSquare },
  { label: "Search and filtering", icon: Search },
  { label: "Account surfaces", icon: User },
  { label: "Notifications", icon: Bell },
  { label: "Support links", icon: LifeBuoy },
  { label: "Settings and billing", icon: Settings },
  { label: "Communication", icon: Mail },
] as const;
