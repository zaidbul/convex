import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  FileText,
  Home,
  Menu,
  Moon,
  Save,
  Search,
  Settings,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/sheets")({
  component: SheetsPage,
});

// ============================================================================
// RIGHT SHEET - Settings Panel
// ============================================================================

function RightSheetExample() {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [theme, setTheme] = useState("system");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Right Sheet - Settings Panel</CardTitle>
        <CardDescription>
          Classic right-side sheet for settings and configuration panels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Sheet>
          <SheetTrigger
            render={
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Open Settings
              </Button>
            }
          />
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>
                Configure your account preferences and notifications.
              </SheetDescription>
            </SheetHeader>

            <SheetBody className="space-y-6 py-2">
              {/* Notifications Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push">Push Notifications</Label>
                      <p className="text-xs text-on-surface-variant">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch id="push" checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing">Marketing Emails</Label>
                      <p className="text-xs text-on-surface-variant">
                        Receive emails about new features
                      </p>
                    </div>
                    <Switch id="marketing" checked={marketing} onCheckedChange={setMarketing} />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Theme Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Appearance</h4>
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <RadioGroup value={theme} onValueChange={setTheme}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="font-normal flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="font-normal flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="font-normal flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Separator />

              {/* Language Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Language & Region</h4>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetBody>

            <SheetFooter>
              <SheetClose render={<Button variant="outline">Cancel</Button>} />
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LEFT SHEET - Navigation
// ============================================================================

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

function LeftSheetExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Left Sheet - Navigation</CardTitle>
        <CardDescription>
          Mobile-friendly navigation drawer that slides in from the left
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline">
                <Menu className="mr-2 h-4 w-4" />
                Open Navigation
              </Button>
            }
          />
          <SheetContent side="left" showCloseButton={false}>
            <SheetHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                    A
                  </div>
                  <SheetTitle>Acme Inc</SheetTitle>
                </div>
                <SheetClose
                  render={
                    <Button variant="ghost" size="icon-sm">
                      <X className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </SheetHeader>

            <SheetBody className="py-2">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                  <Input className="pl-9" placeholder="Search..." />
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        item.label === "Home"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              <Separator className="my-4" />

              {/* User Section */}
              <div className="flex items-center gap-3 rounded-lg p-3 bg-surface-container">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">John Doe</p>
                  <p className="text-xs text-on-surface-variant truncate">john@example.com</p>
                </div>
                <ChevronRight className="h-4 w-4 text-on-surface-variant" />
              </div>
            </SheetBody>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// BOTTOM SHEET - Mobile
// ============================================================================

function BottomSheetExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bottom Sheet - Mobile</CardTitle>
        <CardDescription>
          Mobile-optimized bottom sheet using Vaul drawer with swipe gestures
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Bottom Sheet</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Share Document</DrawerTitle>
              <DrawerDescription>Choose how you want to share this document</DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-4 space-y-3">
              {[
                { label: "Copy Link", description: "Anyone with the link can view" },
                { label: "Email", description: "Send directly via email" },
                { label: "Slack", description: "Share to a Slack channel" },
                { label: "Download", description: "Save a copy to your device" },
              ].map((option) => (
                <button
                  key={option.label}
                  className="w-full flex items-center gap-4 rounded-md bg-surface-high p-4 text-left hover:bg-surface-highest transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-on-surface-variant">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SHEET WITH FORM
// ============================================================================

function SheetWithFormExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sheet with Form</CardTitle>
        <CardDescription>
          Sheet containing a complete form with validation-ready inputs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Sheet>
          <SheetTrigger
            render={
              <Button>
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            }
          />
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>
                Update your profile information. Click save when you're done.
              </SheetDescription>
            </SheetHeader>

            <SheetBody>
              <form className="space-y-4 py-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@johndoe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself..." rows={3} />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select defaultValue="developer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="public" />
                  <Label htmlFor="public" className="font-normal">
                    Make profile public
                  </Label>
                </div>
              </form>
            </SheetBody>

            <SheetFooter>
              <SheetClose render={<Button variant="outline">Cancel</Button>} />
              <Button type="submit">Save Profile</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SHEET WITH SCROLLABLE CONTENT
// ============================================================================

const mockNotifications = [
  { id: 1, title: "New comment on your post", time: "2 minutes ago", read: false },
  { id: 2, title: "John mentioned you", time: "1 hour ago", read: false },
  { id: 3, title: "Your export is ready", time: "2 hours ago", read: true },
  { id: 4, title: "Weekly digest is available", time: "1 day ago", read: true },
  { id: 5, title: "New follower: Jane Smith", time: "2 days ago", read: true },
  { id: 6, title: "Your subscription was renewed", time: "3 days ago", read: true },
  { id: 7, title: "Security alert: New login detected", time: "4 days ago", read: true },
  { id: 8, title: "Team invitation accepted", time: "5 days ago", read: true },
  { id: 9, title: "Password changed successfully", time: "1 week ago", read: true },
  { id: 10, title: "Welcome to the platform!", time: "2 weeks ago", read: true },
];

function ScrollableSheetExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sheet with Scrollable Content</CardTitle>
        <CardDescription>
          Sheet with a long list of items using ScrollArea component
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
                <Badge className="ml-2" variant="secondary">
                  2
                </Badge>
              </Button>
            }
          />
          <SheetContent side="right">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle>Notifications</SheetTitle>
                <Button variant="ghost" size="sm">
                  Mark all read
                </Button>
              </div>
              <SheetDescription>You have 2 unread notifications</SheetDescription>
            </SheetHeader>

            <SheetBody className="!px-0">
              <div className="space-y-2">
                {mockNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    className={cn(
                      "w-full flex items-start gap-3 px-6 py-3 text-left hover:bg-surface-container transition-colors rounded-md",
                      !notification.read && "bg-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-1 h-2 w-2 rounded-full shrink-0",
                        notification.read ? "bg-transparent" : "bg-primary",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm truncate", !notification.read && "font-medium")}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{notification.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </SheetBody>

            <SheetFooter>
              <Button variant="ghost" className="w-full">
                View All Notifications
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// NESTED SHEETS
// ============================================================================

function NestedSheetsExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nested Sheets</CardTitle>
        <CardDescription>
          Sheet that opens another sheet for multi-level interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Sheet>
          <SheetTrigger render={<Button>Open Primary Sheet</Button>} />
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>User Management</SheetTitle>
              <SheetDescription>Manage team members and their permissions</SheetDescription>
            </SheetHeader>

            <SheetBody className="space-y-4 py-2">
              {["Alice Johnson", "Bob Smith", "Carol Williams"].map((name) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-md bg-surface-high">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {name.toLowerCase().replace(" ", ".")}@example.com
                      </p>
                    </div>
                  </div>

                  {/* Nested Sheet */}
                  <Sheet>
                    <SheetTrigger
                      render={
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      }
                    />
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Edit {name}</SheetTitle>
                        <SheetDescription>Update user details and permissions</SheetDescription>
                      </SheetHeader>

                      <SheetBody className="space-y-4 py-2">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-lg">
                              {name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{name}</p>
                            <p className="text-sm text-on-surface-variant">Team Member</p>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Select defaultValue="member">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label>Permissions</Label>
                          <div className="space-y-2">
                            {[
                              "Create projects",
                              "Manage team",
                              "View analytics",
                              "Access billing",
                            ].map((permission) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <Checkbox id={permission} />
                                <Label htmlFor={permission} className="font-normal">
                                  {permission}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </SheetBody>

                      <SheetFooter>
                        <SheetClose render={<Button variant="outline">Cancel</Button>} />
                        <Button>Save Changes</Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
              ))}
            </SheetBody>

            <SheetFooter>
              <Button variant="outline" className="w-full">
                <User className="mr-2 h-4 w-4" />
                Invite New Member
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function SheetsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-10">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-display font-bold tracking-tight">Sheets & Drawers</h1>
          <p className="text-on-surface-variant mt-1">
            Side panels and bottom sheets for contextual content
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="py-8 px-8 space-y-16">
        <RightSheetExample />
        <LeftSheetExample />
        <BottomSheetExample />
        <SheetWithFormExample />
        <ScrollableSheetExample />
        <NestedSheetsExample />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
