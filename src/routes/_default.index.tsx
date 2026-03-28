import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import {
  Wallet,
  Zap,
  TrendingUp,
  BrainCircuit,
  BookOpen,
  Info,
  Check,
  ChevronRight,
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
        <h1 className="font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl">
          Trade on your time
          <br />
          and your terms.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-on-surface-variant">
          We have 24/7 support, $0, and no commission fees on stocks, ETFs, and
          then options. Your first stock is even on us.
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-on-surface-variant/60">
          <Info className="size-3" />
          <span>Limitations and risks apply.</span>
        </div>
        <div className="mt-8">
          <Button size="lg" className="px-8 shadow-glow">
            Get started
          </Button>
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
              "radial-gradient(ellipse at 50% 30%, #5b9bd5 0%, #3a7bbf 25%, #1a4a7a 50%, transparent 70%)",
          }}
        />
      </div>
      <p className="absolute bottom-52 left-0 right-0 text-center text-xs text-on-surface-variant/40">
        Stocks &amp; bonds offered through cnvx Financial. Other fees may apply.
        See our{" "}
        <a href="#" className="underline">
          Fee Schedule
        </a>{" "}
        for more details.
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Section 3 — Stocks & ETFs
   ───────────────────────────────────────────── */

function StocksSection() {
  return (
    <section className="bg-surface-low px-6 py-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-[1fr_1fr]">
        {/* Text */}
        <div>
          <p className="text-xs font-medium tracking-wider text-on-surface-variant/60 uppercase">
            Stocks and ETFs
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Hop on market movements, day or night
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
            Trade your favorite stocks and ETFs 24 hours a day, 5 days a week.
            All still commission-free.*
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant/50">
            <Info className="size-3" />
            <span>Limitations and risks apply</span>
          </div>
          <p className="mt-6 text-xs text-on-surface-variant/40">
            *Other fees may apply
          </p>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center md:justify-end">
          <div className="w-72 rounded-[2.5rem] bg-surface-highest p-4 shadow-2xl">
            <div className="rounded-[2rem] bg-surface-lowest p-5">
              <p className="text-xs text-on-surface-variant/60">GRWL</p>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">
                Tiger Corp
              </p>
              <p className="font-display text-3xl font-bold text-foreground">
                $11.54{" "}
                <span className="text-sm text-on-surface-variant/40">⊕</span>
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs">
                  <span className="text-primary">▲ $1.76 (18.01%)</span>{" "}
                  <span className="text-on-surface-variant/60">Today</span>
                </p>
                <p className="text-xs">
                  <span className="text-primary">▲ $0.0700 (0.61%)</span>{" "}
                  <span className="text-on-surface-variant/60">Overnight</span>
                </p>
              </div>
              {/* Mini chart */}
              <div className="mt-6 h-32 w-full overflow-hidden rounded-xl">
                <svg
                  viewBox="0 0 200 80"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                >
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-primary"
                    points="0,60 20,55 40,50 60,52 80,45 100,48 120,40 140,35 150,38 160,30 170,32 180,25 200,20"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 4 — Strategies
   ───────────────────────────────────────────── */

function StrategiesSection() {
  return (
    <section className="bg-gradient-to-b from-surface-low to-background px-6 py-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-[1fr_1fr]">
        {/* Phone mockup left */}
        <div className="flex justify-center md:justify-start">
          <div className="relative w-72">
            <div className="rounded-[2.5rem] bg-surface-highest p-4 shadow-2xl">
              <div className="flex h-[400px] items-center justify-center rounded-[2rem] bg-surface-lowest">
                {/* Circular progress visualization */}
                <svg viewBox="0 0 120 120" className="size-48">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-surface-container"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray="220 94"
                    strokeLinecap="round"
                    className="text-[#8b5cf6]"
                    transform="rotate(-90 60 60)"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray="140 86"
                    strokeLinecap="round"
                    className="text-[#a78bfa]"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Text right */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-primary">
              <ChevronRight className="size-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">
              cnvx Strategies
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Get the &lsquo;why&rsquo; behind the &lsquo;how&rsquo; of every
            investment
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
            Get an expert managed portfolio and timely market insights. Gold
            members unlock zero management fees on your first dollar over $100K.
          </p>
          <p className="mt-4 text-xs text-on-surface-variant/50">
            Terms apply. Gold subscription $5/month.
          </p>
          <div className="mt-6">
            <Button size="lg" className="px-8 shadow-glow">
              Get started
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 5 — ETFs + Options Grid
   ───────────────────────────────────────────── */

function EtfsOptionsGrid() {
  return (
    <section className="bg-background px-6 py-0">
      <div className="mx-auto grid max-w-[1400px] gap-0 md:grid-cols-2">
        {/* ETFs */}
        <div className="flex min-h-[500px] flex-col justify-between bg-background p-10 md:p-16">
          <div>
            <p className="text-xs font-medium tracking-wider text-on-surface-variant/60 uppercase">
              ETFs
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground md:text-4xl">
              Get diversified with stock bundles
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
              ETFs can remove some of the pressure from picking individual
              stocks. Invest in a group of companies all at once.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant/50">
              <Info className="size-3" />
              <a href="#" className="underline">
                Diversification Disclosures
              </a>
            </div>
          </div>
          {/* Abstract geometric illustration */}
          <div className="mt-8 flex justify-center opacity-20">
            <svg viewBox="0 0 200 150" className="h-40 w-56">
              <polygon
                points="30,140 100,20 170,140"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground"
              />
              <polygon
                points="50,140 100,50 150,140"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground"
              />
              <line
                x1="20"
                y1="80"
                x2="180"
                y2="80"
                stroke="currentColor"
                strokeWidth="1"
                className="text-foreground"
              />
            </svg>
          </div>
        </div>

        {/* Options */}
        <div className="flex min-h-[500px] flex-col justify-between bg-background p-10 md:p-16">
          <div>
            <p className="text-xs font-medium tracking-wider text-on-surface-variant/60 uppercase">
              Options
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground md:text-4xl">
              Level up your investing strategies
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
              Get the right to buy or sell stocks or ETFs at a specific date for
              a specific price — commission-free.{" "}
              <a href="#" className="underline">
                Learn more about options trading
              </a>
              .
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant/50">
              <Info className="size-3" />
              <a href="#" className="underline">
                Options Risk Disclosures
              </a>
            </div>
          </div>
          {/* Abstract geometric illustration */}
          <div className="mt-8 flex justify-center opacity-20">
            <svg viewBox="0 0 200 150" className="h-40 w-56">
              <rect
                x="20"
                y="30"
                width="40"
                height="100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground"
                transform="rotate(-10 40 80)"
              />
              <rect
                x="70"
                y="40"
                width="40"
                height="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground"
                transform="rotate(5 90 85)"
              />
              <rect
                x="120"
                y="20"
                width="40"
                height="110"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground"
                transform="rotate(-5 140 75)"
              />
            </svg>
          </div>
        </div>
      </div>
      <p className="mx-auto max-w-[1400px] px-6 pb-8 text-xs text-on-surface-variant/40">
        All investing involves risk. ETFs offered by cnvx Financial. Options are
        offered through cnvx Financial. Options are risky and aren&apos;t
        suitable for all investors.
      </p>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 6 — Margin + Crypto Grid
   ───────────────────────────────────────────── */

function MarginCryptoGrid() {
  return (
    <section className="bg-background px-6 py-0">
      <div className="mx-auto grid max-w-[1400px] gap-0 md:grid-cols-2">
        {/* Margin — light */}
        <div className="flex min-h-[500px] flex-col justify-between bg-background p-10 md:p-16">
          <div>
            <p className="text-xs font-medium tracking-wider text-on-surface-variant/60 uppercase">
              Margin
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground md:text-4xl">
              Increase your buying power
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
              Need more leverage to purchase the stocks and ETFs you&apos;ve
              been eyeing? With Margin, you can preserve your extra cash by
              borrowing some from us.{" "}
              <a href="#" className="underline">
                See our rates
              </a>
              .
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant/50">
              <Info className="size-3" />
              <span>Risk of Margin Disclosure</span>
            </div>
          </div>
          {/* Pie chart line art */}
          <div className="mt-8 flex justify-center opacity-20">
            <svg viewBox="0 0 200 200" className="h-40 w-40">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground"
              />
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="20"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground"
              />
              <line
                x1="100"
                y1="100"
                x2="170"
                y2="140"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground"
              />
              <path
                d="M 100 20 A 80 80 0 0 1 170 140"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-foreground"
              />
            </svg>
          </div>
        </div>

        {/* Crypto — dark */}
        <div className="flex min-h-[500px] flex-col justify-between bg-surface-lowest p-10 text-foreground md:p-16">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                <ChevronRight className="size-3 text-primary-foreground" />
              </div>
              <span className="text-xs font-medium">cnvx Crypto</span>
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
              Break into Bitcoin
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
              Buy, sell, and store popular cryptocurrencies, 24/7. For as little
              as $1, you can dive into the Bitcoin, Ethereum, and Altcoin
              family.{" "}
              <a href="#" className="underline text-on-surface-variant">
                Learn more about cnvx Crypto
              </a>
              .
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant/50">
              <Info className="size-3" />
              <span>Crypto Risk Disclosures</span>
            </div>
          </div>
          {/* Spiral coin line art */}
          <div className="mt-8 flex justify-center opacity-20">
            <svg viewBox="0 0 200 200" className="h-40 w-40">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180
                const x = 100 + Math.cos(angle) * 60
                const y = 100 + Math.sin(angle) * 60
                return (
                  <ellipse
                    key={i}
                    cx={x}
                    cy={y}
                    rx="30"
                    ry="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-foreground"
                    transform={`rotate(${i * 30} ${x} ${y})`}
                  />
                )
              })}
            </svg>
          </div>
        </div>
      </div>
      <p className="mx-auto max-w-[1400px] px-6 pb-8 text-xs text-on-surface-variant/40">
        Margin offered through cnvx Financial. Crypto offered through cnvx
        Crypto, LLC, a member of FINRA.
      </p>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 7 — "How to Enhance" (flip cards)
   ───────────────────────────────────────────── */

const enhanceCards = [
  {
    category: "Fractional Shares",
    title: "Own shares in the companies you love for as little as $1.",
    back: "Fractional shares allow you to buy a portion of a stock, making investing accessible regardless of share price.",
  },
  {
    category: "Investment Transfers",
    title: "Add to your wealth on a consolidated basis: never forget to invest.",
    back: "Set up automatic recurring investments to build your portfolio consistently over time.",
  },
  {
    category: "Dividend Reinvestment",
    title: "Why pay you some guidance on your first stock if it costs us nothing? Not us.",
    back: "Automatically reinvest your dividends to compound your returns over time.",
  },
  {
    category: "24/7 Support",
    title: "With buy, why sell? Build a life while your first stock does its thing.",
    back: "Our support team is available around the clock to help with any questions.",
  },
  {
    category: "Recommendations",
    title: "What if your equity guidance on your first stock costs it even on us? Not us.",
    back: "Get personalized investment recommendations based on your goals and risk tolerance.",
  },
  {
    category: "IPO Access",
    title: "Be early. Get IPO access to buy shares at the IPO price.",
    back: "Participate in initial public offerings before shares hit the open market.",
  },
]

function FlipCard({
  card,
}: {
  card: (typeof enhanceCards)[number]
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
          <p className="text-xs font-medium uppercase tracking-wider opacity-60">
            {card.category}
          </p>
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

function EnhanceSection() {
  return (
    <section className="bg-primary px-6 py-24 text-primary-foreground">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-5xl">
          How to enhance your
          <br />
          investments at cnvx
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enhanceCards.map((card) => (
            <FlipCard key={card.category} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 8 — Level Up / Gold APY
   ───────────────────────────────────────────── */

function GoldApySection() {
  return (
    <section className="bg-surface-lowest px-6 py-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-[1fr_1fr]">
        {/* Text left */}
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Level Up with
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
            Your money makes money with 3.35% APY on eligible brokerage cash.
            Your first 30 days are free, then you&apos;ll pay a subscription fee
            ($5/month).
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant/50">
            <Info className="size-3" />
            <span>Terms and disclosures</span>
          </div>
          <div className="mt-8">
            <Button size="lg" className="px-8 shadow-glow">
              Start earning with Gold
            </Button>
          </div>
        </div>

        {/* Giant APY number right */}
        <div className="text-right">
          <span className="font-display text-8xl font-bold leading-none tracking-tight text-foreground/80 md:text-9xl">
            3.35
            <span className="text-4xl md:text-5xl">%</span>
          </span>
          <br />
          <span className="font-display text-4xl font-bold text-foreground/50 md:text-5xl">
            APY
          </span>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 9 — Gold Feature Cards (3-col)
   ───────────────────────────────────────────── */

const goldFeatures = [
  {
    icon: Wallet,
    title: "3.35% APY with High-Yield Cash",
    description:
      "Earn more interest on your eligible brokerage cash. There's no cap, and you can invest or withdraw anytime.*",
  },
  {
    icon: Zap,
    title: "Bigger Instant Deposits",
    description:
      "Trade right away, with deposits up to $1k of your portfolio's value.",
  },
  {
    icon: TrendingUp,
    title: "Get your first $1k of margin interest-free",
    description:
      "Then enjoy margin rates between 3.95% and 5%*.",
  },
]

function GoldFeaturesSection() {
  return (
    <section className="bg-surface-lowest px-6 pb-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-3">
          {goldFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-surface-high p-6"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="size-5 text-primary" />
              </div>
              <h4 className="font-display text-base font-semibold text-foreground">
                {feature.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 10 — Gold Tools (2-col)
   ───────────────────────────────────────────── */

function GoldToolsSection() {
  return (
    <section className="bg-surface-lowest px-6 pb-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-surface-high p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10">
              <BrainCircuit className="size-5 text-primary" />
            </div>
            <h4 className="font-display text-base font-semibold text-foreground">
              Your AI investing assistant
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Use built-in intelligence to understand why markets are moving and
              what it means for your holdings.
            </p>
          </div>
          <div className="rounded-2xl bg-surface-high p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="size-5 text-primary" />
            </div>
            <h4 className="font-display text-base font-semibold text-foreground">
              Professional research
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Plan your next move with in-depth research by independent financial
              analysts at Morningstar.
            </p>
          </div>
        </div>
        <p className="mt-6 text-xs text-on-surface-variant/40">
          *Terms apply. Rates subject to change. Cash interest is obtained
          through the High-Yield Cash program, a cash balance is needed. If you
          have a cnvx Gold account, you can earn 3.35% APY.
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 11 — Brand Label (cnvx Cortex)
   ───────────────────────────────────────────── */

function BrandLabel() {
  return (
    <section className="bg-surface-lowest px-6 py-8">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2">
        <span className="font-display text-base font-semibold text-foreground">
          cnvx Cortex
        </span>
        <Check className="size-4 text-primary" />
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 12 — Built-in Intelligence
   ───────────────────────────────────────────── */

function IntelligenceSection() {
  return (
    <section className="bg-surface-lowest px-6 py-24">
      <div className="mx-auto max-w-[1400px] text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Built-in intelligence for sharper trading
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Your AI-powered investing assistant that helps you understand the
          markets and make your next move. Only with cnvx Gold.
        </p>
        <div className="mt-8">
          <Button size="lg" className="px-8 shadow-glow">
            Get started
          </Button>
        </div>

        {/* Laptop + phone mockup */}
        <div className="relative mx-auto mt-12 max-w-4xl">
          <div className="rounded-2xl bg-surface-high p-4 shadow-xl">
            <div className="h-64 rounded-xl bg-surface-lowest md:h-80">
              {/* Trading chart placeholder */}
              <div className="flex h-full items-end p-6">
                <svg
                  viewBox="0 0 400 120"
                  className="h-32 w-full"
                  preserveAspectRatio="none"
                >
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                    points="0,100 30,90 60,95 90,70 120,75 150,50 180,55 210,40 240,45 270,30 300,35 330,20 360,25 400,10"
                  />
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-on-surface-variant/30"
                    points="0,110 30,100 60,105 90,85 120,90 150,70 180,75 210,60 240,65 270,55 300,58 330,45 360,50 400,40"
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* Phone overlay */}
          <div className="absolute -right-4 -bottom-4 w-32 rounded-[1.5rem] bg-surface-highest p-2 shadow-2xl md:w-40">
            <div className="h-48 rounded-[1.2rem] bg-surface-lowest md:h-56" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 13 — Digests + Trade Builder
   ───────────────────────────────────────────── */

function DigestsTradeSection() {
  return (
    <section className="bg-surface-lowest px-6 py-12">
      <div className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-2">
        {/* Digests */}
        <div className="flex flex-col rounded-2xl bg-surface-high p-8">
          <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Digests
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Navigate market moves with insights on why prices are shifting.
            Complex data, now in everyday language.
          </p>
          <div className="mt-4">
            <Button size="sm" className="shadow-glow">
              Unlock with Gold
            </Button>
          </div>
          {/* Dot matrix pattern */}
          <div className="mt-8 flex-1 overflow-hidden rounded-xl bg-surface-lowest p-4">
            <div
              className="h-full min-h-[200px] w-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--on-surface-variant) 0.5px, transparent 0.5px)",
                backgroundSize: "12px 12px",
                opacity: 0.15,
              }}
            />
          </div>
        </div>

        {/* Trade Builder */}
        <div className="flex flex-col rounded-2xl bg-surface-high p-8">
          <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Trade Builder
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Turn your strategy into trade ideas effortlessly. Your outlook,
            refined into relevant opportunities.
          </p>
          <div className="mt-4">
            <span className="text-sm font-medium text-primary">
              Coming soon
            </span>
          </div>
          {/* Glowing orbs */}
          <div className="relative mt-8 flex-1 overflow-hidden rounded-xl bg-surface-lowest p-4">
            <div
              className="h-full min-h-[200px] w-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--on-surface-variant) 0.5px, transparent 0.5px)",
                backgroundSize: "12px 12px",
                opacity: 0.1,
              }}
            />
            {/* Colored orbs */}
            <div className="absolute top-1/4 left-1/3 size-8 rounded-full bg-green-500 blur-sm opacity-70" />
            <div className="absolute top-1/2 right-1/3 size-6 rounded-full bg-orange-500 blur-sm opacity-70" />
            <div className="absolute top-1/3 right-1/4 size-10 rounded-full bg-green-400 blur-sm opacity-60" />
            <div className="absolute bottom-1/3 left-1/2 size-5 rounded-full bg-orange-400 blur-sm opacity-60" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 14 — Custom Indicators + Custom Scans
   ───────────────────────────────────────────── */

function CustomFeaturesSection() {
  return (
    <section className="bg-surface-lowest px-6 py-12">
      <div className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-2">
        {/* Custom Indicators */}
        <div className="flex flex-col rounded-2xl bg-surface-high p-8">
          <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Custom Indicators
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Create your own trading signals without code. Define your strategy in
            natural language — AI builds the rest.
          </p>
          <p className="mt-3 text-sm font-medium text-primary">
            Coming soon to Legend
          </p>

          {/* Chat bubbles mockup */}
          <div className="mt-6 space-y-3">
            <div className="self-end rounded-2xl rounded-br-sm bg-surface-container px-4 py-3 text-sm text-foreground">
              Help me spot bullish signals
            </div>
            <div className="self-start rounded-2xl rounded-bl-sm bg-surface-lowest px-4 py-3 text-sm text-foreground">
              Sure thing — I&apos;ll build the Golden Crossover indicator.
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="mt-6 flex-1 overflow-hidden rounded-xl bg-surface-lowest p-4">
            <svg
              viewBox="0 0 300 100"
              className="h-32 w-full"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points="0,70 30,65 60,60 90,55 120,60 150,50 180,45 210,50 240,40 270,35 300,30"
              />
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                points="0,80 30,78 60,75 90,70 120,65 150,68 180,60 210,55 240,58 270,50 300,45"
              />
              {/* Signal dots */}
              <circle cx="90" cy="55" r="4" fill="#f59e0b" />
              <circle cx="150" cy="50" r="4" fill="#22c55e" />
              <circle cx="210" cy="50" r="4" fill="#f59e0b" />
              <circle cx="270" cy="35" r="4" fill="#22c55e" />
            </svg>
          </div>
          <p className="mt-4 text-xs text-on-surface-variant/40">
            For illustrative purposes only. Not a recommendation.
          </p>
        </div>

        {/* Custom Scans */}
        <div className="flex flex-col rounded-2xl bg-surface-high p-8">
          <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Custom Scans
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Build custom scans with only your words. AI monitors the market for
            assets that match your strategy.
          </p>
          <p className="mt-3 text-sm font-medium text-primary">
            Coming soon to Legend
          </p>

          {/* Chat bubbles */}
          <div className="mt-6 space-y-3">
            <div className="self-end rounded-2xl rounded-br-sm bg-surface-container px-4 py-3 text-sm text-foreground">
              Show me the top movers in tech today
            </div>
            <div className="self-start rounded-2xl rounded-bl-sm bg-surface-lowest px-4 py-3 text-sm text-foreground">
              Got it — I&apos;m running a scan.
            </div>
          </div>

          {/* Data table mockup */}
          <div className="mt-6 flex-1 overflow-hidden rounded-xl bg-surface-lowest p-4">
            <p className="mb-3 text-xs font-medium text-on-surface-variant/60">
              Tech Sector Top Movers
            </p>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-on-surface-variant/40">
                  <th className="pb-2 text-left font-medium">#</th>
                  <th className="pb-2 text-left font-medium">Symbol</th>
                  <th className="pb-2 text-left font-medium">Name</th>
                  <th className="pb-2 text-right font-medium">Price</th>
                  <th className="pb-2 text-right font-medium">Chg</th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                {[
                  { n: 1, sym: "AMD", name: "Advanced Micro", price: "$167.31", chg: "+4.2%" },
                  { n: 2, sym: "CRM", name: "Salesforce", price: "$314.59", chg: "+3.1%" },
                  { n: 3, sym: "CRDO", name: "Credo Systems", price: "$80.91", chg: "+2.8%" },
                  { n: 4, sym: "DASH", name: "DoorDash", price: "$175.72", chg: "+2.3%" },
                  { n: 5, sym: "SPAN", name: "SPAN Systems", price: "$52.71", chg: "+1.9%" },
                ].map((row) => (
                  <tr key={row.sym} className="border-t border-surface-container/30">
                    <td className="py-2 text-on-surface-variant/40">{row.n}</td>
                    <td className="py-2 font-medium">{row.sym}</td>
                    <td className="py-2 text-on-surface-variant/60">{row.name}</td>
                    <td className="py-2 text-right">{row.price}</td>
                    <td className="py-2 text-right text-primary">{row.chg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-on-surface-variant/40">
            For illustrative purposes only. Not a recommendation.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Section 15 — Join CTA (with rain)
   ───────────────────────────────────────────── */

function JoinCtaSection() {
  return (
    <section className="relative overflow-hidden bg-surface-lowest px-6 py-32 md:py-48">
      {/* Animated rain overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-foreground/20"
            style={{
              left: `${(i / 40) * 100}%`,
              height: `${60 + Math.random() * 100}px`,
              top: `-${Math.random() * 200}px`,
              animation: `rain-fall ${3 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Join a new generation
          <br />
          of investors
        </h2>
        <div className="mt-10">
          <Button size="lg" className="px-8 shadow-glow">
            Get started
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
      <StocksSection />
      <StrategiesSection />
      <EtfsOptionsGrid />
      <MarginCryptoGrid />
      <EnhanceSection />
      <GoldApySection />
      <GoldFeaturesSection />
      <GoldToolsSection />
      <BrandLabel />
      <IntelligenceSection />
      <DigestsTradeSection />
      <CustomFeaturesSection />
      <JoinCtaSection />
    </>
  )
}
