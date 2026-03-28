import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calculator,
  Calendar,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  FileText,
  Folder,
  Hash,
  Home,
  Layers,
  Mail,
  MessageSquare,
  Moon,
  Palette,
  Plus,
  Search,
  Settings,
  Smile,
  Sun,
  Trash,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/style-guide/command-palette")({
  component: CommandPalettePage,
});

// ============================================================================
// EXAMPLE 1: Basic Command Menu
// ============================================================================

function BasicCommandMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Command Menu</CardTitle>
        <CardDescription>
          Press <Kbd>Cmd</Kbd> <Kbd>K</Kbd> or click the button to open
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Search className="mr-2 h-4 w-4" />
          Open Command Menu
          <div className="ml-auto flex items-center gap-1">
            <Kbd>Cmd</Kbd>
            <Kbd>K</Kbd>
          </div>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </CommandItem>
                <CommandItem>
                  <Smile className="mr-2 h-4 w-4" />
                  Search Emoji
                </CommandItem>
                <CommandItem>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculator
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                  <CommandShortcut>Cmd P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                  <CommandShortcut>Cmd B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                  <CommandShortcut>Cmd S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 2: Search with Fuzzy Matching
// ============================================================================

const searchItems = [
  { id: 1, name: "Dashboard", icon: Home, category: "Pages" },
  { id: 2, name: "User Management", icon: Users, category: "Pages" },
  { id: 3, name: "Analytics Overview", icon: Layers, category: "Pages" },
  { id: 4, name: "Create New Project", icon: Plus, category: "Actions" },
  { id: 5, name: "Import Data", icon: FileText, category: "Actions" },
  { id: 6, name: "Export Reports", icon: Copy, category: "Actions" },
  { id: 7, name: "Account Settings", icon: Settings, category: "Settings" },
  { id: 8, name: "Billing & Payments", icon: CreditCard, category: "Settings" },
  { id: 9, name: "Notifications", icon: Mail, category: "Settings" },
  { id: 10, name: "Delete Account", icon: Trash, category: "Danger Zone" },
];

