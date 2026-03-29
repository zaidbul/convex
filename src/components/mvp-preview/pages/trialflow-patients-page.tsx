import { MOCK_PATIENTS } from "../trialflow-data"

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Screening: "bg-blue-100 text-blue-700",
  Completed: "bg-slate-100 text-slate-600",
  Withdrawn: "bg-red-100 text-red-700",
}

export function TrialFlowPatientsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Patient Registry
        </h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {MOCK_PATIENTS.length} patients
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Patient ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Trial
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Site
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Last Visit
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PATIENTS.map((patient) => (
                <tr
                  key={patient.patientId}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {patient.patientId}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {patient.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {patient.trial}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{patient.site}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[patient.status]}`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {patient.lastVisit}
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
