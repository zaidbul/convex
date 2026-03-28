import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronsUpDown,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  FolderOpen,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Settings,
  ShoppingCart,
  Target,
  TrendingDown,
  TrendingUp,
  Upload,
  User,
  Users,
  Zap,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis } from "recharts";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/dashboard")({
  component: DashboardPage,
});

// ============================================================================
// MOCK DATA
// ============================================================================

const areaChartData = [
  { month: "Jan", revenue: 2400 },
  { month: "Feb", revenue: 1398 },
  { month: "Mar", revenue: 9800 },
  { month: "Apr", revenue: 3908 },
  { month: "May", revenue: 4800 },
  { month: "Jun", revenue: 3800 },
  { month: "Jul", revenue: 4300 },
];

const barChartData = [
  { day: "Mon", sales: 44 },
  { day: "Tue", sales: 55 },
  { day: "Wed", sales: 41 },
  { day: "Thu", sales: 67 },
  { day: "Fri", sales: 22 },
  { day: "Sat", sales: 43 },
  { day: "Sun", sales: 56 },
];

const lineChartData = [
  { hour: "9AM", users: 120 },
  { hour: "10AM", users: 180 },
  { hour: "11AM", users: 210 },
  { hour: "12PM", users: 250 },
  { hour: "1PM", users: 190 },
  { hour: "2PM", users: 280 },
  { hour: "3PM", users: 320 },
  { hour: "4PM", users: 290 },
  { hour: "5PM", users: 210 },
];

const activityData = [
  {
    id: 1,
    user: "Sarah Chen",
    avatar: "SC",
    action: "created a new project",
    target: "Marketing Campaign Q1",
    time: "2 minutes ago",
    type: "create",
  },
  {
    id: 2,
    user: "James Wilson",
    avatar: "JW",
    action: "completed task",
    target: "User Research Analysis",
    time: "15 minutes ago",
    type: "complete",
  },
  {
    id: 3,
    user: "Emily Rodriguez",
    avatar: "ER",
    action: "commented on",
    target: "Design System Updates",
    time: "1 hour ago",
    type: "comment",
  },
  {
    id: 4,
    user: "Michael Park",
    avatar: "MP",
    action: "uploaded files to",
    target: "Brand Assets",
    time: "2 hours ago",
    type: "upload",
  },
  {
    id: 5,
    user: "Lisa Thompson",
    avatar: "LT",
    action: "updated status of",
    target: "Website Redesign",
    time: "3 hours ago",
    type: "update",
  },
];

const recentItems = [
  {
    id: 1,
    name: "Q4 Financial Report",
    type: "document",
    icon: FileText,
    modified: "Just now",
    status: "Draft",
  },
  {
    id: 2,
    name: "Product Roadmap 2024",
    type: "spreadsheet",
    icon: BarChart3,
    modified: "5 min ago",
    status: "In Review",
  },
  {
    id: 3,
    name: "Marketing Assets",
    type: "folder",
    icon: FolderOpen,
    modified: "1 hour ago",
    status: "Active",
  },
  {
    id: 4,
    name: "Customer Feedback",
    type: "document",
    icon: MessageSquare,
    modified: "2 hours ago",
    status: "Complete",
  },
  {
    id: 5,
    name: "Sales Pipeline",
    type: "spreadsheet",
    icon: DollarSign,
    modified: "Yesterday",
    status: "Active",
  },
];

const goals = [
  {
    id: 1,
    name: "Monthly Revenue",
    current: 84500,
    target: 100000,
    unit: "$",
    color: "bg-primary",
  },
  {
    id: 2,
    name: "New Customers",
    current: 156,
    target: 200,
    unit: "",
    color: "bg-success",
  },
  {
    id: 3,
    name: "Active Users",
    current: 2340,
    target: 3000,
    unit: "",
    color: "bg-info",
  },
  {
    id: 4,
    name: "Support Tickets",
    current: 45,
    target: 30,
    unit: "",
    color: "bg-warning",
    inverse: true,
  },
];

function getActivityActionIcon(type: string) {
  switch (type) {
    case "create":
      return <Plus className="h-3 w-3" />;
    case "complete":
      return <CheckCircle2 className="h-3 w-3" />;
    case "comment":
      return <MessageSquare className="h-3 w-3" />;
    case "upload":
      return <Upload className="h-3 w-3" />;
    default:
      return <RefreshCw className="h-3 w-3" />;
  }
}

function getActivityActionColor(type: string) {
  switch (type) {
    case "create":
      return "bg-primary text-primary-foreground";
    case "complete":
      return "bg-success text-success-foreground";
    case "comment":
      return "bg-info text-info-foreground";
    case "upload":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-surface-container text-on-surface-variant";
  }
}

