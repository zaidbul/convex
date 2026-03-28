import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Bell,
  Check,
  ChevronRight,
  Copy,
  Edit,
  Home,
  Info,
  Mail,
  MoreHorizontal,
  Search,
  Settings,
  Share,
  Trash,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/")({
  component: StyleGuideIndex,
});

const sectionGroups = [
  {
    title: "Basics",
    sections: [
      { id: "colors", label: "Colors" },
      { id: "typography", label: "Typography" },
      { id: "spacing", label: "Spacing" },
    ],
  },
  {
    title: "Components",
    sections: [
      { id: "buttons", label: "Buttons" },
      { id: "badges", label: "Badges" },
      { id: "cards", label: "Cards" },
      { id: "forms", label: "Forms" },
      { id: "tables", label: "Tables" },
      { id: "dialogs", label: "Dialogs" },
      { id: "dropdowns", label: "Dropdowns" },
      { id: "tooltips", label: "Tooltips" },
      { id: "toasts", label: "Toasts" },
      { id: "skeleton", label: "Skeleton" },
      { id: "accordion", label: "Accordion" },
      { id: "breadcrumbs", label: "Breadcrumbs" },
      { id: "kbd", label: "Keyboard" },
      { id: "alerts", label: "Alerts" },
      { id: "avatars", label: "Avatars" },
      { id: "progress", label: "Progress" },
      { id: "tabs", label: "Tabs" },
    ],
  },
];

// Flatten for intersection observer
const allSections = sectionGroups.flatMap((group) => group.sections);

function NavLink({
  id,
  label,
  isActive,
  onClick,
}: {
  id: string;
  label: string;
  isActive: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      href={`#${id}`}
      onClick={onClick}
      aria-current={isActive ? "location" : undefined}
      className={cn(
        "block px-3 py-1.5 text-sm transition-colors rounded-md",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-surface-container",
      )}
    >
      {label}
    </a>
  );
}

function SectionHeader({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div id={id} className="scroll-mt-8 pb-4">
      <h2 className="text-xl font-display font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground text-sm mt-1">{description}</p>
    </div>
  );
}

function ColorSwatch({
  name,
  variable,
  className,
}: {
  name: string;
  variable: string;
  className: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={cn("h-12 w-full rounded-lg border border-outline-variant/15", className)} />
      <div>
        <p className="text-xs font-medium">{name}</p>
        <p className="text-[10px] text-muted-foreground font-mono">{variable}</p>
      </div>
    </div>
  );
}

