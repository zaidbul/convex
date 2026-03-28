import {
  HeadContent,
  Outlet,
  Scripts,
  type ErrorComponentProps,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { ClerkProvider } from "@clerk/tanstack-react-start"
import { ThemeProvider } from "next-themes"
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"

import appCss from "../styles.css?url"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
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
  shellComponent: RootDocument,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
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
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
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
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-medium text-background"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
