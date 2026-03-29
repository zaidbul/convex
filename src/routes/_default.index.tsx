import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useMemo } from "react"
import {
  Check,
  ChevronRight,
  ListTodo,
  Timer,
  Users,
  Eye,
  Search,
  PenLine,
  Circle,
  ArrowUpCircle,
  CheckCircle2,
  Loader2,
  SignalHigh,
  SignalMedium,
  SignalLow,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_default/")({
  component: LandingPage,
})

/* ─────────────────────────────────────────────
   Section 1 — Hero
   ───────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center bg-surface-lowest px-6 pt-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium tracking-wider text-on-surface-variant/60 uppercase">
          Project management, redefined.
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl">
          Ship faster.
          <br />
          Track everything.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-on-surface-variant">
          The issue tracker built for teams who move fast. Organize work across
          teams, plan sprints, and never lose context.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            size="lg"
            className="px-8 shadow-glow"
            nativeButton={false}
            render={<Link to="/sign-up" />}
          >
            Get started free
          </Button>
          <a
            href="#product-showcase"
            className="text-sm font-medium text-on-surface-variant transition-colors hover:text-foreground"
          >
            See it in action &darr;
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 2 — Decorative Sphere Transition
   ───────────────────────────────────────────── */

function SphereTransition() {
  return (
    <div className="relative -mb-48 overflow-hidden bg-surface-lowest pb-48">
      <div className="mx-auto flex justify-center">
        <div
          className="h-[600px] w-[900px] rounded-[50%] md:h-[700px] md:w-[1100px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, var(--accent) 0%, var(--secondary) 25%, var(--primary-container) 50%, transparent 70%)",
          }}
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Section 3 — Product Showcase
   ───────────────────────────────────────────── */

const mockIssues = [
  {
    id: "ENG-42",
    title: "Implement user authentication flow",
    status: "done",
    priority: "high",
    assignee: "ZB",
  },
  {
    id: "ENG-58",
    title: "Add dark mode toggle to settings",
    status: "in-progress",
    priority: "medium",
    assignee: "AK",
  },
  {
    id: "ENG-63",
    title: "Migrate database to edge runtime",
    status: "in-progress",
    priority: "high",
    assignee: "RJ",
  },
  {
    id: "ENG-71",
    title: "Design onboarding checklist component",
    status: "todo",
    priority: "medium",
    assignee: "ML",
  },
  {
    id: "ENG-79",
    title: "Fix notification badge count on mobile",
    status: "todo",
    priority: "low",
    assignee: "ZB",
  },
  {
    id: "ENG-84",
    title: "Add keyboard shortcuts documentation",
    status: "backlog",
    priority: "low",
    assignee: "AK",
  },
]

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    backlog: "text-on-surface-variant/40",
    todo: "text-on-surface-variant/70",
    "in-progress": "text-primary",
    done: "text-primary",
  }
  const icons: Record<string, React.ReactNode> = {
    backlog: <Circle className="size-3.5" />,
    todo: <Circle className="size-3.5" />,
    "in-progress": <Loader2 className="size-3.5" />,
    done: <CheckCircle2 className="size-3.5" />,
  }
  return (
    <span className={cn("shrink-0", colors[status])}>
      {icons[status]}
    </span>
  )
}

function PriorityIcon({ priority }: { priority: string }) {
  const icons: Record<string, React.ReactNode> = {
    high: <SignalHigh className="size-3.5 text-primary" />,
    medium: <SignalMedium className="size-3.5 text-on-surface-variant/60" />,
    low: <SignalLow className="size-3.5 text-on-surface-variant/40" />,
  }
  return <span className="shrink-0">{icons[priority]}</span>
}

