import {
  FlaskConical,
  Users,
  MapPin,
  ShieldCheck,
  UserPlus,
  FileCheck,
  AlertTriangle,
  ClipboardCheck,
  Building2,
} from "lucide-react"
import {
  TRIALFLOW_STATS,
  MOCK_RECENT_ACTIVITY,
  MOCK_TRIALS,
} from "../trialflow-data"

const statCards = [
  {
    label: "Active Trials",
    value: TRIALFLOW_STATS.activeTrials,
    sub: "+2 this month",
    icon: FlaskConical,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Total Patients",
    value: TRIALFLOW_STATS.totalPatients.toLocaleString(),
    sub: "+98 enrolled this week",
    icon: Users,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Active Sites",
    value: TRIALFLOW_STATS.activeSites,
    sub: "3 pending activation",
    icon: MapPin,
    color: "bg-violet-100 text-violet-600",
  },
  {
    label: "Compliance Rate",
    value: `${TRIALFLOW_STATS.complianceRate}%`,
    sub: "+1.2% vs last quarter",
    icon: ShieldCheck,
    color: "bg-amber-100 text-amber-600",
  },
]

const activityIcons: Record<string, typeof FlaskConical> = {
  patient: UserPlus,
  protocol: FileCheck,
  alert: AlertTriangle,
  visit: ClipboardCheck,
  site: Building2,
}

const activityColors: Record<string, string> = {
  patient: "bg-blue-500",
  protocol: "bg-emerald-500",
  alert: "bg-amber-500",
  visit: "bg-violet-500",
  site: "bg-teal-500",
}

const enrollmentMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
const enrollmentValues = [120, 280, 410, 580, 720, 890, 1050]

export function TrialFlowDashboardPage() {
  const maxEnrollment = Math.max(...enrollmentValues)

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{stat.sub}</p>
              </div>
              <div className={`rounded-xl p-2.5 ${stat.color}`}>
                <stat.icon className="size-5" strokeWidth={1.75} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Enrollment Progress */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">
              Enrollment Progress
            </h3>
            <span className="text-xs text-slate-400">2024 YTD</span>
          </div>
          <div className="flex h-48 items-end gap-1">
            {enrollmentValues.map((val, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative w-full">
                  <div
                    className="w-full rounded-t-md bg-blue-500/80 transition-all"
                    style={{
                      height: `${(val / maxEnrollment) * 180}px`,
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400">
                  {enrollmentMonths[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-slate-900">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {MOCK_RECENT_ACTIVITY.map((activity) => {
              const Icon = activityIcons[activity.type]
              return (
                <div key={activity.id} className="flex gap-3">
                  <div
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${activityColors[activity.type]}`}
                  >
                    <Icon className="size-3.5 text-white" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug text-slate-700">
                      {activity.message}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Clinical Trials Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Clinical Trials</h3>
          <span className="text-xs text-slate-400">
            {MOCK_TRIALS.length} trials
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 pr-4 text-left font-medium text-slate-500">
                  Protocol
                </th>
                <th className="pb-3 pr-4 text-left font-medium text-slate-500">
                  Trial Name
                </th>
                <th className="pb-3 pr-4 text-left font-medium text-slate-500">
                  Phase
                </th>
                <th className="pb-3 pr-4 text-left font-medium text-slate-500">
                  Status
                </th>
                <th className="pb-3 pr-4 text-left font-medium text-slate-500">
                  Sponsor
                </th>
                <th className="pb-3 pr-4 text-right font-medium text-slate-500">
                  Sites
                </th>
                <th className="pb-3 text-right font-medium text-slate-500">
                  Enrollment
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRIALS.slice(0, 3).map((trial) => (
                <tr
                  key={trial.protocol}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500">
                    {trial.protocol}
                  </td>
                  <td className="py-3 pr-4 text-slate-900">{trial.name}</td>
                  <td className="py-3 pr-4 text-slate-500">{trial.phase}</td>
                  <td className="py-3 pr-4">
                    <TrialStatusBadge status={trial.status} />
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{trial.sponsor}</td>
                  <td className="py-3 pr-4 text-right text-slate-500">
                    {trial.sites}
                  </td>
                  <td className="py-3 text-right">
                    <EnrollmentBar enrollment={trial.enrollment} />
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

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Recruiting: "bg-blue-100 text-blue-700",
  Completed: "bg-slate-100 text-slate-600",
  Suspended: "bg-red-100 text-red-700",
}

function TrialStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  )
}

function EnrollmentBar({
  enrollment,
}: {
  enrollment: { current: number; target: number }
}) {
  const pct = Math.min((enrollment.current / enrollment.target) * 100, 100)
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-500">
        {enrollment.current}/{enrollment.target}
      </span>
    </div>
  )
}
