import { FlaskConical } from "lucide-react"
import { NAV_ITEMS, type TrialFlowPage } from "./trialflow-data"

interface TrialFlowSidebarProps {
  activePage: TrialFlowPage
  onNavigate: (page: TrialFlowPage) => void
}

export function TrialFlowSidebar({
  activePage,
  onNavigate,
}: TrialFlowSidebarProps) {
  return (
    <aside className="flex w-60 shrink-0 flex-col bg-[#0f172a] text-slate-400">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600">
          <FlaskConical className="size-4 text-white" strokeWidth={2} />
        </div>
        <span className="text-base font-semibold tracking-tight text-white">
          TrialFlow
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-slate-700/50 font-medium text-white"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <item.icon className="size-4" strokeWidth={1.75} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4">
        <span className="text-xs text-slate-600">Mock Preview</span>
      </div>
    </aside>
  )
}
