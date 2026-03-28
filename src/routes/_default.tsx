import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import {
  Menu,
  Globe,
  AtSign,
  Hash,
  Mail,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetBody,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_default")({
  component: DefaultLayout,
})

const navLinks = [
  { label: "Invest", href: "#" },
  { label: "Cash", href: "#" },
  { label: "Strategies", href: "#" },
  { label: "Gold", href: "#" },
  { label: "Learn", href: "#" },
]

const footerSections = [
  {
    title: "Product",
    links: [
      "Invest",
      "Predict",
      "Strategies",
      "Retirement",
      "Gold",
      "Crypto",
      "Chain",
      "Wallet",
      "Connect",
      "API",
      "Legend",
      "Options",
      "Futures",
      "Trading",
      "Custodial",
      "Ventures",
      "Social",
      "Banking",
      "Gold Card",
      "Platinum Card",
      "Learn",
      "Snacks",
    ],
  },
  {
    title: "Company",
    links: [
      "About us",
      "Blog",
      "Partner With Us",
      "Affiliates",
      "Press",
      "Careers",
      "Investor Relations",
      "Support",
      "ESG",
      "Investor Index",
      "cnvx Merch",
    ],
  },
  {
    title: "Legal & Regulatory",
    links: [
      "Terms & Conditions",
      "Disclosures",
      "Privacy Statement",
      "Market Privacy Statement",
      "Law Enforcement Requests",
      "Your Privacy Choices",
    ],
  },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface-lowest/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center px-6">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-tight text-foreground"
        >
          cnvx
        </Link>

        {/* Desktop nav links */}
        <div className="ml-8 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log In
          </Button>
          <Button size="sm">Sign Up</Button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetBody className="pt-12">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted/50"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Log In
                  </Button>
                  <Button className="w-full">Sign Up</Button>
                </div>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-6 pt-12 pb-16">
        {/* Top row: regulatory links + social */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm underline underline-offset-4">
            <a href="#">Customer Relationship Summaries</a>
            <span className="opacity-40">|</span>
            <a href="#">BrokerCheck</a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="mr-2 opacity-60">Follow us on</span>
            <a href="#" className="rounded-full p-1.5 hover:bg-primary-foreground/10">
              <Globe className="size-4" />
            </a>
            <a href="#" className="rounded-full p-1.5 hover:bg-primary-foreground/10">
              <AtSign className="size-4" />
            </a>
            <a href="#" className="rounded-full p-1.5 hover:bg-primary-foreground/10">
              <Hash className="size-4" />
            </a>
            <a href="#" className="rounded-full p-1.5 hover:bg-primary-foreground/10">
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        {/* Link grid + legal prose */}
        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm opacity-80 transition-opacity hover:opacity-100"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal prose column */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="mb-4 text-sm font-semibold">
              All investing involves risk.
            </h4>
            <div className="space-y-4 text-xs leading-relaxed opacity-80">
              <p>
                Brokerage services are offered through cnvx Financial LLC, a
                registered broker-dealer. Clearing services through cnvx
                Securities, LLC, a registered broker-dealer.
              </p>
              <p>
                Portfolio Management offered through cnvx Strategies, an
                SEC-registered investment advisor. For additional information
                about services, fees, risks, and conflicts of interest, please
                see our firm&apos;s brochure.
              </p>
              <p>
                Cryptocurrency services are offered through an account with cnvx
                Crypto, LLC. cnvx Crypto is licensed to engage in virtual
                currency business activity. Cryptocurrency held through cnvx
                Crypto is not FDIC insured or SIPC protected.
              </p>
            </div>
          </div>
        </div>

        {/* Large wordmark */}
        <div className="mt-16 overflow-hidden">
          <span className="font-display text-[8rem] leading-none font-bold opacity-90 md:text-[12rem] lg:text-[16rem]">
            cnvx
          </span>
        </div>
      </div>
    </footer>
  )
}

function DefaultLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
