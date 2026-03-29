import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { QueryClient } from "@tanstack/react-query"
import { routeTree } from "./routeTree.gen"

let queryClientSingleton: QueryClient | undefined

const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
}

function getQueryClient() {
  // SSR: create a fresh client per request to prevent cross-user data leakage
  if (typeof window === "undefined") {
    return new QueryClient(queryClientOptions)
  }
  // Client: reuse singleton
  if (!queryClientSingleton) {
    queryClientSingleton = new QueryClient(queryClientOptions)
  }
  return queryClientSingleton
}

export function getRouter() {
  const queryClient = getQueryClient()

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultViewTransition: false,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