function FuzzySearchDemo() {
  const [open, setOpen] = useState(false);

  const groupedItems = searchItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof searchItems>,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search with Fuzzy Matching</CardTitle>
        <CardDescription>Built-in fuzzy search filters results as you type</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Search className="mr-2 h-4 w-4" />
          Search everything...
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command>
            <CommandInput placeholder="Search pages, actions, settings..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {Object.entries(groupedItems).map(([category, items]) => (
                <CommandGroup key={category} heading={category}>
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <CommandItem key={item.id}>
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </CommandDialog>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 3: Command Groups/Sections
// ============================================================================

function CommandGroupsDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Command Groups/Sections</CardTitle>
        <CardDescription>Organize commands into logical groups with headings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high">
          <Command className="rounded-lg">
            <CommandInput placeholder="Type a command..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup heading="Quick Actions">
                <CommandItem>
                  <Plus className="mr-2 h-4 w-4" />
                  New File
                  <CommandShortcut>Cmd N</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Folder className="mr-2 h-4 w-4" />
                  New Folder
                  <CommandShortcut>Cmd Shift N</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                  <CommandShortcut>Cmd D</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Navigation">
                <CommandItem>
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                  <CommandShortcut>G H</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Go to Settings
                  <CommandShortcut>G S</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  Go to Profile
                  <CommandShortcut>G P</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Help">
                <CommandItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Support
                </CommandItem>
                <CommandItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Documentation
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 4: Recent Items
// ============================================================================

const recentItems = [
  { id: 1, name: "Project Alpha", type: "project", time: "2 min ago" },
  { id: 2, name: "Design System Doc", type: "document", time: "15 min ago" },
  { id: 3, name: "Q4 Planning", type: "project", time: "1 hour ago" },
  { id: 4, name: "Team Meeting Notes", type: "document", time: "3 hours ago" },
  { id: 5, name: "API Integration", type: "project", time: "Yesterday" },
];

function RecentItemsDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Items</CardTitle>
        <CardDescription>Show recently accessed items for quick navigation</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Clock className="mr-2 h-4 w-4" />
          Recent Items
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command>
            <CommandInput placeholder="Search recent items..." />
            <CommandList>
              <CommandEmpty>No recent items found.</CommandEmpty>

              <CommandGroup heading="Recent">
                {recentItems.map((item) => (
                  <CommandItem key={item.id} className="justify-between">
                    <div className="flex items-center">
                      {item.type === "project" ? (
                        <Folder className="mr-2 h-4 w-4 text-blue-500" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4 text-green-500" />
                      )}
                      {item.name}
                    </div>
                    <span className="text-xs text-on-surface-variant">{item.time}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Actions">
                <CommandItem>
                  <Trash className="mr-2 h-4 w-4" />
                  Clear Recent Items
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 5: Keyboard Navigation Demo
// ============================================================================

function KeyboardNavigationDemo() {
  const [_selectedIndex, setSelectedIndex] = useState(0);

  const items = [
    { id: 1, name: "First Item", shortcut: "1" },
    { id: 2, name: "Second Item", shortcut: "2" },
    { id: 3, name: "Third Item", shortcut: "3" },
    { id: 4, name: "Fourth Item", shortcut: "4" },
    { id: 5, name: "Fifth Item", shortcut: "5" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyboard Navigation</CardTitle>
        <CardDescription>Use arrow keys to navigate, Enter to select</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm text-on-surface-variant">
          <div className="flex items-center gap-1">
            <Kbd>Up</Kbd> <Kbd>Down</Kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <Kbd>Enter</Kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-1">
            <Kbd>Esc</Kbd>
            <span>Close</span>
          </div>
        </div>

        <div className="rounded-md bg-surface-high">
          <Command>
            <CommandInput placeholder="Try navigating with arrow keys..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Items">
                {items.map((item, index) => (
                  <CommandItem key={item.id} onSelect={() => setSelectedIndex(index)}>
                    <Hash className="mr-2 h-4 w-4" />
                    {item.name}
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 6: Nested Commands/Submenus
// ============================================================================

type Page = "main" | "theme" | "create";

function NestedCommandsDemo() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<Page>("main");

  const handleSelect = useCallback((callback: () => void) => {
    callback();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nested Commands/Submenus</CardTitle>
        <CardDescription>Navigate through nested command pages</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          onClick={() => {
            setPage("main");
            setOpen(true);
          }}
        >
          <Layers className="mr-2 h-4 w-4" />
          Open Nested Menu
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command>
            <CommandInput
              placeholder={
                page === "main"
                  ? "What do you need?"
                  : page === "theme"
                    ? "Select a theme..."
                    : "What would you like to create?"
              }
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {page === "main" && (
                <>
                  <CommandGroup heading="Actions">
                    <CommandItem onSelect={() => handleSelect(() => setPage("create"))}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New...
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </CommandItem>
                    <CommandItem onSelect={() => handleSelect(() => setPage("theme"))}>
                      <Palette className="mr-2 h-4 w-4" />
                      Change Theme...
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Quick Links">
                    <CommandItem>
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </CommandItem>
                    <CommandItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </CommandItem>
                  </CommandGroup>
                </>
              )}

              {page === "theme" && (
                <>
                  <CommandItem onSelect={() => setPage("main")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </CommandItem>
                  <CommandSeparator />
                  <CommandGroup heading="Themes">
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </CommandItem>
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </CommandItem>
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Settings className="mr-2 h-4 w-4" />
                      System Default
                    </CommandItem>
                  </CommandGroup>
                </>
              )}

              {page === "create" && (
                <>
                  <CommandItem onSelect={() => setPage("main")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </CommandItem>
                  <CommandSeparator />
                  <CommandGroup heading="Create">
                    <CommandItem onSelect={() => setOpen(false)}>
                      <FileText className="mr-2 h-4 w-4" />
                      New Document
                    </CommandItem>
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Folder className="mr-2 h-4 w-4" />
                      New Project
                    </CommandItem>
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Users className="mr-2 h-4 w-4" />
                      New Team
                    </CommandItem>
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Zap className="mr-2 h-4 w-4" />
                      New Automation
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </CommandDialog>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 7: With Icons and Shortcuts Display
// ============================================================================

function IconsAndShortcutsDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Icons and Shortcuts Display</CardTitle>
        <CardDescription>Commands with icons and keyboard shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high">
          <Command className="rounded-lg">
            <CommandInput placeholder="Search commands..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup heading="File">
                <CommandItem>
                  <Plus className="mr-2 h-4 w-4" />
                  New File
                  <CommandShortcut>Cmd N</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Folder className="mr-2 h-4 w-4" />
                  Open Folder
                  <CommandShortcut>Cmd O</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Save
                  <CommandShortcut>Cmd S</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Save As
                  <CommandShortcut>Cmd Shift S</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Edit">
                <CommandItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                  <CommandShortcut>Cmd C</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Paste
                  <CommandShortcut>Cmd V</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Search className="mr-2 h-4 w-4" />
                  Find
                  <CommandShortcut>Cmd F</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Search className="mr-2 h-4 w-4" />
                  Find and Replace
                  <CommandShortcut>Cmd H</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="View">
                <CommandItem>
                  <Layers className="mr-2 h-4 w-4" />
                  Toggle Sidebar
                  <CommandShortcut>Cmd B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Sun className="mr-2 h-4 w-4" />
                  Toggle Theme
                  <CommandShortcut>Cmd Shift T</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Zap className="mr-2 h-4 w-4" />
                  Command Palette
                  <CommandShortcut>Cmd K</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function CommandPalettePage() {
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
              <h1 className="text-xl font-display font-bold tracking-tight">Command Palette Patterns</h1>
              <p className="text-on-surface-variant text-sm">
                Keyboard-driven navigation and command interfaces
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-8 px-6 space-y-16">
        <BasicCommandMenu />
        <FuzzySearchDemo />
        <CommandGroupsDemo />
        <RecentItemsDemo />
        <KeyboardNavigationDemo />
        <NestedCommandsDemo />
        <IconsAndShortcutsDemo />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
