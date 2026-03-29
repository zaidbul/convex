import { MOCK_TRIALS } from "../trialflow-data"

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Recruiting: "bg-blue-100 text-blue-700",
  Completed: "bg-slate-100 text-slate-600",
  Suspended: "bg-red-100 text-red-700",
}

export function TrialFlowTrialsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Clinical Trials
        </h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {MOCK_TRIALS.length} trials
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Protocol
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Trial Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Phase
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Sponsor
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Sites
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Enrollment
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRIALS.map((trial) => {
                const pct = Math.min(
                  (trial.enrollment.current / trial.enrollment.target) * 100,
                  100
                )
                return (
                  <tr
                    key={trial.protocol}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {trial.protocol}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {trial.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{trial.phase}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[trial.status]}`}
                      >
                        {trial.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {trial.sponsor}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {trial.sites}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="min-w-[5rem] text-right text-xs text-slate-500">
                          {trial.enrollment.current.toLocaleString()}/
                          {trial.enrollment.target.toLocaleString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