function getRecentItemStatusColor(status: string) {
  switch (status) {
    case "Draft":
      return "bg-surface-container text-on-surface-variant";
    case "In Review":
      return "bg-warning/10 text-warning-foreground border-warning/30";
    case "Active":
      return "bg-success/10 text-success border-success/30";
    case "Complete":
      return "bg-primary/10 text-primary border-primary/30";
    default:
      return "bg-surface-container text-on-surface-variant";
  }
}

// ============================================================================
// STAT CARDS SECTION
// ============================================================================

function StatCardsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stat Cards with Trends</CardTitle>
        <CardDescription>Key metrics with trend indicators and sparklines</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Revenue Card */}
          <Card className="border-0 shadow-none bg-surface-container">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12.5%
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">$45,231.89</p>
                <p className="text-xs text-on-surface-variant">Total Revenue</p>
              </div>
              <div className="mt-4 h-[40px]">
                <ChartContainer
                  config={{ revenue: { color: "hsl(var(--primary))" } }}
                  className="h-full w-full"
                >
                  <AreaChart data={areaChartData.slice(-5)}>
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Users Card */}
          <Card className="border-0 shadow-none bg-surface-container">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <Users className="h-5 w-5 text-info" />
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +8.2%
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">2,350</p>
                <p className="text-xs text-on-surface-variant">Active Users</p>
              </div>
              <div className="mt-4 h-[40px]">
                <ChartContainer
                  config={{ users: { color: "hsl(var(--info))" } }}
                  className="h-full w-full"
                >
                  <LineChart data={lineChartData.slice(-5)}>
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--info))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card className="border-0 shadow-none bg-surface-container">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <ShoppingCart className="h-5 w-5 text-warning" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-destructive/10 text-destructive border-destructive/20"
                >
                  <TrendingDown className="mr-1 h-3 w-3" />
                  -3.1%
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-xs text-on-surface-variant">Total Orders</p>
              </div>
              <div className="mt-4 h-[40px]">
                <ChartContainer
                  config={{ sales: { color: "hsl(var(--warning))" } }}
                  className="h-full w-full"
                >
                  <BarChart data={barChartData.slice(-5)}>
                    <Bar dataKey="sales" fill="hsl(var(--warning))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Card */}
          <Card className="border-0 shadow-none bg-surface-container">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Target className="h-5 w-5 text-success" />
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +2.4%
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">3.24%</p>
                <p className="text-xs text-on-surface-variant">Conversion Rate</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Progress value={64.8} className="h-2 flex-1" />
                <span className="text-xs text-on-surface-variant">vs 5%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// KPI WIDGETS SECTION
// ============================================================================

function KPIWidgetsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>KPI Widgets</CardTitle>
        <CardDescription>Compact KPI displays with comparison metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* MRR Widget */}
          <div className="rounded-md bg-surface-high p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Monthly Recurring Revenue</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold">$84,254</span>
              <div className="flex items-center text-sm text-success">
                <ArrowUp className="h-4 w-4" />
                <span>18%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-on-surface-variant">
              <span>vs last month: $71,400</span>
            </div>
          </div>

          {/* ARR Widget */}
          <div className="rounded-md bg-surface-high p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info/10">
                <BarChart3 className="h-4 w-4 text-info" />
              </div>
              <span className="text-sm font-medium">Annual Recurring Revenue</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold">$1.01M</span>
              <div className="flex items-center text-sm text-success">
                <ArrowUp className="h-4 w-4" />
                <span>24%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-on-surface-variant">
              <span>Target: $1.2M</span>
              <span className="text-foreground">84% achieved</span>
            </div>
          </div>

          {/* Churn Rate Widget */}
          <div className="rounded-md bg-surface-high p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                <Activity className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-sm font-medium">Churn Rate</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold">2.4%</span>
              <div className="flex items-center text-sm text-success">
                <ArrowDown className="h-4 w-4" />
                <span>0.8%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-on-surface-variant">
              <span>Industry avg: 5.2%</span>
              <Badge variant="outline" className="text-success border-success/30">
                Below avg
              </Badge>
            </div>
          </div>

          {/* NPS Widget */}
          <div className="rounded-md bg-surface-high p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                <Zap className="h-4 w-4 text-success" />
              </div>
              <span className="text-sm font-medium">Net Promoter Score</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold">72</span>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                Excellent
              </Badge>
            </div>
            <div className="mt-3 flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={cn("h-2 flex-1 rounded-full", i < 7 ? "bg-success" : "bg-surface-container")}
                />
              ))}
            </div>
          </div>

          {/* CAC Widget */}
          <div className="rounded-md bg-surface-high p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10">
                <User className="h-4 w-4 text-warning" />
              </div>
              <span className="text-sm font-medium">Customer Acquisition Cost</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold">$142</span>
              <div className="flex items-center text-sm text-destructive">
                <ArrowUp className="h-4 w-4" />
                <span>12%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-on-surface-variant">
              <span>LTV:CAC Ratio: 5.2x</span>
            </div>
          </div>

          {/* Avg Session Widget */}
          <div className="rounded-md bg-surface-high p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <Clock className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="text-sm font-medium">Avg. Session Duration</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold">4m 32s</span>
              <div className="flex items-center text-sm text-success">
                <ArrowUp className="h-4 w-4" />
                <span>8%</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-on-surface-variant">
              <span>Pages per session: 3.8</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MINI CHARTS SECTION