function ProductShowcaseSection() {
  return (
    <section id="product-showcase" className="bg-surface-low px-6 py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="overflow-hidden rounded-2xl bg-surface-highest shadow-xl ring-1 ring-foreground/10">
          <div className="flex min-h-[500px]">
            {/* Sidebar mockup */}
            <div className="hidden w-56 shrink-0 border-r border-foreground/5 bg-surface-high p-4 md:block">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="size-5 rounded-md bg-primary/20" />
                <span className="text-xs font-semibold text-foreground">
                  Acme Corp
                </span>
              </div>
              <div className="mt-6 space-y-0.5">
                <div className="flex items-center gap-2 rounded-lg bg-surface-lowest/60 px-2 py-1.5 text-xs font-medium text-foreground">
                  <div className="size-3.5 rounded bg-primary/15" />
                  Dashboard
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-on-surface-variant/60">
                  <div className="size-3.5 rounded bg-foreground/5" />
                  Inbox
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-on-surface-variant/60">
                  <div className="size-3.5 rounded bg-foreground/5" />
                  My Issues
                </div>
              </div>
              <div className="mt-6">
                <p className="px-2 text-[10px] font-medium tracking-wider text-on-surface-variant/40 uppercase">
                  Teams
                </p>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-on-surface-variant/60">
                    <span className="text-[10px]">ENG</span>
                    Engineering
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-on-surface-variant/60">
                    <span className="text-[10px]">DES</span>
                    Design
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-on-surface-variant/60">
                    <span className="text-[10px]">MKT</span>
                    Marketing
                  </div>
                </div>
              </div>
            </div>

            {/* Main content mockup */}
            <div className="flex-1 p-6">
              {/* Stats cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Backlog", count: 12, color: "text-on-surface-variant/50" },
                  { label: "Todo", count: 8, color: "text-on-surface-variant/70" },
                  { label: "In Progress", count: 5, color: "text-primary" },
                  { label: "Done", count: 24, color: "text-primary" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-surface-low/60 p-3"
                  >
                    <p className="text-[10px] text-on-surface-variant/50">
                      {stat.label}
                    </p>
                    <p className={cn("mt-1 font-display text-xl font-bold", stat.color)}>
                      {stat.count}
                    </p>
                  </div>
                ))}
              </div>

              {/* Issue list */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-medium text-on-surface-variant/50">
                  Active Issues
                </p>
                <div className="space-y-0">
                  {mockIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-low/40"
                    >
                      <PriorityIcon priority={issue.priority} />
                      <StatusDot status={issue.status} />
                      <span className="shrink-0 text-[11px] font-medium text-on-surface-variant/40">
                        {issue.id}
                      </span>
                      <span className="truncate text-xs text-foreground">
                        {issue.title}
                      </span>
                      <span className="ml-auto shrink-0 flex size-5 items-center justify-center rounded-full bg-surface-low text-[9px] font-medium text-on-surface-variant/60">
                        {issue.assignee}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 4 — Features Grid (flip cards)
   ───────────────────────────────────────────── */

const featureCards = [
  {
    category: "Issue Tracking",
    icon: ListTodo,
    title: "Create, assign, and track issues with real-time status updates.",
    back: "Six workflow states from backlog to done. Priority levels from none to urgent. Labels, due dates, and assignees — all in one place.",
  },
  {
    category: "Sprint Cycles",
    icon: Timer,
    title: "Plan sprints with automatic progress tracking and cycle views.",
    back: "Current and upcoming cycle views. Progress bars showing completion. Move issues between cycles effortlessly.",
  },
  {
    category: "Team Workspaces",
    icon: Users,
    title: "Organize work across multiple teams with isolated views.",
    back: "Each team gets its own identifier, issue namespace, cycles, and filtered views. Navigate between teams instantly.",
  },
  {
    category: "Saved Views",
    icon: Eye,
    title: "Build custom filter combinations and save them for quick access.",
    back: "Filter by status, priority, assignee, label, cycle, and more. Save combinations and share with your team.",
  },
  {
    category: "Command Palette",
    icon: Search,
    title: "Navigate anywhere instantly with a single keystroke.",
    back: "Search issues, jump to teams, access settings, and create new issues — all without leaving the keyboard.",
  },
  {
    category: "Rich Editor",
    icon: PenLine,
    title: "Write detailed descriptions with a full-featured editor.",
    back: "Markdown shortcuts, @mentions, image attachments, and auto-save. A writing experience that stays out of your way.",
  },
]

function FlipCard({
  card,
}: {
  card: (typeof featureCards)[number]
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="group cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={cn(
          "relative h-64 transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]",
          "md:group-hover:[transform:rotateY(180deg)]"
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-primary-foreground/10 p-8 [backface-visibility:hidden]">
          <div className="flex items-center gap-2">
            <card.icon className="size-4 opacity-60" />
            <p className="text-xs font-medium uppercase tracking-wider opacity-60">
              {card.category}
            </p>
          </div>
          <p className="font-display text-lg font-bold leading-snug">
            {card.title}
          </p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex items-center rounded-2xl bg-primary-foreground/20 p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm leading-relaxed">{card.back}</p>
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-primary px-6 py-24 text-primary-foreground">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-5xl">
          Everything your team needs.
          <br />
          Nothing it doesn&apos;t.
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card) => (
            <FlipCard key={card.category} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 5 — Workflow
   ───────────────────────────────────────────── */

function WorkflowSection() {
  return (
    <section id="workflow" className="bg-surface-lowest px-6 py-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-[1fr_1fr]">
        {/* Text */}
        <div>
          <p className="text-xs font-medium tracking-wider text-on-surface-variant/60 uppercase">
            Designed for flow
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            From backlog to done, without friction
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
            cnvx gives your team a clear path from idea to completion. Create
            issues, assign priorities, track through cycles, and celebrate when
            they ship.
          </p>
          <div className="mt-6 space-y-3">
            {[
              "Drag between status columns",
              "Automatic sprint progress tracking",
              "Real-time activity feed",
              "Keyboard-first navigation",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                  <Check className="size-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button
              size="lg"
              className="px-8 shadow-glow"
              nativeButton={false}
            render={<Link to="/sign-up" />}
            >
              Start building
            </Button>
          </div>
        </div>

        {/* Issue detail mockup */}
        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-md rounded-2xl bg-surface-high p-5 shadow-xl ring-1 ring-foreground/10">
            {/* Issue header */}
            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant/40">
              <span className="font-medium">ENG-127</span>
              <ChevronRight className="size-3" />
              <span>Engineering</span>
            </div>
            <h3 className="mt-2 font-display text-base font-bold text-foreground">
              Implement dark mode toggle
            </h3>

            {/* Properties */}
            <div className="mt-4 space-y-2.5">
              {[
                { label: "Status", value: "In Progress", dot: "bg-primary" },
                { label: "Priority", value: "High", dot: "bg-primary" },
                { label: "Assignee", value: "Zaid B." },
                { label: "Cycle", value: "Sprint 12" },
              ].map((prop) => (
                <div
                  key={prop.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-on-surface-variant/50">
                    {prop.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {prop.dot && (
                      <span
                        className={cn("size-2 rounded-full", prop.dot)}
                      />
                    )}
                    <span className="text-foreground">{prop.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-4 rounded-lg bg-surface-lowest/60 p-3">
              <p className="text-xs leading-relaxed text-on-surface-variant/70">
                Add a toggle in the settings page that switches between light
                and dark themes. Should persist the user&apos;s preference
                across sessions using localStorage.
              </p>
            </div>

            {/* Activity */}
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-medium text-on-surface-variant/40 uppercase">
                Activity
              </p>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 size-4 rounded-full bg-surface-low" />
                <div>
                  <p className="text-[11px] text-foreground">
                    <span className="font-medium">Zaid</span>{" "}
                    <span className="text-on-surface-variant/50">
                      changed status to
                    </span>{" "}
                    <span className="font-medium text-primary">
                      In Progress
                    </span>
                  </p>
                  <p className="text-[10px] text-on-surface-variant/30">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 size-4 rounded-full bg-surface-low" />
                <div>
                  <p className="text-[11px] text-foreground">
                    <span className="font-medium">Amir</span>{" "}
                    <span className="text-on-surface-variant/50">
                      assigned to
                    </span>{" "}
                    <span className="font-medium">Zaid B.</span>
                  </p>
                  <p className="text-[10px] text-on-surface-variant/30">
                    5 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 6 — Dashboard Preview
   ───────────────────────────────────────────── */

function DashboardPreviewSection() {
  return (
    <section className="bg-surface-lowest px-6 py-12">
      <div className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-2">
        {/* Dashboard card */}
        <div className="flex flex-col rounded-2xl bg-surface-high p-8 ring-1 ring-foreground/10">
          <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Dashboard
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Get an at-a-glance overview of your workspace. Track metrics, see
            assigned issues, and monitor cycle progress.
          </p>
          {/* Mini stats mockup */}
          <div className="mt-6 grid flex-1 grid-cols-2 gap-2">
            {[
              { label: "Backlog", count: 12 },
              { label: "Todo", count: 8 },
              { label: "In Progress", count: 5 },
              { label: "Done this week", count: 14 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-surface-lowest/60 p-3"
              >
                <p className="text-[10px] text-on-surface-variant/40">
                  {stat.label}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground">
                  {stat.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cycles card */}
        <div className="flex flex-col rounded-2xl bg-surface-high p-8 ring-1 ring-foreground/10">
          <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Cycles
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Plan and track sprints with automatic progress calculation. See
            what&apos;s current, upcoming, and shipped.
          </p>
          {/* Cycle progress mockup */}
          <div className="mt-6 flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Sprint 12</span>
                <span className="text-primary">68%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-lowest/60">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: "68%" }}
                />
              </div>
              <p className="mt-1 text-[10px] text-on-surface-variant/40">
                5 days remaining · 17 of 25 issues done
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Sprint 13</span>
                <span className="text-on-surface-variant/50">Upcoming</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-lowest/60">
                <div
                  className="h-full rounded-full bg-surface-container"
                  style={{ width: "0%" }}
                />
              </div>
              <p className="mt-1 text-[10px] text-on-surface-variant/40">
                Starts Mar 31 · 12 issues planned
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground/60">
                  Sprint 11
                </span>
                <span className="text-on-surface-variant/40">Complete</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-lowest/60">
                <div
                  className="h-full rounded-full bg-primary/40"
                  style={{ width: "100%" }}
                />
              </div>
              <p className="mt-1 text-[10px] text-on-surface-variant/40">
                Completed Mar 14 · 22 issues shipped
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 7 — Speed / Command Palette
   ───────────────────────────────────────────── */

function SpeedSection() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Built for speed
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Every action is reachable by keyboard. Navigate with{" "}
          <kbd className="rounded bg-surface-high px-1.5 py-0.5 font-mono text-xs ring-1 ring-foreground/10">
            &#8984;K
          </kbd>
          , create issues with shortcuts, and filter views without touching the
          mouse.
        </p>

        {/* Command palette mockup */}
        <div className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl bg-surface-high shadow-xl ring-1 ring-foreground/10">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-foreground/5 px-4 py-3">
            <Search className="size-4 text-on-surface-variant/40" />
            <span className="text-sm text-on-surface-variant/30">
              Search issues, teams, actions...
            </span>
            <span className="ml-auto rounded bg-surface-lowest/60 px-1.5 py-0.5 font-mono text-[10px] text-on-surface-variant/30">
              ESC
            </span>
          </div>

          {/* Results */}
          <div className="p-2">
            <p className="px-2 py-1 text-[10px] font-medium text-on-surface-variant/30 uppercase">
              Issues
            </p>
            <div className="rounded-lg bg-surface-lowest/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="size-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  ENG-127
                </span>
                <span className="text-xs text-on-surface-variant/60">
                  Implement dark mode toggle
                </span>
              </div>
            </div>
            <div className="mt-0.5 px-3 py-2">
              <div className="flex items-center gap-2">
                <Circle className="size-3.5 text-on-surface-variant/40" />
                <span className="text-xs font-medium text-foreground">
                  ENG-84
                </span>
                <span className="text-xs text-on-surface-variant/60">
                  Add keyboard shortcuts docs
                </span>
              </div>
            </div>

            <p className="mt-2 px-2 py-1 text-[10px] font-medium text-on-surface-variant/30 uppercase">
              Actions
            </p>
            <div className="mt-0.5 px-3 py-2">
              <div className="flex items-center gap-2">
                <ListTodo className="size-3.5 text-on-surface-variant/50" />
                <span className="text-xs text-foreground">
                  Create new issue
                </span>
                <span className="ml-auto font-mono text-[10px] text-on-surface-variant/30">
                  C
                </span>
              </div>
            </div>
            <div className="mt-0.5 px-3 py-2">
              <div className="flex items-center gap-2">
                <Users className="size-3.5 text-on-surface-variant/50" />
                <span className="text-xs text-foreground">
                  Go to Engineering
                </span>
                <span className="ml-auto font-mono text-[10px] text-on-surface-variant/30">
                  G E
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard shortcut badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            { keys: "⌘K", label: "Search" },
            { keys: "C", label: "New Issue" },
            { keys: "F", label: "Filter" },
            { keys: "G D", label: "Dashboard" },
          ].map((shortcut) => (
            <div
              key={shortcut.keys}
              className="flex items-center gap-2 rounded-full bg-surface-high px-3 py-1.5 ring-1 ring-foreground/10"
            >
              <kbd className="font-mono text-xs font-medium text-foreground">
                {shortcut.keys}
              </kbd>
              <span className="text-xs text-on-surface-variant/50">
                {shortcut.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 8 — Final CTA (with rain)
   ───────────────────────────────────────────── */

// Deterministic pseudo-random to avoid SSR/client hydration mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function FinalCtaSection() {
  const rainDrops = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: `${(i / 40) * 100}%`,
        height: `${60 + seededRandom(i) * 100}px`,
        top: `-${seededRandom(i + 100) * 200}px`,
        animation: `rain-fall ${3 + seededRandom(i + 200) * 4}s linear infinite`,
        animationDelay: `${seededRandom(i + 300) * 5}s`,
      })),
    []
  )

  return (
    <section className="relative overflow-hidden bg-surface-lowest px-6 py-32 md:py-48">
      {/* Animated rain overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {rainDrops.map((style, i) => (
          <div
            key={i}
            className="absolute w-px bg-foreground/20"
            style={style}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Start shipping today
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-on-surface-variant">
          Free to start. No credit card required.
        </p>
        <div className="mt-10">
          <Button
            size="lg"
            className="px-8 shadow-glow"
            nativeButton={false}
            render={<Link to="/sign-up" />}
          >
            Get started free
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Main Page Component
   ───────────────────────────────────────────── */

function LandingPage() {
  return (
    <>
      <HeroSection />
      <SphereTransition />
      <ProductShowcaseSection />
      <FeaturesSection />
      <WorkflowSection />
      <DashboardPreviewSection />
      <SpeedSection />
      <FinalCtaSection />
    </>
  )
}
