import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Crown,
  Flame,
  Rocket,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/style-guide/featured")({
  component: FeaturedPage,
});

// ============================================================================
// SECTION WRAPPER
// ============================================================================

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold tracking-tight">{title}</h2>
        <p className="text-on-surface-variant text-sm mt-1">{description}</p>
      </div>
      {children}
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function FeaturedPage() {
  return (
    <div className="min-h-full">
      {/* Page Header */}
      <div className="bg-surface-container">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-display font-bold tracking-tight">Featured & Hero Elements</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Techniques for making primary content stand out
          </p>
        </div>
      </div>

      <div className="px-4 py-8 sm:px-6 lg:px-8 space-y-16 max-w-6xl">
        {/* ================================================================
            GRADIENT TEXT
            ================================================================ */}
        <Section
          title="Gradient Typography"
          description="Text with gradient fills for headlines and featured content"
        >
          <div className="space-y-8">
            {/* Brand gradient */}
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                Brand Gradient
              </p>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text text-transparent">
                Build something amazing
              </h3>
            </div>

            {/* Subtle gradient */}
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">Subtle Shift</p>
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Less is more
              </h3>
            </div>

            {/* Animated gradient */}
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                Animated (hover)
              </p>
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600 bg-[length:200%_auto] bg-clip-text text-transparent hover:animate-gradient-x transition-all cursor-default">
                Hover over me
              </h3>
            </div>

            {/* Glow text */}
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">With Glow</p>
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-brand-500 drop-shadow-[0_0_25px_rgba(var(--brand-500-rgb),0.5)]">
                Radiant headline
              </h3>
            </div>
          </div>
        </Section>

        {/* ================================================================
            FEATURED STAT CARDS
            ================================================================ */}
        <Section
          title="Featured Stat Cards"
          description="Primary metrics that need to grab attention"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Gradient border */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-accent-500 rounded-xl opacity-75 group-hover:opacity-100 blur-sm transition-opacity" />
              <Card className="relative bg-background">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-brand-500 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-medium">Revenue</span>
                  </div>
                  <p className="text-3xl font-bold">$48.2K</p>
                  <p className="text-xs text-on-surface-variant mt-1">+12.5% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Gradient background */}
            <Card className="bg-gradient-to-br from-brand-500 to-brand-700 text-white border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-medium">Active Users</span>
                </div>
                <p className="text-3xl font-bold">2,847</p>
                <p className="text-xs text-white/70 mt-1">Online right now</p>
              </CardContent>
            </Card>

            {/* Accent glow */}
            <Card className="relative overflow-hidden border-outline-variant/15 bg-accent-500/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <CardContent className="pt-6 relative">
                <div className="flex items-center gap-2 text-accent-600 dark:text-accent-400 mb-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-xs font-medium">Rating</span>
                </div>
                <p className="text-3xl font-bold">4.9/5</p>
                <p className="text-xs text-on-surface-variant mt-1">Based on 1.2k reviews</p>
              </CardContent>
            </Card>

            {/* Icon emphasis */}
            <Card className="relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                <Flame className="h-10 w-10 text-brand-500" />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <span className="text-xs font-medium">Streak</span>
                </div>
                <p className="text-3xl font-bold">28 days</p>
                <p className="text-xs text-on-surface-variant mt-1">Personal best!</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ================================================================
            HERO CARDS
            ================================================================ */}
        <Section
          title="Hero Cards"
          description="Large featured cards for primary actions or highlights"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Gradient with pattern */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white border-0">
              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              {/* Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="relative pb-2">
                <Badge className="w-fit bg-white/20 text-white border-0 hover:bg-white/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  New Feature
                </Badge>
                <CardTitle className="text-2xl sm:text-3xl mt-4">AI-Powered Analytics</CardTitle>
                <CardDescription className="text-white/80 text-base">
                  Get insights automatically generated from your data with our new machine learning
                  engine.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative pt-4">
                <Button className="bg-white text-brand-700 hover:bg-white/90">
                  Try it now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Glass morphism */}
            <Card className="relative overflow-hidden border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl dark:from-white/5 dark:to-white/[0.02]">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10" />
              {/* Decorative circles */}
              <div className="absolute -top-12 -left-12 w-48 h-48 border border-brand-500/20 rounded-full" />
              <div className="absolute -top-8 -left-8 w-48 h-48 border border-brand-500/10 rounded-full" />
              <div className="absolute -bottom-16 -right-16 w-64 h-64 border border-accent-500/20 rounded-full" />
              <CardHeader className="relative pb-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                    <Rocket className="h-5 w-5" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Launch Your Project</CardTitle>
                <CardDescription className="text-base">
                  Everything you need to go from idea to production in record time.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative pt-4">
                <Button>
                  Get Started
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ================================================================
            PREMIUM / UPGRADE CARDS
            ================================================================ */}
        <Section
          title="Premium & Upgrade Cards"
          description="Cards that encourage upgrades with luxurious styling"
        >
          {/* pt-4 gives room for the floating badge */}
          <div className="grid gap-6 md:grid-cols-3 pt-4">
            {/* Standard */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Free</CardTitle>
                <CardDescription>For individuals getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$0</p>
                <p className="text-sm text-on-surface-variant">Forever free</p>
                <Button variant="outline" className="w-full mt-4">
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Featured / Recommended - overflow-visible for badge */}
            <Card className="relative overflow-visible border-outline-variant/15 shadow-lg shadow-brand-500/10">
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-brand-500 hover:bg-brand-500 shadow-md">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Most Popular
                </Badge>
              </div>
              {/* Subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent rounded-lg" />
              <CardHeader className="relative">
                <CardTitle className="text-lg">Pro</CardTitle>
                <CardDescription>For growing teams</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-3xl font-bold">$29</p>
                <p className="text-sm text-on-surface-variant">per month</p>
                <Button className="w-full mt-4">Upgrade to Pro</Button>
              </CardContent>
            </Card>

            {/* Premium / Enterprise - inverts colors for dark mode */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-50 text-white dark:text-neutral-900 border-0">
              {/* Gold accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 dark:bg-amber-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-400 dark:text-amber-600" />
                  <CardTitle className="text-lg">Enterprise</CardTitle>
                </div>
                <CardDescription className="text-neutral-400 dark:text-neutral-500">
                  For large organizations
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-3xl font-bold">Custom</p>
                <p className="text-sm text-neutral-400 dark:text-neutral-500">
                  Contact for pricing
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-amber-500/50 dark:border-amber-600/50 text-amber-400 dark:text-amber-700 hover:bg-amber-500/10 hover:text-amber-300 dark:hover:bg-amber-500/10 dark:hover:text-amber-800"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ================================================================
            ANNOUNCEMENT BANNERS
            ================================================================ */}
        <Section
          title="Announcement Banners"
          description="Eye-catching banners for important updates"
        >
          <div className="space-y-4">
            {/* Gradient banner */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 p-4 text-white">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Version 2.0 is here!</p>
                    <p className="text-sm text-white/80">
                      Check out the new features and improvements.
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="w-fit">
                  Learn more
                </Button>
              </div>
            </div>

            {/* Subtle banner with border */}
            <div className="relative overflow-hidden rounded-lg border-outline-variant/15 bg-brand-500/5 p-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10">
                    <Zap className="h-4 w-4 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-medium">Limited time offer</p>
                    <p className="text-sm text-on-surface-variant">
                      Get 50% off your first 3 months.
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Claim offer
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ================================================================
            DECORATIVE TECHNIQUES
            ================================================================ */}
        <Section
          title="Decorative Techniques Reference"
          description="Building blocks for creating standout elements"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Gradient border */}
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                Gradient Border
              </p>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-accent-500 rounded-lg opacity-75 blur-sm" />
                <div className="relative bg-background rounded-lg p-4">
                  <p className="text-sm">Outer glow border effect</p>
                </div>
              </div>
            </div>

            {/* Corner glow */}
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">Corner Glow</p>
              <div className="relative overflow-hidden rounded-md bg-surface-high p-4">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-500/30 rounded-full blur-2xl" />
                <p className="text-sm relative">Glowing corner accent</p>
              </div>
            </div>

            {/* Animated border */}
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                Shimmer Border
              </p>
              <div className="relative rounded-lg p-[1px] bg-gradient-to-r from-transparent via-brand-500 to-transparent bg-[length:200%_auto] animate-shimmer">
                <div className="bg-background rounded-lg p-4">
                  <p className="text-sm">Animated shimmer effect</p>
                </div>
              </div>
            </div>

            {/* Glass card */}
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                Glass Morphism
              </p>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-accent-500/20 rounded-lg" />
                <div className="relative backdrop-blur-sm border-outline-variant/15 rounded-md p-4 bg-white/5">
                  <p className="text-sm">Frosted glass effect</p>
                </div>
              </div>
            </div>

            {/* Raised shadow */}
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                Colored Shadow
              </p>
              <div className="rounded-md bg-surface-high p-4 shadow-lg shadow-brand-500/20">
                <p className="text-sm">Brand-colored drop shadow</p>
              </div>
            </div>

            {/* Dotted pattern */}
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                Pattern Overlay
              </p>
              <div className="relative overflow-hidden rounded-md bg-surface-high p-4">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <p className="text-sm relative">Subtle dot pattern</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="h-12" />
      </div>
    </div>
  );
}