// ============================================================================

function MiniChartsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mini Charts</CardTitle>
        <CardDescription>Compact chart visualizations for dashboards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Area Chart */}
          <Card className="border-0 shadow-none bg-surface-container">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
                <Badge variant="outline" className="text-xs">
                  Last 7 months
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[120px]">
                <ChartContainer
                  config={{ revenue: { color: "hsl(var(--primary))" } }}
                  className="h-full w-full"
                >
                  <AreaChart data={areaChartData}>
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="border-0 shadow-none bg-surface-container">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
                <Badge variant="outline" className="text-xs">
                  This week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[120px]">
                <ChartContainer
                  config={{ sales: { color: "hsl(var(--success))" } }}
                  className="h-full w-full"
                >
                  <BarChart data={barChartData}>
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <Bar dataKey="sales" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card className="border-0 shadow-none bg-surface-container">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Badge variant="outline" className="text-xs">
                  Today
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[120px]">
                <ChartContainer
                  config={{ users: { color: "hsl(var(--info))" } }}
                  className="h-full w-full"
                >
                  <LineChart data={lineChartData}>
                    <XAxis
                      dataKey="hour"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--info))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ACTIVITY FEED SECTION
// ============================================================================

function ActivityFeedSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Real-time activity stream with user avatars</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-sm font-medium">Recent Activity</h3>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-2">
            {activityData.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{item.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{item.user}</span>{" "}
                    <span className="text-on-surface-variant">{item.action}</span>{" "}
                    <span className="font-medium text-primary">{item.target}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full",
                        getActivityActionColor(item.type),
                      )}
                    >
                      {getActivityActionIcon(item.type)}
                    </div>
                    <span className="text-xs text-on-surface-variant">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// RECENT ITEMS SECTION
// ============================================================================

function RecentItemsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Items List</CardTitle>
        <CardDescription>Frequently accessed items with status indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-sm font-medium">Recent Files</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-1 h-3 w-3" />
                Upload
              </Button>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {recentItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container">
                    <Icon className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">Modified {item.modified}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("shrink-0", getRecentItemStatusColor(item.status))}
                  >
                    {item.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// QUICK ACTIONS SECTION
// ============================================================================

function QuickActionsSection() {
  const actions = [
    {
      id: 1,
      name: "New Project",
      description: "Create a new project",
      icon: Plus,
      color: "bg-primary/10 text-primary",
    },
    {
      id: 2,
      name: "Upload Files",
      description: "Add documents or media",
      icon: Upload,
      color: "bg-success/10 text-success",
    },
    {
      id: 3,
      name: "Invite Team",
      description: "Add team members",
      icon: Users,
      color: "bg-info/10 text-info",
    },
    {
      id: 4,
      name: "Create Report",
      description: "Generate analytics",
      icon: BarChart3,
      color: "bg-warning/10 text-warning",
    },
    {
      id: 5,
      name: "Schedule Event",
      description: "Set up a meeting",
      icon: Calendar,
      color: "bg-accent/10 text-accent-foreground",
    },
    {
      id: 6,
      name: "View Orders",
      description: "Check recent orders",
      icon: Package,
      color: "bg-destructive/10 text-destructive",
    },
    {
      id: 7,
      name: "Download Data",
      description: "Export your data",
      icon: Download,
      color: "bg-surface-container text-on-surface-variant",
    },
    {
      id: 8,
      name: "Settings",
      description: "Manage preferences",
      icon: Settings,
      color: "bg-surface-container text-on-surface-variant",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions Grid</CardTitle>
        <CardDescription>Frequently used actions in a grid layout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className="flex flex-col items-center gap-2 rounded-md bg-surface-high p-4 text-center transition-all hover:bg-surface-container hover:border-primary/30"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    action.color,
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">{action.name}</p>
                  <p className="text-xs text-on-surface-variant">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// METRIC COMPARISONS SECTION
// ============================================================================

function MetricComparisonsSection() {
  const comparisons = [
    {
      metric: "Page Views",
      current: "124,892",
      previous: "98,456",
      change: 26.8,
      positive: true,
    },
    {
      metric: "Unique Visitors",
      current: "45,678",
      previous: "42,123",
      change: 8.4,
      positive: true,
    },
    {
      metric: "Bounce Rate",
      current: "32.4%",
      previous: "38.2%",
      change: -15.2,
      positive: true,
    },
    {
      metric: "Avg. Order Value",
      current: "$156.80",
      previous: "$148.20",
      change: 5.8,
      positive: true,
    },
    {
      metric: "Cart Abandonment",
      current: "68.5%",
      previous: "65.2%",
      change: 5.1,
      positive: false,
    },
    {
      metric: "Customer Satisfaction",
      current: "94.2%",
      previous: "91.8%",
      change: 2.6,
      positive: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metric Comparisons</CardTitle>
        <CardDescription>Compare metrics against previous period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high overflow-hidden">
          <div className="grid grid-cols-4 gap-4 bg-surface-container px-4 py-3">
            <span className="text-xs font-medium text-on-surface-variant">Metric</span>
            <span className="text-xs font-medium text-on-surface-variant text-right">Current</span>
            <span className="text-xs font-medium text-on-surface-variant text-right">Previous</span>
            <span className="text-xs font-medium text-on-surface-variant text-right">Change</span>
          </div>
          <div className="space-y-2">
            {comparisons.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
                <span className="text-sm font-medium">{item.metric}</span>
                <span className="text-sm text-right">{item.current}</span>
                <span className="text-sm text-on-surface-variant text-right">{item.previous}</span>
                <div className="flex items-center justify-end gap-1">
                  {item.positive ? (
                    <ArrowUp className="h-3 w-3 text-success" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-destructive" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      item.positive ? "text-success" : "text-destructive",
                    )}
                  >
                    {item.change > 0 ? "+" : ""}
                    {item.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PROGRESS TOWARDS GOALS SECTION
// ============================================================================

function ProgressTowardsGoalsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Towards Goals</CardTitle>
        <CardDescription>Track progress against targets with visual indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => {
            const percentage = goal.inverse
              ? Math.min(100, (goal.target / goal.current) * 100)
              : Math.min(100, (goal.current / goal.target) * 100);
            const isOnTrack = goal.inverse
              ? goal.current <= goal.target
              : goal.current >= goal.target * 0.8;

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{goal.name}</span>
                    {isOnTrack ? (
                      <Badge
                        variant="outline"
                        className="text-xs bg-success/10 text-success border-success/30"
                      >
                        On Track
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs bg-warning/10 text-warning-foreground border-warning/30"
                      >
                        Needs Attention
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">
                      {goal.unit}
                      {goal.current.toLocaleString()}
                    </span>
                    <span className="text-on-surface-variant">
                      {" "}
                      / {goal.unit}
                      {goal.target.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <Progress
                    value={percentage}
                    className={cn(
                      "h-3",
                      goal.inverse && goal.current > goal.target && "[&>div]:bg-warning",
                    )}
                  />
                  {!goal.inverse && (
                    <div
                      className="absolute top-0 h-3 w-0.5 bg-foreground/50"
                      style={{ left: "80%" }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>{Math.round(percentage)}% complete</span>
                  {goal.inverse ? (
                    <span>
                      {goal.current <= goal.target
                        ? "Target met"
                        : `${goal.current - goal.target} over target`}
                    </span>
                  ) : (
                    <span>
                      {goal.current >= goal.target
                        ? "Target met"
                        : `${goal.unit}${(goal.target - goal.current).toLocaleString()} to go`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="my-6" />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md bg-success/5 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">On Track</span>
            </div>
            <p className="mt-1 text-2xl font-bold">3</p>
            <p className="text-xs text-on-surface-variant">of 4 goals</p>
          </div>
          <div className="rounded-md bg-warning/5 p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Needs Attention</span>
            </div>
            <p className="mt-1 text-2xl font-bold">1</p>
            <p className="text-xs text-on-surface-variant">goal behind</p>
          </div>
          <div className="rounded-md bg-surface-container p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-on-surface-variant" />
              <span className="text-sm font-medium">Overall Progress</span>
            </div>
            <p className="mt-1 text-2xl font-bold">78%</p>
            <p className="text-xs text-on-surface-variant">average completion</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// USER NAV DROPDOWN
// ============================================================================

function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="relative h-9 px-2 hover:bg-surface-container">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs text-on-surface-variant">john@example.com</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-on-surface-variant" />
            </div>
          </Button>
        }
      />
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs leading-none text-on-surface-variant">john@example.com</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function DashboardPage() {
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
              <h1 className="font-display text-xl font-bold tracking-tight">Dashboard Patterns</h1>
              <p className="text-on-surface-variant text-sm">
                Common dashboard UI components and layouts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-8 px-6 space-y-16">
        <StatCardsSection />
        <KPIWidgetsSection />
        <MiniChartsSection />
        <ActivityFeedSection />
        <RecentItemsSection />
        <QuickActionsSection />
        <MetricComparisonsSection />
        <ProgressTowardsGoalsSection />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
