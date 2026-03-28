import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  CreditCard,
  Globe,
  Key,
  Laptop,
  Lock,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Palette,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/settings")({
  component: SettingsPage,
});

// ============================================================================
// SETTING ROW COMPONENT - Linear-style layout with container queries
// ============================================================================

function SettingRow({
  label,
  description,
  children,
  className,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("@container", "py-4 first:pt-0 last:pb-0", className)}>
      <div className="flex flex-col gap-3 @sm:flex-row @sm:items-start @sm:justify-between @sm:gap-8">
        {/* Label side */}
        <div className="@sm:w-[45%] @sm:shrink-0">
          <Label className="text-sm font-medium">{label}</Label>
          {description && <p className="text-sm text-on-surface-variant mt-0.5">{description}</p>}
        </div>
        {/* Input side */}
        <div className="@sm:flex-1 @sm:max-w-sm">{children}</div>
      </div>
    </div>
  );
}

// ============================================================================
// SETTING SECTION COMPONENT
// ============================================================================

function SettingSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription className="mt-0.5">{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">{children}</div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SESSION ITEM COMPONENT
// ============================================================================

function SessionItem({
  device,
  location,
  lastActive,
  current = false,
  icon: Icon,
}: {
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container">
          <Icon className="h-4 w-4 text-on-surface-variant" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate">{device}</span>
            {current && (
              <Badge variant="secondary" className="text-xs shrink-0">
                Current
              </Badge>
            )}
          </div>
          <p className="text-xs text-on-surface-variant truncate">
            {location} · {lastActive}
          </p>
        </div>
      </div>
      {!current && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive shrink-0"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// MAIN SETTINGS PAGE
// ============================================================================

function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="min-h-full">
      {/* Page Header */}
      <div className="bg-surface-container">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Settings Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl">
        <Tabs defaultValue="account" className="space-y-6">
          {/* Tab Navigation - Line variant with icons */}
          <TabsList variant="line" className="mb-6">
            <TabsTrigger value="account">
              <User className="mr-1.5 h-3.5 w-3.5" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-1.5 h-3.5 w-3.5" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-1.5 h-3.5 w-3.5" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-1.5 h-3.5 w-3.5" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="mr-1.5 h-3.5 w-3.5" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* ================================================================
              ACCOUNT TAB
              ================================================================ */}
          <TabsContent value="account" className="space-y-6 mt-6">
            {/* Profile Section */}
            <SettingSection
              title="Profile"
              description="Your personal information and public profile"
              icon={User}
            >
              <SettingRow label="Avatar" description="Your profile picture visible to others">
                <div className="flex items-center gap-4 flex-wrap">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Remove
                    </Button>
                  </div>
                </div>
              </SettingRow>

              <SettingRow label="Full Name" description="Your name as it appears on your profile">
                <Input defaultValue="John Doe" />
              </SettingRow>

              <SettingRow label="Username" description="Your unique identifier">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-surface-container text-sm text-on-surface-variant">
                    @
                  </span>
                  <Input defaultValue="johndoe" className="rounded-l-none" />
                </div>
              </SettingRow>

              <SettingRow label="Bio" description="A brief description about yourself">
                <Textarea
                  placeholder="Tell us about yourself..."
                  defaultValue="Product designer and developer based in San Francisco."
                  rows={3}
                />
              </SettingRow>
            </SettingSection>

            {/* Contact Section */}
            <SettingSection
              title="Contact Information"
              description="How people can reach you"
              icon={Mail}
            >
              <SettingRow label="Email Address" description="Your primary email for notifications">
                <div className="space-y-2">
                  <Input defaultValue="john@example.com" type="email" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                    <span className="text-xs text-on-surface-variant">Verified on Jan 15, 2024</span>
                  </div>
                </div>
              </SettingRow>

              <SettingRow label="Phone Number" description="For account recovery and 2FA">
                <Input defaultValue="+1 (555) 123-4567" type="tel" />
              </SettingRow>
            </SettingSection>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible and destructive actions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SettingRow
                  label="Delete Account"
                  description="Permanently delete your account and all associated data. This action cannot be undone."
                >
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </SettingRow>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================================================================
              NOTIFICATIONS TAB
              ================================================================ */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <SettingSection
              title="Email Notifications"
              description="Choose what emails you want to receive"
              icon={Mail}
            >
              <SettingRow
                label="All Email Notifications"
                description="Receive emails about your account activity"
              >
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </SettingRow>

              <SettingRow
                label="Marketing Emails"
                description="News, product updates, and promotional offers"
              >
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                  disabled={!emailNotifications}
                />
              </SettingRow>

              <SettingRow
                label="Weekly Digest"
                description="A weekly summary of your account activity"
              >
                <Switch
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                  disabled={!emailNotifications}
                />
              </SettingRow>
            </SettingSection>

            <SettingSection
              title="Push Notifications"
              description="Notifications sent to your devices"
              icon={Bell}
            >
              <SettingRow
                label="Push Notifications"
                description="Receive push notifications on your devices"
              >
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </SettingRow>

              <SettingRow label="Security Alerts" description="Get notified about security events">
                <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
              </SettingRow>
            </SettingSection>

            <SettingSection
              title="Notification Preferences"
              description="Fine-tune when and how you're notified"
              icon={Zap}
            >
              <SettingRow
                label="Quiet Hours"
                description="Don't send notifications during these hours"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <Select defaultValue="22">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-on-surface-variant text-sm">to</span>
                  <Select defaultValue="7">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SettingRow>

              <SettingRow
                label="Notification Sound"
                description="Sound played when you receive a notification"
              >
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="ping">Ping</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </SettingSection>
          </TabsContent>

          {/* ================================================================
              APPEARANCE TAB
              ================================================================ */}
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <SettingSection title="Theme" description="Customize the look and feel" icon={Palette}>
              <SettingRow label="Color Mode" description="Select your preferred color mode">
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="flex-col gap-1 h-auto py-3">
                    <Sun className="h-5 w-5" />
                    <span className="text-xs">Light</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col gap-1 h-auto py-3 ring-2 ring-primary"
                  >
                    <Moon className="h-5 w-5" />
                    <span className="text-xs">Dark</span>
                  </Button>
                  <Button variant="outline" className="flex-col gap-1 h-auto py-3">
                    <Monitor className="h-5 w-5" />
                    <span className="text-xs">System</span>
                  </Button>
                </div>
              </SettingRow>

              <SettingRow label="Accent Color" description="Choose your accent color">
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Blue", class: "bg-blue-500" },
                    { name: "Purple", class: "bg-purple-500" },
                    { name: "Pink", class: "bg-pink-500" },
                    { name: "Red", class: "bg-red-500" },
                    { name: "Orange", class: "bg-orange-500" },
                    { name: "Green", class: "bg-green-500" },
                  ].map((color) => (
                    <button
                      key={color.name}
                      className={cn(
                        "h-8 w-8 rounded-full ring-offset-2 ring-offset-background transition-all hover:scale-110",
                        color.class,
                        color.name === "Blue" && "ring-2 ring-primary",
                      )}
                      title={color.name}
                    />
                  ))}
                </div>
              </SettingRow>
            </SettingSection>

            <SettingSection
              title="Language & Region"
              description="Set your language and regional preferences"
              icon={Globe}
            >
              <SettingRow label="Language" description="Select the language for the interface">
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="en-gb">English (UK)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              <SettingRow label="Timezone" description="Your current timezone for dates and times">
                <Select defaultValue="pst">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                    <SelectItem value="cst">Central Time (CT)</SelectItem>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="gmt">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              <SettingRow label="Date Format" description="How dates are displayed">
                <Select defaultValue="mdy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </SettingSection>
          </TabsContent>

          {/* ================================================================
              SECURITY TAB
              ================================================================ */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <SettingSection title="Password" description="Manage your password" icon={Lock}>
              <SettingRow
                label="Current Password"
                description="Enter your current password to make changes"
              >
                <Input type="password" placeholder="••••••••" />
              </SettingRow>

              <SettingRow label="New Password" description="Choose a strong password">
                <Input type="password" placeholder="••••••••" />
              </SettingRow>

              <SettingRow label="Confirm Password" description="Re-enter your new password">
                <div className="space-y-3">
                  <Input type="password" placeholder="••••••••" />
                  <Button size="sm">Update Password</Button>
                </div>
              </SettingRow>
            </SettingSection>

            <SettingSection
              title="Two-Factor Authentication"
              description="Add an extra layer of security"
              icon={Key}
            >
              <SettingRow
                label="Enable 2FA"
                description="Require a verification code when signing in"
              >
                <div className="space-y-3">
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                  {!twoFactor && (
                    <p className="text-xs text-on-surface-variant">
                      We recommend enabling 2FA for enhanced security
                    </p>
                  )}
                </div>
              </SettingRow>

              {twoFactor && (
                <SettingRow
                  label="Recovery Codes"
                  description="Download backup codes in case you lose access"
                >
                  <Button variant="outline" size="sm">
                    Download Codes
                  </Button>
                </SettingRow>
              )}
            </SettingSection>

            <SettingSection
              title="Active Sessions"
              description="Manage your active sessions across devices"
              icon={Shield}
            >
              <div className="space-y-2">
                <SessionItem
                  device="MacBook Pro"
                  location="San Francisco, CA"
                  lastActive="Active now"
                  current
                  icon={Laptop}
                />
                <SessionItem
                  device="iPhone 15 Pro"
                  location="San Francisco, CA"
                  lastActive="2 hours ago"
                  icon={Smartphone}
                />
                <SessionItem
                  device="Windows PC"
                  location="New York, NY"
                  lastActive="3 days ago"
                  icon={Monitor}
                />
              </div>
              <div className="pt-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  Sign Out All Other Sessions
                </Button>
              </div>
            </SettingSection>
          </TabsContent>

          {/* ================================================================
              BILLING TAB
              ================================================================ */}
          <TabsContent value="billing" className="space-y-6 mt-6">
            {/* Current Plan - Decorative card */}
            <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border-primary/20 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 @container sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Pro Plan</CardTitle>
                      <CardDescription>$29/month · Renews Feb 15, 2024</CardDescription>
                    </div>
                  </div>
                  <Badge className="w-fit">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="@container">
                  <div className="grid grid-cols-2 gap-4 text-sm @xs:grid-cols-4">
                    <div>
                      <p className="text-on-surface-variant text-xs">Storage</p>
                      <p className="font-medium">45 / 100 GB</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant text-xs">Team</p>
                      <p className="font-medium">8 / 10</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant text-xs">API Calls</p>
                      <p className="font-medium">12.4k / 50k</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant text-xs">Projects</p>
                      <p className="font-medium">23 / ∞</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 mt-4 border-outline-variant/15">
                    <Button size="sm">Upgrade Plan</Button>
                    <Button variant="outline" size="sm">
                      View Usage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SettingSection
              title="Payment Method"
              description="Manage your payment information"
              icon={CreditCard}
            >
              <SettingRow label="Credit Card" description="Your default payment method">
                <div className="flex items-center gap-3 p-3 rounded-md bg-surface-container">
                  <div className="flex h-10 w-14 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xs font-bold shrink-0">
                    VISA
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">•••• 4242</p>
                    <p className="text-xs text-on-surface-variant">Exp 12/25</p>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    Edit
                  </Button>
                </div>
              </SettingRow>

              <SettingRow label="Billing Email" description="Where invoices and receipts are sent">
                <Input defaultValue="billing@company.com" type="email" />
              </SettingRow>

              <SettingRow label="Billing Address" description="Address shown on invoices">
                <div className="space-y-2">
                  <Input defaultValue="123 Main Street" placeholder="Street address" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input defaultValue="San Francisco" placeholder="City" />
                    <Input defaultValue="CA 94102" placeholder="ZIP" />
                  </div>
                </div>
              </SettingRow>
            </SettingSection>

            <SettingSection
              title="Billing History"
              description="View and download past invoices"
              icon={CreditCard}
            >
              <div className="space-y-2">
                {[
                  { date: "Jan 15, 2024", amount: "$29.00", status: "Paid" },
                  { date: "Dec 15, 2023", amount: "$29.00", status: "Paid" },
                  { date: "Nov 15, 2023", amount: "$29.00", status: "Paid" },
                ].map((invoice) => (
                  <div
                    key={invoice.date}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{invoice.date}</p>
                      <p className="text-xs text-on-surface-variant">Pro Plan</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                      <span className="text-sm hidden xs:inline">{invoice.amount}</span>
                      <Badge variant="secondary" className="text-xs">
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </SettingSection>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
