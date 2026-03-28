import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Bell,
  Check,
  Circle,
  Clock,
  MessageSquare,
  Radio,
  RefreshCw,
  TrendingUp,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/realtime")({
  component: RealtimePage,
});

// ============================================================================
// LIVE NOTIFICATIONS
// ============================================================================

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  time: string;
  read: boolean;
}

const notificationTemplates = [
  {
    title: "New comment",
    message: "Sarah left a comment on your post",
    type: "info" as const,
  },
  {
    title: "Task completed",
    message: "Project milestone has been reached",
    type: "success" as const,
  },
  {
    title: "Low disk space",
    message: "Server storage is running low",
    type: "warning" as const,
  },
  {
    title: "New follower",
    message: "Alex started following you",
    type: "info" as const,
  },
  {
    title: "Payment received",
    message: "$500 payment from Client XYZ",
    type: "success" as const,
  },
  {
    title: "Security alert",
    message: "New login from unknown device",
    type: "warning" as const,
  },
];

function LiveNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Welcome",
      message: "Welcome to the realtime demo!",
      type: "info",
      time: "Just now",
      read: false,
    },
  ]);
  const [nextId, setNextId] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      const template =
        notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      const newNotification: Notification = {
        id: nextId,
        ...template,
        time: "Just now",
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 5));
      setNextId((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [nextId]);

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Live Notifications
          </span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Notifications appear automatically every 4 seconds with enter animations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={cn(
                "flex items-start gap-3 p-3 rounded-md bg-surface-high cursor-pointer transition-all",
                notification.read
                  ? "bg-surface-container border-transparent"
                  : "bg-background border-border hover:border-primary/30",
                index === 0 && "animate-in slide-in-from-top-2 fade-in duration-300",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  notification.type === "success" && "bg-success/20 text-success",
                  notification.type === "warning" && "bg-warning/20 text-warning-foreground",
                  notification.type === "info" && "bg-info/20 text-info",
                )}
              >
                {notification.type === "success" && <Check className="h-4 w-4" />}
                {notification.type === "warning" && <Bell className="h-4 w-4" />}
                {notification.type === "info" && <MessageSquare className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      notification.read && "text-on-surface-variant",
                    )}
                  >
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-on-surface-variant truncate">{notification.message}</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ACTIVITY STREAM
// ============================================================================

interface ActivityItem {
  id: number;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  action: string;
  target: string;
  time: string;
}

const activityTemplates = [
  { action: "commented on", target: "Project Overview" },
  { action: "uploaded a file to", target: "Design Assets" },
  { action: "completed task", target: "Setup CI/CD" },
  { action: "mentioned you in", target: "Team Discussion" },
  { action: "approved changes to", target: "Marketing Page" },
  { action: "created a new", target: "Feature Branch" },
];

const users = [
  { name: "Sarah Chen", initials: "SC" },
  { name: "Alex Kim", initials: "AK" },
  { name: "Jordan Lee", initials: "JL" },
  { name: "Taylor Swift", initials: "TS" },
  { name: "Morgan Davis", initials: "MD" },
];