function StyleGuideIndex() {
  const [activeSection, setActiveSection] = useState("colors");

  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;
      if (allSections.some((section) => section.id === id)) {
        setActiveSection(id);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    allSections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex">
      {/* Section Navigation - Sticky, stays in place while content scrolls */}
      <nav className="w-40 shrink-0 hidden lg:block bg-surface-low sticky top-0 h-screen overflow-y-auto">
        <div className="pt-6 pb-10 px-3 space-y-6">
          {sectionGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </p>
              {group.sections.map(({ id, label }) => (
                <NavLink
                  key={id}
                  id={id}
                  label={label}
                  isActive={activeSection === id}
                  onClick={() => setActiveSection(id)}
                />
              ))}
            </div>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Page Header */}
        <div className="px-6 lg:px-12 py-6 bg-surface-high/80 backdrop-blur-[20px]">
          <h1 className="text-2xl font-display font-bold tracking-tight">Theme & Basics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Colors, typography, spacing, and core UI components
          </p>
        </div>

        <div className="py-16 pb-24 px-6 lg:px-12 space-y-20 max-w-4xl">
          {/* ================================================================
              COLORS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="colors"
              title="Colors"
              description="Our color system uses OKLCH color space with three ramps: neutral, brand, and accent."
            />

            {/* Semantic Colors */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Semantic Colors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  <ColorSwatch
                    name="Background"
                    variable="--background"
                    className="bg-background"
                  />
                  <ColorSwatch
                    name="Foreground"
                    variable="--foreground"
                    className="bg-foreground"
                  />
                  <ColorSwatch name="Primary" variable="--primary" className="bg-primary" />
                  <ColorSwatch name="Secondary" variable="--secondary" className="bg-secondary" />
                  <ColorSwatch name="Muted" variable="--muted" className="bg-muted" />
                  <ColorSwatch name="Accent" variable="--accent" className="bg-accent" />
                </div>
              </div>

              {/* Neutral Ramp */}
              <div>
                <h3 className="text-sm font-medium mb-3">Neutral Ramp</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                  {[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => (
                    <ColorSwatch
                      key={step}
                      name={`${step}`}
                      variable={`neutral-${step}`}
                      className={`bg-neutral-${step}`}
                    />
                  ))}
                </div>
              </div>

              {/* Brand Ramp */}
              <div>
                <h3 className="text-sm font-medium mb-3">Brand Ramp</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => (
                    <ColorSwatch
                      key={step}
                      name={`${step}`}
                      variable={`brand-${step}`}
                      className={`bg-brand-${step}`}
                    />
                  ))}
                </div>
              </div>

              {/* Accent Ramp */}
              <div>
                <h3 className="text-sm font-medium mb-3">Accent Ramp (Secondary)</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => (
                    <ColorSwatch
                      key={step}
                      name={`${step}`}
                      variable={`accent-${step}`}
                      className={`bg-accent-${step}`}
                    />
                  ))}
                </div>
              </div>

              {/* Status Colors */}
              <div>
                <h3 className="text-sm font-medium mb-3">Status Colors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ColorSwatch name="Success" variable="--success" className="bg-success" />
                  <ColorSwatch name="Warning" variable="--warning" className="bg-warning" />
                  <ColorSwatch name="Info" variable="--info" className="bg-info" />
                  <ColorSwatch
                    name="Destructive"
                    variable="--destructive"
                    className="bg-destructive"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              TYPOGRAPHY SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="typography"
              title="Typography"
              description="Two font families: Plus Jakarta Sans for UI and Source Serif 4 for editorial content."
            />

            <div className="space-y-8">
              {/* Font Families */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sans Serif</CardTitle>
                    <CardDescription>Plus Jakarta Sans - UI & Interface</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-sans text-2xl">
                      The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="font-sans text-sm text-muted-foreground mt-2">
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                      <br />
                      abcdefghijklmnopqrstuvwxyz
                      <br />
                      0123456789
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Serif</CardTitle>
                    <CardDescription>Source Serif 4 - Editorial Content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-serif text-2xl">
                      The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="font-serif text-sm text-muted-foreground mt-2">
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                      <br />
                      abcdefghijklmnopqrstuvwxyz
                      <br />
                      0123456789
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Heading Scale */}
              <div>
                <h3 className="text-sm font-medium mb-4">Heading Scale</h3>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">text-4xl</span>
                      <h1 className="text-4xl font-bold tracking-tight">Page Title</h1>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">text-3xl</span>
                      <h2 className="text-3xl font-semibold tracking-tight">Section Header</h2>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">text-2xl</span>
                      <h3 className="text-2xl font-semibold tracking-tight">Card Title Large</h3>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">text-xl</span>
                      <h4 className="text-xl font-semibold">Subsection</h4>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">text-lg</span>
                      <h5 className="text-lg font-medium">Card Title</h5>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">text-sm</span>
                      <h6 className="text-sm font-medium">Label / Caption</h6>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Body Text */}
              <div>
                <h3 className="text-sm font-medium mb-4">Body Text</h3>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Default (text-sm)</p>
                      <p className="text-sm">
                        This is the default body text size used throughout the application. It
                        provides good readability for general content and UI elements.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Small (text-xs)</p>
                      <p className="text-xs">
                        Smaller text is used for captions, helper text, and secondary information
                        that doesn't need primary emphasis.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Muted</p>
                      <p className="text-sm text-muted-foreground">
                        Muted text is used for descriptions, secondary content, and supporting
                        information.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              SPACING SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="spacing"
              title="Spacing"
              description="Consistent spacing scale for layouts and components."
            />

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-xs text-muted-foreground mb-4">Spacing Scale (Tailwind)</h3>
                  <div className="space-y-3">
                    {[
                      { name: "gap-1", value: "0.25rem (4px)" },
                      { name: "gap-2", value: "0.5rem (8px)" },
                      { name: "gap-3", value: "0.75rem (12px)" },
                      { name: "gap-4", value: "1rem (16px)" },
                      { name: "gap-6", value: "1.5rem (24px)" },
                      { name: "gap-8", value: "2rem (32px)" },
                    ].map(({ name, value }) => (
                      <div key={name} className="flex items-center gap-4">
                        <span className="text-xs font-mono w-16">{name}</span>
                        <div
                          className={cn("h-4 bg-primary/20 rounded", name.replace("gap-", "w-"))}
                          style={{ width: value.split(" ")[0] }}
                        />
                        <span className="text-xs text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs text-muted-foreground mb-4">Border Radius</h3>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { name: "rounded-sm", class: "rounded-sm" },
                      { name: "rounded-md", class: "rounded-md" },
                      { name: "rounded-lg", class: "rounded-lg" },
                      { name: "rounded-xl", class: "rounded-xl" },
                      { name: "rounded-full", class: "rounded-full" },
                    ].map(({ name, class: cls }) => (
                      <div key={name} className="flex flex-col items-center gap-2">
                        <div
                          className={cn("h-12 w-12 bg-primary/20 border border-outline-variant/15", cls)}
                        />
                        <span className="text-xs font-mono">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              BUTTONS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="buttons"
              title="Buttons"
              description="Buttons with multiple variants and sizes for different contexts."
            />

            <div className="space-y-8">
              {/* Variants */}
              <div>
                <h3 className="text-sm font-medium mb-4">Variants</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3">
                      <Button variant="default">Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="link">Link</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-medium mb-4">Sizes</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="xs">Extra Small</Button>
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="text-sm font-medium mb-4">With Icons</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                      <Button variant="outline">
                        Settings
                        <Settings className="ml-2 h-4 w-4" />
                      </Button>
                      <Button size="icon">
                        <Search />
                      </Button>
                      <Button size="icon-sm" variant="ghost">
                        <X />
                      </Button>
                      <Button size="icon-lg" variant="outline">
                        <Bell />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* States */}
              <div>
                <h3 className="text-sm font-medium mb-4">States</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button>Normal</Button>
                      <Button disabled>Disabled</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              BADGES SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="badges"
              title="Badges"
              description="Compact labels for status, categories, and metadata."
            />

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">With Icons</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>
                      <Check className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                    <Badge variant="secondary">
                      <User className="mr-1 h-3 w-3" />
                      Admin
                    </Badge>
                    <Badge variant="outline">
                      <Bell className="mr-1 h-3 w-3" />3 new
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">Status Examples</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-success/20 text-success-foreground border-success/30">
                      Active
                    </Badge>
                    <Badge className="bg-warning/20 text-warning-foreground border-warning/30">
                      Pending
                    </Badge>
                    <Badge className="bg-info/20 text-info-foreground border-info/30">
                      In Review
                    </Badge>
                    <Badge variant="destructive">Expired</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              CARDS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="cards"
              title="Cards"
              description="Container components for grouping related content."
            />

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>A simple card with header and content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card content goes here. Use cards to group related information together.
                  </p>
                </CardContent>
              </Card>

              {/* Card with Footer */}
              <Card>
                <CardHeader>
                  <CardTitle>Card with Footer</CardTitle>
                  <CardDescription>Includes actions in the footer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This card has a footer with action buttons.
                  </p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm">Save</Button>
                  <Button size="sm" variant="outline">
                    Cancel
                  </Button>
                </CardFooter>
              </Card>

              {/* Small Card */}
              <Card size="sm">
                <CardHeader>
                  <CardTitle>Small Card</CardTitle>
                  <CardDescription>Compact variant</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Uses size="sm" for tighter padding.
                  </p>
                </CardContent>
              </Card>

              {/* Interactive Card */}
              <Card className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Interactive Card
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>Clickable with hover state</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Add hover styles for clickable cards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              FORMS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="forms"
              title="Forms"
              description="Input components for collecting user data."
            />

            <div className="grid md:grid-cols-2 gap-6">
              {/* Text Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle>Text Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default">Default Input</Label>
                    <Input id="default" placeholder="Enter text..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabled">Disabled</Label>
                    <Input id="disabled" disabled placeholder="Disabled..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="with-icon">With Icon</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="with-icon" className="pl-9" placeholder="Search..." />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Textarea */}
              <Card>
                <CardHeader>
                  <CardTitle>Textarea</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Type your message..." rows={4} />
                  </div>
                </CardContent>
              </Card>

              {/* Select */}
              <Card>
                <CardHeader>
                  <CardTitle>Select</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Choose an option</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Checkbox & Radio */}
              <Card>
                <CardHeader>
                  <CardTitle>Checkbox & Radio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Checkboxes</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="check1" />
                        <Label htmlFor="check1" className="font-normal">
                          Option A
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="check2" defaultChecked />
                        <Label htmlFor="check2" className="font-normal">
                          Option B (checked)
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Radio Group</Label>
                    <RadioGroup defaultValue="radio1">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="radio1" id="radio1" />
                        <Label htmlFor="radio1" className="font-normal">
                          First choice
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="radio2" id="radio2" />
                        <Label htmlFor="radio2" className="font-normal">
                          Second choice
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Switch */}
              <Card>
                <CardHeader>
                  <CardTitle>Switch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Enable notifications</Label>
                    <Switch id="notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing">Marketing emails</Label>
                    <Switch id="marketing" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              TABLES SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="tables"
              title="Tables"
              description="Display tabular data with sorting, selection, and actions."
            />

            <div className="space-y-8">
              {/* Basic Table */}
              <div>
                <h3 className="text-sm font-medium mb-4">Basic Table</h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Invoice</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">INV001</TableCell>
                          <TableCell>
                            <Badge className="bg-success/20 text-success-foreground border-success/30">
                              Paid
                            </Badge>
                          </TableCell>
                          <TableCell>Credit Card</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">INV002</TableCell>
                          <TableCell>
                            <Badge className="bg-warning/20 text-warning-foreground border-warning/30">
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell>PayPal</TableCell>
                          <TableCell className="text-right">$150.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">INV003</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Unpaid</Badge>
                          </TableCell>
                          <TableCell>Bank Transfer</TableCell>
                          <TableCell className="text-right">$350.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Table with Selection and Actions */}
              <div>
                <h3 className="text-sm font-medium mb-4">With Selection & Actions</h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">
                            <Checkbox />
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="w-[50px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            name: "John Doe",
                            email: "john@example.com",
                            role: "Admin",
                          },
                          {
                            name: "Jane Smith",
                            email: "jane@example.com",
                            role: "Editor",
                          },
                          {
                            name: "Bob Wilson",
                            email: "bob@example.com",
                            role: "Viewer",
                          },
                        ].map((user) => (
                          <TableRow key={user.email}>
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button variant="ghost" size="icon-sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  }
                                />
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem variant="destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>A list of team members.</TableCaption>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              DIALOGS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="dialogs"
              title="Dialogs"
              description="Modal windows for focused interactions and confirmations."
            />

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {/* Basic Dialog */}
                  <Dialog>
                    <DialogTrigger render={<Button>Open Dialog</Button>} />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" defaultValue="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" defaultValue="@johndoe" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Confirmation Dialog */}
                  <Dialog>
                    <DialogTrigger render={<Button variant="destructive">Delete Item</Button>} />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your item and
                          remove it from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive">Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              DROPDOWNS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="dropdowns"
              title="Dropdown Menus"
              description="Contextual menus for actions and navigation."
            />

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {/* Basic Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="outline">
                          Open Menu
                          <ChevronRight className="ml-2 h-4 w-4 rotate-90" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Messages
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <X className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              TOOLTIPS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="tooltips"
              title="Tooltips"
              description="Contextual information on hover."
            />

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-6">
                  <Tooltip>
                    <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
                    <TooltipContent>
                      <p>This is a tooltip</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button size="icon" variant="ghost">
                          <Settings className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={<Button variant="secondary">With Keyboard Shortcut</Button>}
                    />
                    <TooltipContent className="flex items-center gap-2">
                      <span>Save changes</span>
                      <Kbd>⌘S</Kbd>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <span className="text-sm text-muted-foreground underline decoration-dashed cursor-help">
                          Hover for more info
                        </span>
                      }
                    />
                    <TooltipContent side="bottom">
                      <p>Tooltips can appear on different sides</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              TOASTS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="toasts"
              title="Toast Notifications"
              description="Brief feedback messages that appear temporarily."
            />

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => toast("Event has been created")}>
                    Default Toast
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.success("Successfully saved!", {
                        description: "Your changes have been saved.",
                      })
                    }
                  >
                    Success Toast
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.error("Something went wrong", {
                        description: "Please try again later.",
                      })
                    }
                  >
                    Error Toast
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.warning("Warning!", {
                        description: "This action cannot be undone.",
                      })
                    }
                  >
                    Warning Toast
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.info("Did you know?", {
                        description: "You can customize toast notifications.",
                      })
                    }
                  >
                    Info Toast
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                        loading: "Loading...",
                        success: "Data loaded!",
                        error: "Error loading data",
                      });
                    }}
                  >
                    Promise Toast
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      toast("Event created", {
                        action: {
                          label: "Undo",
                          onClick: () => console.log("Undo"),
                        },
                      })
                    }
                  >
                    Toast with Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              SKELETON SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="skeleton"
              title="Skeleton Loaders"
              description="Placeholder content while data is loading."
            />

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Card Loading State</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>

              {/* Table Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Table Loading State</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Form Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Form Loading State</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                  <Skeleton className="h-9 w-[100px]" />
                </CardContent>
              </Card>

              {/* Avatar List Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>List Loading State</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              ACCORDION SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="accordion"
              title="Accordion"
              description="Collapsible content sections for organizing information."
            />

            <Card>
              <CardContent className="pt-6">
                <Accordion>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern for accordions, ensuring
                      keyboard navigation and screen reader support.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It comes with default styles that match our design system, but can be
                      customized using Tailwind CSS classes.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                    <AccordionContent>
                      Yes. The accordion uses smooth CSS animations for expanding and collapsing
                      content, providing a polished user experience.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              BREADCRUMBS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="breadcrumbs"
              title="Breadcrumbs"
              description="Navigation trail showing the current page location."
            />

            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Basic Breadcrumb */}
                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">Basic</h3>
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
                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">With Icons</h3>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#" className="flex items-center gap-1">
                          <Home className="h-3.5 w-3.5" />
                          Home
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#" className="flex items-center gap-1">
                          <Settings className="h-3.5 w-3.5" />
                          Settings
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          Profile
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Long Path */}
                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">Deep Nesting</h3>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Projects</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Acme Corp</BreadcrumbLink>
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
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              KEYBOARD SHORTCUTS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="kbd"
              title="Keyboard Shortcuts"
              description="Visual indicators for keyboard commands and shortcuts."
            />

            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Single Keys */}
                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">Single Keys</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Kbd>⌘</Kbd>
                    <Kbd>⇧</Kbd>
                    <Kbd>⌥</Kbd>
                    <Kbd>⌃</Kbd>
                    <Kbd>↵</Kbd>
                    <Kbd>⎋</Kbd>
                    <Kbd>⌫</Kbd>
                    <Kbd>⇥</Kbd>
                  </div>
                </div>

                {/* Combinations */}
                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">Key Combinations</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Kbd>⌘</Kbd>
                      <Kbd>S</Kbd>
                      <span className="text-sm text-muted-foreground ml-2">Save</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Kbd>⌘</Kbd>
                      <Kbd>⇧</Kbd>
                      <Kbd>P</Kbd>
                      <span className="text-sm text-muted-foreground ml-2">Command Palette</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Kbd>⌘</Kbd>
                      <Kbd>K</Kbd>
                      <span className="text-sm text-muted-foreground ml-2">Search</span>
                    </div>
                  </div>
                </div>

                {/* Common Shortcuts Table */}
                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">Common Shortcuts</h3>
                  <div className="space-y-2">
                    {[
                      { keys: ["⌘", "C"], action: "Copy" },
                      { keys: ["⌘", "V"], action: "Paste" },
                      { keys: ["⌘", "Z"], action: "Undo" },
                      { keys: ["⌘", "⇧", "Z"], action: "Redo" },
                      { keys: ["⌘", "F"], action: "Find" },
                    ].map(({ keys, action }) => (
                      <div key={action} className="flex items-center justify-between py-1">
                        <span className="text-sm">{action}</span>
                        <div className="flex items-center gap-1">
                          {keys.map((key, i) => (
                            <Kbd key={i}>{key}</Kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              ALERTS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="alerts"
              title="Alerts"
              description="Contextual feedback messages for user actions."
            />

            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>
                  This is a default alert for general information.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong. Please try again.</AlertDescription>
              </Alert>

              <Alert className="border-success/30 bg-success/5">
                <Check className="h-4 w-4 text-success" />
                <AlertTitle className="text-success-foreground">Success</AlertTitle>
                <AlertDescription>Your changes have been saved successfully.</AlertDescription>
              </Alert>

              <Alert className="border-warning/30 bg-warning/5">
                <AlertCircle className="h-4 w-4 text-warning-foreground" />
                <AlertTitle className="text-warning-foreground">Warning</AlertTitle>
                <AlertDescription>This action cannot be undone.</AlertDescription>
              </Alert>
            </div>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              AVATARS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="avatars"
              title="Avatars"
              description="User profile images with fallback support."
            />

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">Sizes</h3>
                  <div className="flex items-end gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>LG</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>XL</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">With Images</h3>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="rounded-lg">
                      <AvatarFallback className="rounded-lg">ORG</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs text-muted-foreground mb-3">Avatar Group</h3>
                  <div className="flex -space-x-2">
                    <Avatar className="border-2 border-background">
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background">
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background">
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background">
                      <AvatarFallback className="text-xs">+3</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              PROGRESS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="progress"
              title="Progress"
              description="Visual indicators for loading and completion states."
            />

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress (25%)</span>
                    <span className="text-muted-foreground">25%</span>
                  </div>
                  <Progress value={25} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress (50%)</span>
                    <span className="text-muted-foreground">50%</span>
                  </div>
                  <Progress value={50} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress (75%)</span>
                    <span className="text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Complete (100%)</span>
                    <span className="text-muted-foreground">100%</span>
                  </div>
                  <Progress value={100} />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* spacing handled by parent space-y */}

          {/* ================================================================
              TABS SECTION
              ================================================================ */}
          <section>
            <SectionHeader
              id="tabs"
              title="Tabs"
              description="Organize content into separate views."
            />

            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="tab1">
                  <TabsList>
                    <TabsTrigger value="tab1">Overview</TabsTrigger>
                    <TabsTrigger value="tab2">Analytics</TabsTrigger>
                    <TabsTrigger value="tab3">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1" className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Overview content goes here. This is the first tab panel.
                    </p>
                  </TabsContent>
                  <TabsContent value="tab2" className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Analytics content goes here. This is the second tab panel.
                    </p>
                  </TabsContent>
                  <TabsContent value="tab3" className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Settings content goes here. This is the third tab panel.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Footer spacing */}
          <div className="h-24" />
        </div>
      </div>
    </div>
  );
}
