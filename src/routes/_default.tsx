import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"

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
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
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
          className="flex items-center gap-2"
        >
          <img
            src="/logos/SVG/icon_dark.svg"
            alt="cnvx"
            className="h-8 w-8 dark:hidden"
          />
          <img
            src="/logos/SVG/icon_light.svg"
            alt="cnvx"
            className="hidden h-8 w-8 dark:block"
          />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            cnvx
          </span>
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
          <Button
            size="sm"
            nativeButton={false}
            render={<Link to="/$slug/tickets/dashboard" params={{ slug: "acme-corp" }} />}
          >
            Try Demo
          </Button>

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
                  <Button
                    className="w-full"
                    nativeButton={false}
                    render={<Link to="/$slug/tickets/dashboard" params={{ slug: "acme-corp" }} />}
                  >
                    Try Demo
                  </Button>
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
        {/* Copyright + legal */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm opacity-80">
            &copy; 2026 cnvx. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm opacity-60">
            <span>Privacy</span>
            <span className="opacity-40">·</span>
            <span>Terms</span>
          </div>
        </div>

        {/* Large wordmark */}
        <div className="mt-16 flex items-end gap-4 overflow-hidden md:gap-6 lg:gap-8">
          <img
            src="/logos/SVG/icon_light.svg"
            alt=""
            className="h-24 w-24 shrink-0 opacity-90 md:h-36 md:w-36 lg:h-48 lg:w-48"
          />
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
