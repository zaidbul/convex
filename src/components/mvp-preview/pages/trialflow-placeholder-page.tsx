import type { LucideIcon } from "lucide-react"

interface TrialFlowPlaceholderPageProps {
  title: string
  description: string
  icon: LucideIcon
}

export function TrialFlowPlaceholderPage({
  title,
  description,
  icon: Icon,
}: TrialFlowPlaceholderPageProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-slate-100">
          <Icon className="size-8 text-slate-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
        <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          Coming soon
        </span>
      </div>
    </div>
  )
}
