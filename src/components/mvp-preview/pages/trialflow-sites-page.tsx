import { MOCK_SITES } from "../trialflow-data"

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Inactive: "bg-slate-100 text-slate-600",
}

export function TrialFlowSitesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Research Sites
        </h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {MOCK_SITES.length} sites
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Site ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Location
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Principal Investigator
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Active Trials
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SITES.map((site) => (
                <tr
                  key={site.siteId}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {site.siteId}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {site.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{site.location}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {site.principalInvestigator}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {site.activeTrials}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[site.status]}`}
                    >
                      {site.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
