import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  HelpCircle,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/pricing")({
  component: PricingPage,
});

// ============================================================================
// PRICING DATA
// ============================================================================

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals and small projects",
    monthlyPrice: 9,
    annualPrice: 86,
    features: [
      "Up to 3 projects",
      "5 GB storage",
      "Basic analytics",
      "Email support",
      "API access",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for growing teams and businesses",
    monthlyPrice: 29,
    annualPrice: 278,
    features: [
      "Unlimited projects",
      "50 GB storage",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom integrations",
      "Team collaboration",
    ],
    highlighted: true,
    cta: "Start Free Trial",
    badge: "Most Popular",
  },
  {
    id: "business",
    name: "Business",
    description: "For large teams with advanced needs",
    monthlyPrice: 79,
    annualPrice: 758,
    features: [
      "Everything in Pro",
      "500 GB storage",
      "Custom analytics",
      "24/7 phone support",
      "Advanced API access",
      "SSO & SAML",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

const featureComparison = [
  {
    category: "Core Features",
    features: [
      { name: "Projects", starter: "3", pro: "Unlimited", business: "Unlimited" },
      { name: "Storage", starter: "5 GB", pro: "50 GB", business: "500 GB" },
      { name: "Team members", starter: "1", pro: "10", business: "Unlimited" },
      { name: "API requests/month", starter: "10,000", pro: "100,000", business: "Unlimited" },
    ],
  },
  {
    category: "Analytics & Reporting",
    features: [
      { name: "Basic analytics", starter: true, pro: true, business: true },
      { name: "Advanced analytics", starter: false, pro: true, business: true },
      { name: "Custom dashboards", starter: false, pro: true, business: true },
      { name: "Export reports", starter: false, pro: true, business: true },
      { name: "Real-time data", starter: false, pro: false, business: true },
    ],
  },
  {
    category: "Security & Compliance",
    features: [
      { name: "SSL encryption", starter: true, pro: true, business: true },
      { name: "2FA authentication", starter: true, pro: true, business: true },
      { name: "SSO/SAML", starter: false, pro: false, business: true },
      { name: "Audit logs", starter: false, pro: true, business: true },
      { name: "SOC 2 compliance", starter: false, pro: false, business: true },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "Email support", starter: true, pro: true, business: true },
      { name: "Priority support", starter: false, pro: true, business: true },
      { name: "24/7 phone support", starter: false, pro: false, business: true },
      { name: "Dedicated account manager", starter: false, pro: false, business: true },
      { name: "SLA guarantee", starter: false, pro: false, business: true },
    ],
  },
];

const usageMeters = [
  { name: "API Requests", current: 7823, limit: 10000, unit: "requests" },
  { name: "Storage", current: 3.2, limit: 5, unit: "GB" },
  { name: "Team Members", current: 1, limit: 1, unit: "seats" },
  { name: "Projects", current: 2, limit: 3, unit: "projects" },
];

// ============================================================================
// PRICING TABLE (3-Column Comparison)
// ============================================================================

function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Table</CardTitle>
        <CardDescription>
          Classic 3-column pricing comparison with monthly/annual toggle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !isAnnual ? "text-foreground" : "text-on-surface-variant",
            )}
          >
            Monthly
          </span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              isAnnual ? "text-foreground" : "text-on-surface-variant",
            )}
          >
            Annual
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-xl border-2 p-6 transition-all",
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary/50",
              )}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{plan.badge}</Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-on-surface-variant mt-1">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice}
                  </span>
                  <span className="text-on-surface-variant">/month</span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-on-surface-variant mt-1">
                    ${plan.annualPrice} billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// FEATURE COMPARISON TABLE
// ============================================================================

function FeatureComparisonTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Comparison</CardTitle>
        <CardDescription>
          Detailed feature comparison table with checkmarks and values
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Features</TableHead>
              <TableHead className="text-center">Starter</TableHead>
              <TableHead className="text-center bg-primary/5">Pro</TableHead>
              <TableHead className="text-center">Business</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {featureComparison.map((category) => (
              <>
                <TableRow key={category.category} className="bg-surface-container">
                  <TableCell colSpan={4} className="font-semibold text-sm py-2">
                    {category.category}
                  </TableCell>
                </TableRow>
                {category.features.map((feature) => (
                  <TableRow key={feature.name}>
                    <TableCell className="flex items-center gap-2">
                      {feature.name}
                      {feature.name.includes("SSO") && (
                        <Tooltip>
                          <TooltipTrigger
                            render={<HelpCircle className="h-3.5 w-3.5 text-on-surface-variant" />}
                          />
                          <TooltipContent>
                            <p>Single Sign-On for enterprise identity providers</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof feature.starter === "boolean" ? (
                        feature.starter ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-on-surface-variant/50 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm">{feature.starter}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center bg-primary/5">
                      {typeof feature.pro === "boolean" ? (
                        feature.pro ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-on-surface-variant/50 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium">{feature.pro}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof feature.business === "boolean" ? (
                        feature.business ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-on-surface-variant/50 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm">{feature.business}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-center gap-4 pt-6">
        <Button variant="outline">Start with Starter</Button>
        <Button>Start Free Trial</Button>
        <Button variant="outline">Contact Sales</Button>
      </CardFooter>
    </Card>
  );
}

// ============================================================================
// PLAN CARDS (Horizontal Layout)
// ============================================================================

function HorizontalPlanCards() {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Cards (Horizontal)</CardTitle>
        <CardDescription>
          Compact horizontal plan selection cards with radio-style selection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pricingPlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={cn(
              "w-full flex items-center gap-6 rounded-xl border-2 p-4 text-left transition-all",
              selectedPlan === plan.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
            )}
          >
            {/* Radio indicator */}
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                selectedPlan === plan.id ? "border-primary bg-primary" : "border-muted-foreground",
              )}
            >
              {selectedPlan === plan.id && (
                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              )}
            </div>

            {/* Plan info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{plan.name}</h4>
                {plan.badge && <Badge variant="secondary">{plan.badge}</Badge>}
              </div>
              <p className="text-sm text-on-surface-variant">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-2xl font-bold">${plan.monthlyPrice}</div>
              <div className="text-sm text-on-surface-variant">/month</div>
            </div>
          </button>
        ))}

        <div className="pt-4">
          <Button className="w-full">
            Continue with {pricingPlans.find((p) => p.id === selectedPlan)?.name}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PLAN TOGGLE (Monthly/Annual with Price Difference)
// ============================================================================

function PlanToggle() {
  const [isAnnual, setIsAnnual] = useState(false);

  const monthlyTotal = pricingPlans.reduce((sum, p) => sum + p.monthlyPrice, 0);
  const annualMonthly = pricingPlans.reduce((sum, p) => sum + Math.round(p.annualPrice / 12), 0);
  const savings = monthlyTotal * 12 - pricingPlans.reduce((sum, p) => sum + p.annualPrice, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Toggle</CardTitle>
        <CardDescription>Interactive monthly/annual toggle showing savings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Large Toggle */}
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center rounded-full border bg-surface-container p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-all",
                !isAnnual
                  ? "bg-background shadow-sm"
                  : "text-on-surface-variant hover:text-foreground",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-all",
                isAnnual
                  ? "bg-background shadow-sm"
                  : "text-on-surface-variant hover:text-foreground",
              )}
            >
              Annual
            </button>
          </div>

          {isAnnual && (
            <div className="flex items-center gap-2 text-success">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">
                Save ${savings} per year with annual billing
              </span>
            </div>
          )}
        </div>

        {/* Price Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className={cn(
              "rounded-xl border-2 p-6 transition-all",
              !isAnnual ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Monthly Billing</h4>
              {!isAnnual && <Badge>Current</Badge>}
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                ${monthlyTotal}
                <span className="text-lg font-normal text-on-surface-variant">/month</span>
              </div>
              <p className="text-sm text-on-surface-variant">Billed monthly, cancel anytime</p>
            </div>
          </div>

          <div
            className={cn(
              "rounded-xl border-2 p-6 transition-all relative",
              isAnnual ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            <Badge className="absolute -top-3 right-4 bg-success text-success-foreground">
              Save 20%
            </Badge>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Annual Billing</h4>
              {isAnnual && <Badge>Current</Badge>}
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                ${annualMonthly}
                <span className="text-lg font-normal text-on-surface-variant">/month</span>
              </div>
              <p className="text-sm text-on-surface-variant">
                ${pricingPlans.reduce((sum, p) => sum + p.annualPrice, 0)} billed annually
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ENTERPRISE CONTACT CTA
// ============================================================================

function EnterpriseCTA() {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
      <CardContent className="py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Enterprise Solutions</h3>
            <p className="text-on-surface-variant max-w-md mx-auto">
              Need a custom plan? We offer tailored solutions for large organizations with specific
              requirements.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              Custom pricing
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              Dedicated support
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              On-premise deployment
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              Custom integrations
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button size="lg">
              Contact Sales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Schedule a Demo
            </Button>
          </div>

          <p className="text-xs text-on-surface-variant">Typically responds within 24 hours</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// USAGE METERS
// ============================================================================

function UsageMeters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Meters</CardTitle>
        <CardDescription>
          Current usage vs. plan limits with visual progress indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {usageMeters.map((meter) => {
            const percentage = (meter.current / meter.limit) * 100;
            const isNearLimit = percentage >= 80;
            const isAtLimit = percentage >= 100;

            return (
              <div key={meter.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{meter.name}</span>
                    {isNearLimit && !isAtLimit && (
                      <Badge
                        variant="outline"
                        className="bg-warning/20 text-warning-foreground border-warning/30"
                      >
                        Near limit
                      </Badge>
                    )}
                    {isAtLimit && <Badge variant="destructive">Limit reached</Badge>}
                  </div>
                  <span className="text-sm text-on-surface-variant">
                    {meter.current} / {meter.limit} {meter.unit}
                  </span>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className={cn(
                    "h-2",
                    isAtLimit && "[&>div]:bg-destructive",
                    isNearLimit && !isAtLimit && "[&>div]:bg-warning",
                  )}
                />
                <p className="text-xs text-on-surface-variant">
                  {percentage >= 100
                    ? "Upgrade to increase your limit"
                    : `${Math.round(100 - percentage)}% remaining`}
                </p>
              </div>
            );
          })}
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Running low on resources?</h4>
            <p className="text-sm text-on-surface-variant">
              Upgrade your plan to unlock higher limits
            </p>
          </div>
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function PricingPage() {
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
              <h1 className="font-display text-xl font-bold tracking-tight">Pricing & Plans</h1>
              <p className="text-on-surface-variant text-sm">
                Patterns for pricing tables, plan selection, and usage displays
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-8 px-6 space-y-16">
        <PricingTable />
        <FeatureComparisonTable />
        <HorizontalPlanCards />
        <PlanToggle />
        <EnterpriseCTA />
        <UsageMeters />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
