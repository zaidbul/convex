import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/layout-guides/marketing-public")({
  component: MarketingPublicRoutePage,
});

function MarketingPublicRoutePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface-low">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <div className="font-medium">Product Name</div>
          <nav className="hidden items-center gap-4 text-xs text-on-surface-variant md:flex">
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Resources</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
            <Button size="sm">Start free</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        {/* TanStack Router <Outlet /> should render here. Keep this main slot unpadded. */}
        <div className="space-y-16 px-4 py-8 sm:px-6">
          <div className="space-y-4 py-8 text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Build apps faster with flexible layouts
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-on-surface-variant">
              Production-ready app shells with clear CTA flow and minimal application chrome. Ship
              your next product in days, not weeks.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button>Get started free</Button>
              <Button variant="outline">Book a demo</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Fast Setup</CardTitle>
                <CardDescription>
                  Launch production-ready experiences in minutes. Pre-built templates and sensible
                  defaults get you running quickly.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Composable</CardTitle>
                <CardDescription>
                  Mix and match shell patterns to fit product needs. Swap sidebars, top navs, and
                  panels without rewriting.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Accessible</CardTitle>
                <CardDescription>
                  Built with shadcn primitives and semantic HTML. Keyboard navigation and screen
                  reader support included.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-xs font-medium text-on-surface-variant">TRUSTED BY TEAMS AT</p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-on-surface-variant/50">
              {["Vercel", "Stripe", "Linear", "Notion", "Figma", "Supabase"].map((co) => (
                <span key={co}>{co}</span>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>How it works</CardTitle>
              <CardDescription>Three steps to your next production app.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: "Choose a layout",
                    desc: "Browse 15 pre-built app shells covering sidebar, hybrid, workspace, and specialized patterns.",
                  },
                  {
                    step: "2",
                    title: "Customize",
                    desc: "Adjust colors, spacing, navigation structure, and content areas to match your product's needs.",
                  },
                  {
                    step: "3",
                    title: "Ship it",
                    desc: "Deploy to production with built-in responsive design, accessibility, and performance optimization.",
                  },
                ].map((item) => (
                  <div key={item.step} className="text-center space-y-2">
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {item.step}
                    </div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-on-surface-variant">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="font-display text-center text-lg font-semibold tracking-tight">What developers say</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  quote:
                    "We shipped our entire admin dashboard in two days using these layout templates. The sidebar patterns are exactly what we needed.",
                  author: "Sarah K.",
                  role: "Engineering Lead at Acme",
                },
                {
                  quote:
                    "The three-column workspace layout saved us weeks of iteration. We plugged in our data and it just worked.",
                  author: "Marcus T.",
                  role: "Senior Frontend Developer",
                },
                {
                  quote:
                    "Finally, a layout system that handles responsive design correctly out of the box. No more fighting with mobile sidebars.",
                  author: "Priya N.",
                  role: "Full-stack Developer",
                },
                {
                  quote:
                    "The master-detail pattern was perfect for our CRM. Our sales team loves how information is organized.",
                  author: "David L.",
                  role: "CTO at StartupCo",
                },
              ].map((t) => (
                <Card key={t.author}>
                  <CardContent className="pt-6">
                    <p className="text-xs italic text-on-surface-variant">"{t.quote}"</p>
                    <div className="mt-3">
                      <p className="text-xs font-medium">{t.author}</p>
                      <p className="text-[10px] text-on-surface-variant">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-center text-lg font-semibold tracking-tight">Simple pricing</h2>
            <p className="text-center text-xs text-on-surface-variant">
              Start for free. Upgrade when you're ready.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  plan: "Free",
                  price: "$0",
                  period: "forever",
                  features: [
                    "5 projects",
                    "Community support",
                    "Basic templates",
                    "Public repos only",
                  ],
                },
                {
                  plan: "Pro",
                  price: "$29",
                  period: "/month",
                  features: [
                    "Unlimited projects",
                    "Priority support",
                    "All templates",
                    "Private repos",
                    "Custom branding",
                    "Team collaboration",
                  ],
                },
                {
                  plan: "Enterprise",
                  price: "Custom",
                  period: "",
                  features: [
                    "Everything in Pro",
                    "SSO / SAML",
                    "Dedicated support",
                    "SLA guarantee",
                    "On-prem deployment",
                    "Custom integrations",
                    "Audit logs",
                  ],
                },
              ].map((tier) => (
                <Card key={tier.plan} className={cn(tier.plan === "Pro" && "border-primary/40")}>
                  <CardHeader>
                    <CardDescription>{tier.plan}</CardDescription>
                    <CardTitle>
                      {tier.price}
                      <span className="text-sm font-normal text-on-surface-variant">
                        {tier.period}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {tier.features.map((f) => (
                      <div
                        key={f}
                        className="flex items-center gap-2 text-xs text-on-surface-variant"
                      >
                        <CheckSquare className="h-3 w-3 text-primary/60" />
                        {f}
                      </div>
                    ))}
                    <Button
                      className="mt-4 w-full"
                      variant={tier.plan === "Pro" ? "default" : "outline"}
                    >
                      {tier.plan === "Enterprise" ? "Contact sales" : "Get started"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently asked questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  q: "Can I use these layouts in commercial projects?",
                  a: "Yes, all layouts are MIT licensed. Use them in personal and commercial projects without attribution.",
                },
                {
                  q: "Do I need to use all the components?",
                  a: "No. Each layout is self-contained. Pick the parts you need and leave the rest. There are no interdependencies.",
                },
                {
                  q: "How do I customize the theme?",
                  a: "Layouts use CSS custom properties via Tailwind. Update your tailwind config or CSS variables to change colors, spacing, and typography globally.",
                },
                {
                  q: "Is server-side rendering supported?",
                  a: "Yes. All layouts work with TanStack Start's SSR out of the box. No client-side-only dependencies.",
                },
                {
                  q: "Can I mix multiple layouts in one app?",
                  a: "Absolutely. Use one layout for your dashboard and another for settings. The router handles transitions seamlessly.",
                },
              ].map((faq) => (
                <div key={faq.q}>
                  <p className="text-xs font-medium">{faq.q}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">{faq.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-3 py-8 text-center">
            <h2 className="font-display text-xl font-bold tracking-tight">Ready to build?</h2>
            <p className="text-sm text-on-surface-variant">
              Start with a free account. No credit card required.
            </p>
            <Button>Get started for free</Button>
          </div>
        </div>
      </main>

      <footer className="bg-surface-low">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 text-xs text-on-surface-variant sm:px-6">
          <span>Acme Inc.</span>
          <div className="flex items-center gap-3">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
