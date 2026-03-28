import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Database,
  FileQuestion,
  FolderOpen,
  Home,
  Inbox,
  Lock,
  LogIn,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  ServerCrash,
  ShieldX,
  Upload,
  WifiOff,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/style-guide/empty-states")({
  component: EmptyStatesPage,
});

// ============================================================================
// EMPTY TABLE STATE
// ============================================================================

function EmptyTableExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Empty Table</CardTitle>
        <CardDescription>When a data table has no records to display</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="h-48">
                <Empty className="border-0">
                  <EmptyMedia>
                    <Inbox className="h-12 w-12 text-on-surface-variant/50" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No users found</EmptyTitle>
                    <EmptyDescription>
                      There are no users matching your criteria. Try adjusting your filters or add a
                      new user.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </EmptyContent>
                </Empty>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EMPTY SEARCH RESULTS
// ============================================================================

function EmptySearchExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Empty Search Results</CardTitle>
        <CardDescription>When a search query returns no matching results</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-[280px]">
          <EmptyMedia>
            <Search className="h-12 w-12 text-on-surface-variant/50" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No results for "quantum flux capacitor"</EmptyTitle>
            <EmptyDescription>
              We couldn't find anything matching your search. Try different keywords or check your
              spelling.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Clear Search
              </Button>
              <Button variant="ghost" size="sm">
                Browse All
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// NO DATA YET (ONBOARDING)
// ============================================================================

function NoDataOnboardingExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Data Yet (Onboarding)</CardTitle>
        <CardDescription>First-time experience when a feature has no content</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-[320px] bg-gradient-to-b from-primary/5 to-transparent">
          <EmptyMedia>
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Rocket className="h-8 w-8" />
              </div>
            </div>
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-lg">Create your first project</EmptyTitle>
            <EmptyDescription className="text-sm">
              Projects help you organize your work and collaborate with your team. Get started by
              creating your first one.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
            <Button variant="link" size="sm" className="text-on-surface-variant">
              Learn more about projects
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 404 PAGE MOCKUP
// ============================================================================

function NotFoundExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>404 Page Not Found</CardTitle>
        <CardDescription>When a user navigates to a non-existent page</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-[320px]">
          <EmptyMedia>
            <FileQuestion className="h-16 w-16 text-on-surface-variant/50" />
          </EmptyMedia>
          <EmptyHeader>
            <div className="text-6xl font-bold text-on-surface-variant/30">404</div>
            <EmptyTitle className="text-lg">Page not found</EmptyTitle>
            <EmptyDescription>
              The page you're looking for doesn't exist or has been moved. Please check the URL or
              navigate back to safety.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button size="sm">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 500 ERROR PAGE MOCKUP
// ============================================================================

function ServerErrorExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>500 Server Error</CardTitle>
        <CardDescription>When an unexpected server error occurs</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-[320px] bg-destructive/5">
          <EmptyMedia>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ServerCrash className="h-8 w-8 text-destructive" />
            </div>
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-lg text-destructive">Something went wrong</EmptyTitle>
            <EmptyDescription>
              We're having trouble processing your request. Our team has been notified and is
              working to fix this issue.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="ghost" size="sm">
                Report Issue
              </Button>
            </div>
            <p className="mt-2 font-mono text-xs text-on-surface-variant">
              Error ID: ERR_5XX_1234567890
            </p>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// OFFLINE STATE
// ============================================================================

function OfflineStateExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Offline State</CardTitle>
        <CardDescription>When the user loses internet connectivity</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-[280px] bg-warning/5">
          <EmptyMedia>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
              <WifiOff className="h-8 w-8 text-warning-foreground" />
            </div>
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-lg">You're offline</EmptyTitle>
            <EmptyDescription>
              It looks like you've lost your internet connection. Some features may be unavailable
              until you reconnect.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
            <p className="mt-2 text-xs text-on-surface-variant">
              Offline changes will be synced when you're back online
            </p>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PERMISSION DENIED
// ============================================================================

function PermissionDeniedExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Denied</CardTitle>
        <CardDescription>When a user doesn't have access to a resource</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-[280px]">
          <EmptyMedia>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
              <ShieldX className="h-8 w-8 text-on-surface-variant" />
            </div>
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-lg">Access Denied</EmptyTitle>
            <EmptyDescription>
              You don't have permission to view this resource. Contact your administrator if you
              believe this is a mistake.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button variant="ghost" size="sm">
                Request Access
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SESSION EXPIRED
// ============================================================================

function SessionExpiredExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Expired</CardTitle>
        <CardDescription>When a user's authentication session has timed out</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-[280px]">
          <EmptyMedia>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
              <Clock className="h-8 w-8 text-on-surface-variant" />
            </div>
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-lg">Session Expired</EmptyTitle>
            <EmptyDescription>
              Your session has timed out for security reasons. Please sign in again to continue
              where you left off.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In Again
            </Button>
            <p className="mt-2 text-xs text-on-surface-variant">
              Sessions expire after 30 minutes of inactivity
            </p>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ADDITIONAL EXAMPLES - COMPACT VARIANTS
// ============================================================================

function CompactEmptyStates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compact Empty States</CardTitle>
        <CardDescription>
          Smaller empty states for inline use in dashboards and sidebars
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Empty folder */}
          <div className="rounded-md bg-surface-high p-4">
            <Empty className="border-0 p-2">
              <EmptyMedia variant="icon">
                <FolderOpen className="h-4 w-4" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No files</EmptyTitle>
                <EmptyDescription>This folder is empty</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" size="xs">
                  <Upload className="mr-1 h-3 w-3" />
                  Upload
                </Button>
              </EmptyContent>
            </Empty>
          </div>

          {/* Empty database */}
          <div className="rounded-md bg-surface-high p-4">
            <Empty className="border-0 p-2">
              <EmptyMedia variant="icon">
                <Database className="h-4 w-4" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No records</EmptyTitle>
                <EmptyDescription>The database is empty</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" size="xs">
                  <Plus className="mr-1 h-3 w-3" />
                  Add Record
                </Button>
              </EmptyContent>
            </Empty>
          </div>

          {/* Restricted content */}
          <div className="rounded-md bg-surface-high p-4">
            <Empty className="border-0 p-2">
              <EmptyMedia variant="icon">
                <Lock className="h-4 w-4" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Restricted</EmptyTitle>
                <EmptyDescription>Upgrade to access this feature</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="xs">Upgrade</Button>
              </EmptyContent>
            </Empty>
          </div>

          {/* Maintenance */}
          <div className="rounded-md bg-surface-high p-4">
            <Empty className="border-0 p-2">
              <EmptyMedia variant="icon">
                <AlertTriangle className="h-4 w-4" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Maintenance</EmptyTitle>
                <EmptyDescription>This feature is being updated</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <span className="text-xs text-on-surface-variant">Back soon</span>
              </EmptyContent>
            </Empty>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function EmptyStatesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-surface-high/80 backdrop-blur-[20px]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/style-guide"
              className="flex items-center gap-2 text-on-surface-variant transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Style Guide</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">Empty & Error States</h1>
              <p className="text-sm text-on-surface-variant">
                Patterns for handling empty data, errors, and edge cases
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-5xl space-y-16 px-6 py-8">
        <EmptyTableExample />
        <EmptySearchExample />
        <NoDataOnboardingExample />
        <NotFoundExample />
        <ServerErrorExample />
        <OfflineStateExample />
        <PermissionDeniedExample />
        <SessionExpiredExample />
        <CompactEmptyStates />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
