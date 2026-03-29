import { useRouterState } from "@tanstack/react-router"

export function RouteLoadingIndicator() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })

  return (
    <div
      role="progressbar"
      aria-hidden={!isLoading}
      aria-label="Page loading"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999]"
    >
      <div
        className={`h-0.5 bg-primary transition-opacity duration-200 ${
          isLoading
            ? "animate-route-loading opacity-100"
            : "opacity-0"
        }`}
      />
    </div>
  )
}
