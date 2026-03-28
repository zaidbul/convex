import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  Folder,
  FolderOpen,
  Home,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/navigation")({
  component: NavigationPage,
});

// ============================================================================
// COLLAPSIBLE SIDEBAR
// ============================================================================

const sidebarNavItems = [
  { icon: Home, label: "Home", href: "#", badge: null },
  { icon: Inbox, label: "Inbox", href: "#", badge: 12 },
  { icon: BarChart3, label: "Analytics", href: "#", badge: null },
  { icon: Users, label: "Team", href: "#", badge: null },
  { icon: Settings, label: "Settings", href: "#", badge: null },
];

const sidebarProjects = [
  { icon: Folder, label: "Marketing", color: "text-blue-500" },
  { icon: Folder, label: "Development", color: "text-green-500" },
  { icon: Folder, label: "Design", color: "text-purple-500" },
];

function CollapsibleSidebarExample() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [projectsOpen, setProjectsOpen] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collapsible Sidebar</CardTitle>
        <CardDescription>
          Full sidebar that collapses to icons only. Click the toggle button to collapse.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[400px] overflow-hidden rounded-md border-outline-variant/15">
          {/* Sidebar */}
          <div
            className={cn(
              "flex h-full flex-col bg-surface-high transition-all duration-300",
              isCollapsed ? "w-16" : "w-64",
            )}
          >
            {/* Header */}
            <div className="flex h-14 items-center bg-surface-container px-4">
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Acme Inc</span>
                </div>
              )}
              {isCollapsed && (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground mx-auto">
                  <Zap className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-2">
              <nav className="space-y-1 px-2">
                {sidebarNavItems.map((item) => (
                  <Tooltip key={item.label}>
                    <TooltipTrigger
                      render={
                        <button
                          onClick={() => setActiveItem(item.label)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                            activeItem === item.label
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                            isCollapsed && "justify-center px-2",
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </button>
                      }
                    />
                    {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                ))}
              </nav>

              {/* Projects Section */}
              {!isCollapsed && (
                <div className="mt-4 px-2">
                  <Collapsible open={projectsOpen} onOpenChange={setProjectsOpen}>
                    <CollapsibleTrigger
                      render={
                        <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-on-surface-variant hover:text-foreground">
                          <ChevronRight
                            className={cn(
                              "h-3 w-3 transition-transform",
                              projectsOpen && "rotate-90",
                            )}
                          />
                          Projects
                        </button>
                      }
                    />
                    <CollapsibleContent className="space-y-1 pt-1">
                      {sidebarProjects.map((project) => (
                        <button
                          key={project.label}
                          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container hover:text-foreground"
                        >
                          <project.icon className={cn("h-4 w-4", project.color)} />
                          <span>{project.label}</span>
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-surface-container p-2">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => setIsCollapsed(!isCollapsed)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                        isCollapsed && "justify-center px-2",
                      )}
                    >
                      <PanelLeft className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>Collapse</span>}
                    </button>
                  }
                />
                {isCollapsed && <TooltipContent side="right">Expand</TooltipContent>}
              </Tooltip>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-surface-container p-6">
            <div className="text-sm text-on-surface-variant">
              Current section: <span className="font-medium text-foreground">{activeItem}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MINI SIDEBAR (ICONS ONLY)
// ============================================================================

const miniSidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Mail, label: "Messages", badge: 3 },
  { icon: Users, label: "Contacts" },
  { icon: FileText, label: "Documents" },
  { icon: BarChart3, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

function MiniSidebarExample() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mini Sidebar (Icons Only)</CardTitle>
        <CardDescription>
          Compact icon-only sidebar with tooltips for labels. Great for maximizing content space.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[350px] overflow-hidden rounded-md border-outline-variant/15">
          {/* Mini Sidebar */}
          <div className="flex h-full w-16 flex-col bg-surface-high">
            {/* Logo */}
            <div className="flex h-14 items-center justify-center bg-surface-container">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-2">
              {miniSidebarItems.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger
                    render={
                      <button
                        onClick={() => setActiveItem(item.label)}
                        className={cn(
                          "relative flex h-10 w-full items-center justify-center rounded-md transition-colors",
                          activeItem === item.label
                            ? "bg-primary text-primary-foreground"
                            : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    }
                  />
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>

            {/* User Menu */}
            <div className="bg-surface-container p-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className="flex h-10 w-full items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </button>
                  }
                />
                <DropdownMenuContent side="right" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-surface-container p-6">
            <div className="text-sm text-on-surface-variant">
              Current section: <span className="font-medium text-foreground">{activeItem}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// NESTED NAVIGATION MENU
// ============================================================================

const nestedNavItems = [
  {
    icon: Home,
    label: "Overview",
    href: "#",
  },
  {
    icon: Package,
    label: "Products",
    children: [
      { label: "All Products", href: "#" },
      { label: "Categories", href: "#" },
      { label: "Inventory", href: "#" },
      { label: "Collections", href: "#" },
    ],
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    children: [
      { label: "All Orders", href: "#" },
      { label: "Drafts", href: "#" },
      { label: "Abandoned", href: "#" },
    ],
  },
  {
    icon: Users,
    label: "Customers",
    children: [
      { label: "All Customers", href: "#" },
      { label: "Segments", href: "#" },
    ],
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "#",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
  },
];

function NestedNavigationExample() {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Products"]);
  const [activeItem, setActiveItem] = useState("All Products");

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nested Navigation Menu</CardTitle>
        <CardDescription>
          Hierarchical navigation with expandable/collapsible sub-menus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[400px] overflow-hidden rounded-md border-outline-variant/15">
          {/* Sidebar */}
          <div className="flex h-full w-64 flex-col bg-surface-high">
            <div className="flex h-14 items-center bg-surface-container px-4">
              <span className="font-semibold">Store Admin</span>
            </div>

            <nav className="flex-1 overflow-auto py-2">
              <div className="space-y-1 px-2">
                {nestedNavItems.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <Collapsible
                        open={expandedItems.includes(item.label)}
                        onOpenChange={() => toggleExpanded(item.label)}
                      >
                        <CollapsibleTrigger
                          render={
                            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container hover:text-foreground">
                              <item.icon className="h-4 w-4" />
                              <span className="flex-1 text-left">{item.label}</span>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  expandedItems.includes(item.label) && "rotate-180",
                                )}
                              />
                            </button>
                          }
                        />
                        <CollapsibleContent className="space-y-1 pt-1">
                          {item.children.map((child) => (
                            <button
                              key={child.label}
                              onClick={() => setActiveItem(child.label)}
                              className={cn(
                                "flex w-full items-center rounded-md py-2 pl-10 pr-3 text-sm transition-colors",
                                activeItem === child.label
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                              )}
                            >
                              {child.label}
                            </button>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <button
                        onClick={() => setActiveItem(item.label)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          activeItem === item.label
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-surface-container p-6">
            <div className="text-sm text-on-surface-variant">
              Current page: <span className="font-medium text-foreground">{activeItem}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MEGA MENU
// ============================================================================

const megaMenuProducts = [
  {
    title: "Analytics",
    description: "Track your business metrics",
    icon: BarChart3,
  },
  {
    title: "Automation",
    description: "Streamline your workflows",
    icon: Zap,
  },
  {
    title: "Communication",
    description: "Connect with your team",
    icon: MessageSquare,
  },
  {
    title: "Security",
    description: "Protect your data",
    icon: CreditCard,
  },
];

const megaMenuResources = [
  { title: "Documentation", description: "Start integrating", icon: BookOpen },
  { title: "Tutorials", description: "Learn step by step", icon: FileText },
  { title: "Support", description: "Get help from experts", icon: LifeBuoy },
  { title: "Community", description: "Join the discussion", icon: Users },
];

function MegaMenuExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mega Menu</CardTitle>
        <CardDescription>
          Rich dropdown navigation with multiple columns and featured content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high">
          {/* Top Navigation */}
          <div className="flex h-14 items-center justify-between bg-surface-container px-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="font-semibold">Acme</span>
              </div>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[500px] grid-cols-2 gap-3 p-4">
                        {megaMenuProducts.map((item) => (
                          <NavigationMenuLink
                            key={item.title}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-surface-container"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-container">
                              <item.icon className="h-5 w-5 text-on-surface-variant" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.title}</div>
                              <div className="text-xs text-on-surface-variant">
                                {item.description}
                              </div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[400px] p-4">
                        <div className="mb-3 text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                          Get Started
                        </div>
                        <div className="space-y-1">
                          {megaMenuResources.map((item) => (
                            <NavigationMenuLink
                              key={item.title}
                              className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-container"
                            >
                              <item.icon className="h-4 w-4 text-on-surface-variant" />
                              <div>
                                <div className="text-sm font-medium">{item.title}</div>
                                <div className="text-xs text-on-surface-variant">
                                  {item.description}
                                </div>
                              </div>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink className="px-3 py-2 text-sm font-medium hover:bg-surface-container rounded-md">
                      Pricing
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink className="px-3 py-2 text-sm font-medium hover:bg-surface-container rounded-md">
                      About
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="h-[200px] bg-surface-container p-6">
            <p className="text-sm text-on-surface-variant">
              Hover over the navigation items above to see the mega menu in action.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MOBILE BOTTOM TAB BAR
// ============================================================================

const bottomTabItems = [
  { icon: Home, label: "Home" },
  { icon: Search, label: "Search" },
  { icon: Bell, label: "Alerts", badge: 5 },
  { icon: Mail, label: "Messages", badge: 2 },
  { icon: User, label: "Profile" },
];

function MobileBottomTabBarExample() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mobile Bottom Tab Bar</CardTitle>
        <CardDescription>
          Fixed bottom navigation for mobile apps. Common pattern for quick access to main sections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto max-w-sm overflow-hidden rounded-[2rem] border-4 border-foreground/20 bg-background shadow-xl">
          {/* Phone Notch */}
          <div className="flex h-8 items-center justify-center bg-foreground/5">
            <div className="h-1.5 w-20 rounded-full bg-foreground/20" />
          </div>

          {/* Screen Content */}
          <div className="h-[400px] bg-surface-container p-4">
            <div className="text-center text-sm text-on-surface-variant">
              <p className="mb-2">Active Tab:</p>
              <p className="text-lg font-semibold text-foreground">{activeTab}</p>
            </div>
          </div>

          {/* Bottom Tab Bar */}
          <div className="flex h-16 items-stretch bg-surface-high">
            {bottomTabItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors",
                  activeTab === item.label ? "text-primary" : "text-on-surface-variant",
                )}
              >
                <div className="relative">
                  <item.icon
                    className={cn("h-5 w-5", activeTab === item.label && "stroke-[2.5px]")}
                  />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
                {activeTab === item.label && (
                  <div className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Home Indicator */}
          <div className="flex h-6 items-center justify-center bg-surface-high">
            <div className="h-1 w-24 rounded-full bg-foreground/20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// BREADCRUMB VARIATIONS
// ============================================================================

function BreadcrumbVariationsExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Breadcrumb Variations</CardTitle>
        <CardDescription>
          Different breadcrumb styles for showing hierarchical navigation paths.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-on-surface-variant">Basic</h4>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Electronics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* With Icons */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-on-surface-variant">With Icons</h4>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="flex items-center gap-1.5">
                  <FolderOpen className="h-3.5 w-3.5" />
                  Documents
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Report.pdf
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* With Ellipsis (Collapsed) */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-on-surface-variant">With Ellipsis (Collapsed)</h4>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <BreadcrumbEllipsis />
                      </button>
                    }
                  />
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Projects</DropdownMenuItem>
                    <DropdownMenuItem>Acme Corp</DropdownMenuItem>
                    <DropdownMenuItem>Engineering</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>General</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* With Dropdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-on-surface-variant">With Dropdown Switcher</h4>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Organization</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <span>Acme Inc</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    }
                  />
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Acme Inc</DropdownMenuItem>
                    <DropdownMenuItem>Globex Corp</DropdownMenuItem>
                    <DropdownMenuItem>Initech</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Styled Variant */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-on-surface-variant">Pill Style</h4>
          <nav className="flex items-center gap-1">
            {["Home", "Products", "Category", "Item"].map((item, index, arr) => (
              <div key={item} className="flex items-center gap-1">
                <button
                  className={cn(
                    "rounded-full px-3 py-1 text-xs transition-colors",
                    index === arr.length - 1
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                  )}
                >
                  {item}
                </button>
                {index < arr.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-on-surface-variant/50" />
                )}
              </div>
            ))}
          </nav>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// APP SHELL LAYOUTS
// ============================================================================

function AppShellLayoutsExample() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Shell Layouts</CardTitle>
        <CardDescription>
          Common application shell patterns with header, sidebar, and content areas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Layout 1: Top Navigation */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-on-surface-variant">Top Navigation Layout</h4>
          <div className="overflow-hidden rounded-md border-outline-variant/15">
            {/* Top Nav */}
            <div className="flex h-12 items-center justify-between bg-surface-high px-4">
              <div className="flex items-center gap-4">
                <div className="h-6 w-6 rounded bg-primary" />
                <nav className="hidden items-center gap-1 md:flex">
                  <Button variant="ghost" size="sm" className="h-8">
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8">
                    Projects
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8">
                    Team
                  </Button>
                </nav>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Avatar className="h-7 w-7">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </div>
            {/* Content */}
            <div className="h-32 bg-surface-container p-4">
              <div className="h-full rounded border-2 border-dashed border-outline-variant/15" />
            </div>
          </div>
        </div>

        {/* Layout 2: Sidebar + Header */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-on-surface-variant">Sidebar with Header</h4>
          <div className="flex overflow-hidden rounded-md border-outline-variant/15">
            {/* Sidebar */}
            <div className="hidden w-48 flex-col bg-surface-high md:flex">
              <div className="h-12 bg-surface-container p-3">
                <div className="h-full w-20 rounded bg-primary/20" />
              </div>
              <div className="flex-1 space-y-1 p-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn("h-8 rounded", i === 1 ? "bg-primary/10" : "bg-surface-container")}
                  />
                ))}
              </div>
            </div>
            {/* Main Area */}
            <div className="flex flex-1 flex-col">
              {/* Header */}
              <div className="flex h-12 items-center justify-between bg-surface-high px-4">
                <span className="text-sm font-medium">Page Title</span>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search..." className="h-8 w-40 hidden sm:block" />
                  <Button variant="ghost" size="icon-sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Content */}
              <div className="h-32 bg-surface-container p-4">
                <div className="h-full rounded border-2 border-dashed border-outline-variant/15" />
              </div>
            </div>
          </div>
        </div>

        {/* Layout 3: Full Sidebar with Mobile Sheet */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-on-surface-variant">Sidebar with Mobile Sheet</h4>
          <div className="flex overflow-hidden rounded-md border-outline-variant/15">
            {/* Desktop Sidebar (hidden on mobile) */}
            <div className="hidden w-56 flex-col bg-surface-high lg:flex">
              <div className="flex h-14 items-center gap-2 bg-surface-container px-4">
                <div className="h-8 w-8 rounded-lg bg-primary" />
                <span className="font-semibold">Acme</span>
              </div>
              <div className="flex-1 space-y-1 p-2">
                {["Dashboard", "Projects", "Team", "Settings"].map((item, i) => (
                  <div
                    key={item}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-xs",
                      i === 0 ? "bg-primary/10 text-primary font-medium" : "text-on-surface-variant",
                    )}
                  >
                    <div className="h-4 w-4 rounded bg-current opacity-30" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Area */}
            <div className="flex flex-1 flex-col">
              {/* Header with mobile menu */}
              <div className="flex h-14 items-center justify-between bg-surface-high px-4">
                <div className="flex items-center gap-3">
                  {/* Mobile Menu Button */}
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger
                      render={
                        <Button variant="ghost" size="icon-sm" className="lg:hidden">
                          <Menu className="h-5 w-5" />
                        </Button>
                      }
                    />
                    <SheetContent side="left" className="w-64 p-0">
                      <SheetHeader className="bg-surface-container px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary" />
                          <SheetTitle>Acme</SheetTitle>
                        </div>
                        <SheetDescription className="sr-only">Navigation menu</SheetDescription>
                      </SheetHeader>
                      <nav className="space-y-1 p-2">
                        {["Dashboard", "Projects", "Team", "Settings"].map((item, i) => (
                          <button
                            key={item}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm",
                              i === 0
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-on-surface-variant hover:bg-surface-container",
                            )}
                          >
                            {item}
                          </button>
                        ))}
                      </nav>
                    </SheetContent>
                  </Sheet>
                  <span className="font-medium">Dashboard</span>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>

              {/* Content */}
              <div className="h-40 bg-surface-container p-4">
                <div className="h-full rounded border-2 border-dashed border-outline-variant/15 flex items-center justify-center">
                  <p className="text-xs text-on-surface-variant">
                    Resize window or click menu on mobile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function NavigationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/style-guide"
              className="flex items-center gap-2 text-on-surface-variant hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Style Guide</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">Navigation Patterns</h1>
              <p className="text-on-surface-variant text-sm">
                Sidebars, menus, breadcrumbs, and app shell layouts
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-8 px-6 space-y-16">
        <CollapsibleSidebarExample />
        <MiniSidebarExample />
        <NestedNavigationExample />
        <MegaMenuExample />
        <MobileBottomTabBarExample />
        <BreadcrumbVariationsExample />
        <AppShellLayoutsExample />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
