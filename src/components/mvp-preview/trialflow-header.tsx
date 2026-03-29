import { Link } from "@tanstack/react-router"
import { ArrowLeft, Search, Bell } from "lucide-react"

interface TrialFlowHeaderProps {
  title: string
  subtitle?: string
  slug: string
}

export function TrialFlowHeader({ title, subtitle, slug }: TrialFlowHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle && (
          <p className="text-xs text-slate-400">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Mock search bar */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
          <Search className="size-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="text-sm text-slate-400">Search trials...</span>
        </div>

        {/* Mock notification bell */}
        <button className="relative rounded-lg p-1.5 hover:bg-slate-100">
          <Bell className="size-4 text-slate-500" strokeWidth={1.75} />
          <span className="absolute right-1 top-1 size-1.5 rounded-full bg-blue-500" />
        </button>

        {/* Back to dashboard */}
        <Link
          to="/$slug/tickets/dashboard"
          params={{ slug }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.75} />
          Back to Dashboard
        </Link>
      </div>
    </header>
  )
}
