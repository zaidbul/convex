import { createFileRoute } from "@tanstack/react-router";
import { Bell, CreditCard, Shield, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/layout-guides/settings-sidebar")({
  component: SettingsSidebarRoutePage,
});

function SettingsSidebarRoutePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl gap-4 px-4 py-5 sm:px-6">
        <aside className="w-56 shrink-0 rounded-md bg-surface-high p-3">
          <p className="px-2 pb-3 text-xs font-medium text-on-surface-variant">Settings</p>
          <nav className="space-y-1">
            {[
              { label: "Profile", icon: User },
              { label: "Team", icon: Users },
              { label: "Security", icon: Shield },
              { label: "Billing", icon: CreditCard },
              { label: "Notifications", icon: Bell },
            ].map((item, index) => (
              <a
                key={item.label}
                href="#"
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
                  index === 0
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {/* TanStack Router <Outlet /> should render here. Keep this main slot unpadded. */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant">First name</label>
                    <Input defaultValue="Taylor" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant">Last name</label>
                    <Input defaultValue="Chen" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant">Email</label>
                  <Input defaultValue="taylor@example.com" type="email" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant">Username</label>
                  <Input defaultValue="taylorchen" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant">Bio</label>
                  <Input defaultValue="Product engineer at Acme Inc." />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how and when you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    label: "Email notifications",
                    desc: "Receive email for mentions and assignments",
                    enabled: true,
                  },
                  {
                    label: "Push notifications",
                    desc: "Browser push notifications for urgent items",
                    enabled: true,
                  },
                  {
                    label: "Weekly digest",
                    desc: "Summary of activity every Monday morning",
                    enabled: false,
                  },
                  {
                    label: "Marketing emails",
                    desc: "Product updates and feature announcements",
                    enabled: false,
                  },
                  {
                    label: "Security alerts",
                    desc: "Immediate notification for account security events",
                    enabled: true,
                  },
                ].map((pref) => (
                  <div
                    key={pref.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs font-medium">{pref.label}</p>
                      <p className="text-[10px] text-on-surface-variant">{pref.desc}</p>
                    </div>
                    <div
                      className={cn(
                        "h-5 w-9 rounded-full transition-colors",
                        pref.enabled ? "bg-primary" : "bg-surface-container",
                      )}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 translate-y-0.5 rounded-full bg-surface-lowest shadow-sm transition-transform",
                          pref.enabled ? "translate-x-4" : "translate-x-0.5",
                        )}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                  Manage third-party integrations linked to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "GitHub", status: "Connected", user: "@taylorchen" },
                  { name: "Google Workspace", status: "Connected", user: "taylor@example.com" },
                  { name: "Slack", status: "Not connected", user: null },
                  { name: "Linear", status: "Connected", user: "Taylor C." },
                  { name: "Figma", status: "Not connected", user: null },
                ].map((account) => (
                  <div
                    key={account.name}
                    className="flex items-center justify-between rounded-md bg-surface-high p-3"
                  >
                    <div>
                      <p className="text-xs font-medium">{account.name}</p>
                      <p className="text-[10px] text-on-surface-variant">
                        {account.user ?? "Click connect to link"}
                      </p>
                    </div>
                    <Button
                      variant={account.status === "Connected" ? "outline" : "default"}
                      size="sm"
                    >
                      {account.status === "Connected" ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible account actions. Proceed with caution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <div>
                    <p className="text-xs font-medium">Export account data</p>
                    <p className="text-[10px] text-on-surface-variant">
                      Download all your data as a ZIP archive.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <div>
                    <p className="text-xs font-medium">Delete account</p>
                    <p className="text-[10px] text-on-surface-variant">
                      Permanently remove your account and all data.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
