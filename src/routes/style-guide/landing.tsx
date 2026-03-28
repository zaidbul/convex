import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Mail,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/landing")({
  component: LandingPage,
});

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Blobs */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute top-20 -left-40 h-96 w-96 rounded-full bg-accent-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-brand-100/50 blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(var(--neutral-950) 1px, transparent 1px),
                             linear-gradient(90deg, var(--neutral-950) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24">
        <div className="text-center space-y-8">
          {/* Eyebrow Badge */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="px-4 py-1.5 text-sm font-medium bg-background/80 backdrop-blur-sm border-brand-200"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5 text-accent-600" />
              Introducing Acme Platform 2.0
            </Badge>
          </div>

          {/* Main Headline with Gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Build products that{" "}
            <span className="relative">
              <span
                className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 bg-clip-text text-transparent"
                style={{
                  backgroundSize: "200% 100%",
                }}
              >
                customers love
              </span>
              {/* Underline decoration */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-accent-400/60"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 8 Q50 0, 100 8 T200 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg text-on-surface-variant leading-relaxed">
            The all-in-one platform for modern teams to collaborate, ship faster, and deliver
            exceptional experiences. Trusted by over 10,000 companies worldwide.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="min-w-[180px] shadow-lg shadow-brand-500/25">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="min-w-[180px]">
              Book a Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 space-y-3">
            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-medium">
              Trusted by innovative teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {["Vercel", "Stripe", "Linear", "Notion", "Figma"].map((company) => (
                <div
                  key={company}
                  className="text-on-surface-variant/50 font-semibold text-lg tracking-tight hover:text-on-surface-variant transition-colors"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 via-accent-500/20 to-brand-500/20 rounded-2xl blur-2xl opacity-50" />
          <div className="relative rounded-md bg-surface-high/80 backdrop-blur-sm shadow-2xl overflow-hidden">
            {/* Mock Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-container">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-6 w-64 mx-auto rounded-md bg-surface-container" />
              </div>
            </div>
            {/* Mock Dashboard Content */}
            <div className="p-6 min-h-[300px] bg-gradient-to-br from-muted/20 to-muted/5">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-lg bg-surface-container animate-pulse" />
                ))}
              </div>
              <div className="mt-4 h-40 rounded-lg bg-surface-container animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURES SECTION
// ============================================================================

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built on modern infrastructure for speed. Sub-100ms response times and instant deployments.",
    color: "brand",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II compliant with end-to-end encryption. Your data is always protected.",
    color: "accent",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Real-time multiplayer editing, comments, and approvals. Work together seamlessly.",
    color: "brand",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into performance, usage patterns, and business metrics.",
    color: "accent",
  },
];

function FeaturesSection() {
  return (
    <section className="py-24 bg-surface-container">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-3 py-1">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to <span className="text-brand-600">ship faster</span>
          </h2>
          <p className="max-w-xl mx-auto text-on-surface-variant">
            Powerful features designed to streamline your workflow and help your team deliver
            exceptional results.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isBrand = feature.color === "brand";

            return (
              <Card
                key={feature.title}
                className={cn(
                  "group relative overflow-hidden transition-all duration-300",
                  "hover:shadow-lg hover:-translate-y-1",
                  "border-2 hover:border-transparent",
                  isBrand
                    ? "hover:ring-2 hover:ring-brand-500/30"
                    : "hover:ring-2 hover:ring-accent-500/30",
                )}
              >
                {/* Hover Glow Effect */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    isBrand
                      ? "bg-gradient-to-br from-brand-100/50 to-transparent"
                      : "bg-gradient-to-br from-accent-100/50 to-transparent",
                  )}
                />

                <CardContent className="relative pt-6">
                  <div className="flex items-start gap-4">
                    {/* Icon Container */}
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isBrand
                          ? "bg-brand-100 text-brand-700 group-hover:bg-brand-600 group-hover:text-white"
                          : "bg-accent-100 text-accent-700 group-hover:bg-accent-600 group-hover:text-white",
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS SECTION
// ============================================================================

const stats = [
  { value: "10K+", label: "Active Users", suffix: "" },
  { value: "99.9%", label: "Uptime SLA", suffix: "" },
  { value: "50M+", label: "API Requests", suffix: "/day" },
  { value: "4.9", label: "Customer Rating", suffix: "/5" },
];

function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--accent-500) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, var(--accent-500) 0%, transparent 50%)`,
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px),
                           linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, _index) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
                {stat.suffix && (
                  <span className="text-xl md:text-2xl font-normal text-white/70">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

const testimonials = [
  {
    quote:
      "Acme has completely transformed how our team collaborates. We've cut our deployment time by 60% and our developers are happier than ever.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechCorp",
    avatar: "SC",
    rating: 5,
  },
  {
    quote:
      "The best investment we've made this year. The ROI was clear within the first month. Support team is incredibly responsive too.",
    author: "Marcus Johnson",
    role: "CTO",
    company: "StartupXYZ",
    avatar: "MJ",
    rating: 5,
  },
  {
    quote:
      "Finally, a platform that actually delivers on its promises. The analytics alone have helped us make better product decisions.",
    author: "Emily Rodriguez",
    role: "Product Lead",
    company: "InnovateCo",
    avatar: "ER",
    rating: 5,
  },
];

function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-3 py-1">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Loved by teams <span className="text-accent-600">everywhere</span>
          </h2>
          <p className="max-w-xl mx-auto text-on-surface-variant">
            Don't just take our word for it. Here's what our customers have to say about their
            experience.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.author}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                "hover:shadow-xl hover:-translate-y-1",
                index === 1 && "md:-translate-y-4",
              )}
            >
              {/* Decorative top border */}
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-1",
                  index === 0 && "bg-gradient-to-r from-brand-500 to-brand-400",
                  index === 1 && "bg-gradient-to-r from-accent-500 to-accent-400",
                  index === 2 && "bg-gradient-to-r from-brand-400 to-accent-500",
                )}
              />

              <CardContent className="pt-8 pb-6">
                {/* Star Rating */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-sm text-on-surface-variant leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-muted">
                    <AvatarFallback className="bg-surface-container text-xs font-medium">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.author}</div>
                    <div className="text-xs text-on-surface-variant">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Glow Effects */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-surface-lowest/20 blur-xl animate-pulse" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-surface-lowest/10 backdrop-blur-sm border border-white/20">
              <Rocket className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to transform your workflow?
        </h2>

        <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
          Join thousands of teams already using Acme to ship better products faster. Start your free
          trial today.
        </p>

        {/* Email Input + Button */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            <Input
              type="email"
              placeholder="Enter your email"
              className="pl-10 bg-surface-lowest border-0 h-12 shadow-lg"
            />
          </div>
          <Button size="lg" className="h-12 bg-accent-600 hover:bg-accent-700 text-white shadow-lg">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Free 14-day trial
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER SECTION
// ============================================================================

const footerLinks = {
  product: [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Integrations", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Guides", href: "#" },
    { label: "Support", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
};

function FooterSection() {
  return (
    <footer className="bg-surface-container">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-on-surface-variant hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-on-surface-variant hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-on-surface-variant hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-on-surface-variant hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">Acme</span>
          </div>

          <p className="text-sm text-on-surface-variant">
            {new Date().getFullYear()} Acme Inc. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {["X", "GH", "LI"].map((social) => (
              <a
                key={social}
                href="#"
                className="h-8 w-8 rounded-full bg-surface-container flex items-center justify-center text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-foreground transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function LandingPage() {
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
              <h1 className="font-display text-xl font-bold tracking-tight">Landing Page</h1>
              <p className="text-on-surface-variant text-sm">
                Marketing page showcasing creative theme usage
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Landing Page Sections */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
        <FooterSection />
      </main>
    </div>
  );
}
