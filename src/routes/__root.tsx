import {
  HeadContent,
  Outlet,
  Scripts,
  type ErrorComponentProps,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import React from "react"

const TanStackRouterDevtools = import.meta.env.DEV
  ? React.lazy(() =>
      import("@tanstack/react-router-devtools").then((mod) => ({
        default: mod.TanStackRouterDevtools,
      }))
    )
  : () => null
import { ThemeProvider } from "next-themes"
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { RouteLoadingIndicator } from "@/components/route-loading-indicator"
import { sessionQuery } from "@/query/options/session"

import appCss from "../styles.css?url"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(sessionQuery)
      return { session }
    } catch {
      return { session: { userId: null, orgId: null, orgSlug: null, token: null } }
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "cnvx — Design System",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/logos/SVG/icon.svg",
      },
    ],
  }),
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFoundComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <React.Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </React.Suspense>
    </QueryClientProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <RouteLoadingIndicator />
          {children}
          <Toaster />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootNotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-low px-6">
      <div className="w-full max-w-lg rounded-2xl border border-outline-variant/20 bg-surface p-6 shadow-sm text-center">
        <p className="text-4xl font-semibold text-foreground">404</p>
        <h1 className="mt-2 text-lg font-medium text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button className="mt-5" render={<a href="/" />}>
          Go home
        </Button>
      </div>
    </div>
  )
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : String(error)

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-low px-6">
      <div className="w-full max-w-lg rounded-2xl border border-outline-variant/20 bg-surface p-6 shadow-sm">
        <p className="text-sm font-medium text-destructive">Application error</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Something went wrong while rendering this route.
        </h1>
        {import.meta.env.DEV ? (
          <pre className="mt-4 overflow-x-auto rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            <code>{message}</code>
          </pre>
        ) : null}
        <Button type="button" className="mt-5" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  )
}