function ActivityStream() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      user: users[0],
      action: "started the demo",
      target: "Activity Stream",
      time: "Just now",
    },
  ]);
  const [nextId, setNextId] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      const user = users[Math.floor(Math.random() * users.length)];
      const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];

      const newActivity: ActivityItem = {
        id: nextId,
        user,
        ...template,
        time: "Just now",
      };

      setActivities((prev) => [newActivity, ...prev].slice(0, 6));
      setNextId((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, [nextId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Stream
        </CardTitle>
        <CardDescription>Real-time feed of user actions and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-surface-container" />

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={cn(
                  "relative flex gap-3 pl-8",
                  index === 0 && "animate-in slide-in-from-left-4 fade-in duration-300",
                )}
              >
                {/* Timeline dot */}
                <div className="absolute left-[11px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />

                <Avatar className="h-8 w-8 shrink-0">
                  {activity.user.avatar && <AvatarImage src={activity.user.avatar} />}
                  <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    <span className="text-on-surface-variant">{activity.action}</span>{" "}
                    <span className="font-medium text-primary">{activity.target}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{activity.time}</p>
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
// PRESENCE INDICATORS
// ============================================================================

interface TeamMember {
  id: number;
  name: string;
  initials: string;
  status: "online" | "away" | "offline" | "busy";
  lastSeen?: string;
}

const teamMemberStatusColor: Record<TeamMember["status"], string> = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-destructive",
  offline: "bg-muted-foreground",
};

const teamMemberStatusText: Record<TeamMember["status"], string> = {
  online: "Online",
  away: "Away",
  busy: "Do not disturb",
  offline: "Offline",
};
const teamMemberStatusLegend: Array<{ status: TeamMember["status"]; label: string }> = [
  { status: "online", label: "Online" },
  { status: "away", label: "Away" },
  { status: "busy", label: "Busy" },
  { status: "offline", label: "Offline" },
];

function getTeamMemberStatusColor(status: TeamMember["status"]) {
  return teamMemberStatusColor[status];
}

function getTeamMemberStatusText(status: TeamMember["status"]) {
  return teamMemberStatusText[status];
}

function formatLiveCounterNumber(num: number) {
  return num.toLocaleString();
}

function PresenceIndicators() {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 1, name: "Sarah Chen", initials: "SC", status: "online" },
    { id: 2, name: "Alex Kim", initials: "AK", status: "away", lastSeen: "5m ago" },
    { id: 3, name: "Jordan Lee", initials: "JL", status: "busy" },
    { id: 4, name: "Taylor Swift", initials: "TS", status: "offline", lastSeen: "2h ago" },
    { id: 5, name: "Morgan Davis", initials: "MD", status: "online" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMembers((prev) => {
        const memberIndex = Math.floor(Math.random() * prev.length);
        const statuses: Array<"online" | "away" | "offline" | "busy"> = [
          "online",
          "away",
          "offline",
          "busy",
        ];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

        return prev.map((m, i) =>
          i === memberIndex
            ? {
                ...m,
                status: newStatus,
                lastSeen: newStatus === "offline" || newStatus === "away" ? "Just now" : undefined,
              }
            : m,
        );
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Presence Indicators
        </CardTitle>
        <CardDescription>User online status with live updates every 5 seconds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors"
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background transition-colors",
                    getTeamMemberStatusColor(member.status),
                    member.status === "online" && "animate-pulse",
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <Circle
                    className={cn(
                      "h-2 w-2 fill-current",
                      member.status === "online" && "text-success",
                      member.status === "away" && "text-warning",
                      member.status === "busy" && "text-destructive",
                      member.status === "offline" && "text-on-surface-variant",
                    )}
                  />
                  {getTeamMemberStatusText(member.status)}
                  {member.lastSeen && (
                    <span className="text-on-surface-variant/60"> - {member.lastSeen}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4">
          <p className="text-xs text-on-surface-variant mb-2">Status Legend</p>
          <div className="flex flex-wrap gap-4">
            {teamMemberStatusLegend.map(({ status, label }) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={cn("h-2.5 w-2.5 rounded-full", getTeamMemberStatusColor(status))} />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// TYPING INDICATORS
// ============================================================================

function TypingIndicators() {
  const [typingUsers, setTypingUsers] = useState<string[]>(["Sarah"]);
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const possibleUsers = ["Sarah", "Alex", "Jordan", "Taylor", "Morgan"];
      const count = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...possibleUsers].sort(() => 0.5 - Math.random());
      setTypingUsers(shuffled.slice(0, count));
      setShowIndicator(Math.random() > 0.3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]} and ${typingUsers[1]} are typing`;
    } else {
      return `${typingUsers[0]} and ${typingUsers.length - 1} others are typing`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Typing Indicators
        </CardTitle>
        <CardDescription>Shows when users are composing messages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat preview */}
        <div className="rounded-md bg-surface-container p-4 space-y-3">
          <div className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">JL</AvatarFallback>
            </Avatar>
            <div className="bg-background rounded-lg p-2 px-3 max-w-[80%]">
              <p className="text-sm">Hey team, how's the project going?</p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <div className="bg-primary text-primary-foreground rounded-lg p-2 px-3 max-w-[80%]">
              <p className="text-sm">Going great! Almost done with the feature.</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">ME</AvatarFallback>
            </Avatar>
          </div>

          {/* Typing indicator */}
          {showIndicator && (
            <div className="flex gap-2 items-end animate-in fade-in duration-200">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{typingUsers[0]?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="bg-background rounded-lg p-2 px-3">
                <div className="flex gap-1 items-center h-5">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Typing status text */}
        <div className="flex items-center gap-2 h-5">
          {showIndicator && (
            <p className="text-xs text-on-surface-variant animate-in fade-in">{getTypingText()}...</p>
          )}
        </div>

        {/* Standalone typing indicators */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Indicator Styles</p>
          <div className="flex flex-wrap gap-4">
            {/* Dots */}
            <div className="flex items-center gap-2 rounded-full bg-surface-container px-3 py-1.5">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce" />
              </div>
              <span className="text-xs text-on-surface-variant">Typing</span>
            </div>

            {/* Pulse */}
            <div className="flex items-center gap-2 rounded-full bg-surface-container px-3 py-1.5">
              <Radio className="h-3 w-3 animate-pulse text-primary" />
              <span className="text-xs text-on-surface-variant">Recording</span>
            </div>

            {/* Wave */}
            <div className="flex items-center gap-2 rounded-full bg-surface-container px-3 py-1.5">
              <div className="flex gap-0.5 items-end h-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${8 + Math.random() * 8}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-on-surface-variant">Speaking</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LIVE COUNTERS
// ============================================================================

function LiveCounters() {
  const [visitors, setVisitors] = useState(1247);
  const [activeUsers, setActiveUsers] = useState(89);
  const [pageViews, setPageViews] = useState(45892);
  const [conversions, setConversions] = useState(342);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuating visitor count
      setVisitors((prev) => prev + Math.floor(Math.random() * 5) - 2);
      setActiveUsers((prev) =>
        Math.max(50, Math.min(150, prev + Math.floor(Math.random() * 7) - 3)),
      );
      setPageViews((prev) => prev + Math.floor(Math.random() * 10));
      setConversions((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const counters = [
    {
      label: "Total Visitors",
      value: visitors,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active Now",
      value: activeUsers,
      icon: Zap,
      color: "text-success",
      bgColor: "bg-success/10",
      pulse: true,
    },
    {
      label: "Page Views",
      value: pageViews,
      icon: TrendingUp,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      label: "Conversions",
      value: conversions,
      icon: Check,
      color: "text-warning-foreground",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Live Counters
        </CardTitle>
        <CardDescription>Real-time statistics with animated number updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {counters.map((counter) => {
            const Icon = counter.icon;
            return (
              <div key={counter.label} className="rounded-md bg-surface-high p-4">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      counter.bgColor,
                    )}
                  >
                    <Icon className={cn("h-5 w-5", counter.color)} />
                  </div>
                  {counter.pulse && (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs text-success">Live</span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold tabular-nums transition-all">
                    {formatLiveCounterNumber(counter.value)}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">{counter.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// REAL-TIME UPDATES BADGE
// ============================================================================

function RealtimeUpdatesBadge() {
  const [updates, setUpdates] = useState(3);
  const [lastUpdate, setLastUpdate] = useState("Just now");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdates((prev) => prev + Math.floor(Math.random() * 3));
      setLastUpdate("Just now");
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate((prev) => {
        if (prev === "Just now") return "1m ago";
        const match = prev.match(/(\d+)m ago/);
        if (match) {
          const mins = parseInt(match[1]);
          return `${mins + 1}m ago`;
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setUpdates(0);
      setLastUpdate("Just now");
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Real-time Updates Badge
        </CardTitle>
        <CardDescription>Notification badges and refresh indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Update banner */}
        {updates > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">
                {updates} new update{updates !== 1 ? "s" : ""} available
              </span>
            </div>
            <Button size="sm" variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-4 w-4 mr-1", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        )}

        {/* Badge examples */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Badge Styles</p>
          <div className="flex flex-wrap items-center gap-4">
            {/* Icon with badge */}
            <div className="relative">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              {updates > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-in zoom-in"
                >
                  {updates > 9 ? "9+" : updates}
                </Badge>
              )}
            </div>

            {/* Dot indicator */}
            <div className="relative">
              <Button variant="outline" size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-pulse" />
            </div>

            {/* Text badge */}
            <Badge className="gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live
            </Badge>

            {/* Update available */}
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              Updated {lastUpdate}
            </Badge>
          </div>
        </div>

        {/* Sync status */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Sync Status</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-surface-high px-3 py-1.5">
              <RefreshCw className="h-3 w-3 animate-spin text-primary" />
              <span className="text-xs">Syncing...</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5">
              <Check className="h-3 w-3 text-success" />
              <span className="text-xs text-success">Synced</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5">
              <WifiOff className="h-3 w-3 text-destructive" />
              <span className="text-xs text-destructive">Offline</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// CONNECTION STATUS
// ============================================================================

function ConnectionStatus() {
  const [status, setStatus] = useState<
    "connected" | "connecting" | "disconnected" | "reconnecting"
  >("connected");
  const [latency, setLatency] = useState(42);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    // Simulate connection status changes
    const statusInterval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.9) {
        setStatus("disconnected");
        setReconnectAttempts(0);
      } else if (rand > 0.85) {
        setStatus("reconnecting");
        setReconnectAttempts((prev) => prev + 1);
      } else {
        setStatus("connected");
        setReconnectAttempts(0);
      }
    }, 6000);

    // Simulate latency fluctuation
    const latencyInterval = setInterval(() => {
      setLatency(Math.floor(30 + Math.random() * 50));
    }, 2000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(latencyInterval);
    };
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: Wifi,
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/30",
          label: "Connected",
          description: `Latency: ${latency}ms`,
        };
      case "connecting":
        return {
          icon: Wifi,
          color: "text-warning-foreground",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/30",
          label: "Connecting...",
          description: "Establishing connection",
        };
      case "disconnected":
        return {
          icon: WifiOff,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/30",
          label: "Disconnected",
          description: "No connection to server",
        };
      case "reconnecting":
        return {
          icon: RefreshCw,
          color: "text-warning-foreground",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/30",
          label: "Reconnecting...",
          description: `Attempt ${reconnectAttempts}`,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Connection Status
        </CardTitle>
        <CardDescription>WebSocket or real-time connection indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main status display */}
        <div
          className={cn(
            "flex items-center gap-4 p-4 rounded-md transition-all",
            config.bgColor,
            config.borderColor,
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              config.bgColor,
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                config.color,
                (status === "connecting" || status === "reconnecting") && "animate-spin",
              )}
            />
          </div>
          <div className="flex-1">
            <p className={cn("font-semibold", config.color)}>{config.label}</p>
            <p className="text-sm text-on-surface-variant">{config.description}</p>
          </div>
          {status === "connected" && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-on-surface-variant">Live</span>
            </div>
          )}
        </div>

        {/* Latency indicator */}
        {status === "connected" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Network Latency</span>
              <span className="font-mono">{latency}ms</span>
            </div>
            <div className="h-2 rounded-full bg-surface-container overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  latency < 50 && "bg-success",
                  latency >= 50 && latency < 80 && "bg-warning",
                  latency >= 80 && "bg-destructive",
                )}
                style={{ width: `${Math.min(100, (latency / 100) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>Excellent</span>
              <span>Good</span>
              <span>Poor</span>
            </div>
          </div>
        )}

        {/* Connection quality indicators */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Signal Strength Variants</p>
          <div className="flex flex-wrap gap-4">
            {/* Full bars */}
            <div className="flex items-center gap-2 rounded-lg border p-2 px-3">
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 h-1 rounded-sm bg-success" />
                <div className="w-1 h-2 rounded-sm bg-success" />
                <div className="w-1 h-3 rounded-sm bg-success" />
                <div className="w-1 h-4 rounded-sm bg-success" />
              </div>
              <span className="text-xs">Excellent</span>
            </div>

            {/* Medium bars */}
            <div className="flex items-center gap-2 rounded-lg border p-2 px-3">
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 h-1 rounded-sm bg-warning" />
                <div className="w-1 h-2 rounded-sm bg-warning" />
                <div className="w-1 h-3 rounded-sm bg-surface-container" />
                <div className="w-1 h-4 rounded-sm bg-surface-container" />
              </div>
              <span className="text-xs">Fair</span>
            </div>

            {/* Low bars */}
            <div className="flex items-center gap-2 rounded-lg border p-2 px-3">
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 h-1 rounded-sm bg-destructive" />
                <div className="w-1 h-2 rounded-sm bg-surface-container" />
                <div className="w-1 h-3 rounded-sm bg-surface-container" />
                <div className="w-1 h-4 rounded-sm bg-surface-container" />
              </div>
              <span className="text-xs">Poor</span>
            </div>

            {/* No connection */}
            <div className="flex items-center gap-2 rounded-lg border p-2 px-3">
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 h-1 rounded-sm bg-surface-container" />
                <div className="w-1 h-2 rounded-sm bg-surface-container" />
                <div className="w-1 h-3 rounded-sm bg-surface-container" />
                <div className="w-1 h-4 rounded-sm bg-surface-container" />
              </div>
              <span className="text-xs">None</span>
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

function RealtimePage() {
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
              <h1 className="font-display text-xl font-bold tracking-tight">Real-time Patterns</h1>
              <p className="text-on-surface-variant text-sm">
                Live updates, notifications, and presence indicators
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-8 px-6 space-y-16">
        <LiveNotifications />
        <ActivityStream />
        <div className="grid md:grid-cols-2 gap-6">
          <PresenceIndicators />
          <TypingIndicators />
        </div>
        <LiveCounters />
        <div className="grid md:grid-cols-2 gap-6">
          <RealtimeUpdatesBadge />
          <ConnectionStatus />
        </div>

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
