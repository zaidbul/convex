import { useState } from "react"
import { FileText, BarChart3, Settings } from "lucide-react"
import { type TrialFlowPage, PAGE_TITLES } from "./trialflow-data"
import { TrialFlowSidebar } from "./trialflow-sidebar"
import { TrialFlowHeader } from "./trialflow-header"
import { TrialFlowDashboardPage } from "./pages/trialflow-dashboard-page"
import { TrialFlowTrialsPage } from "./pages/trialflow-trials-page"
import { TrialFlowPatientsPage } from "./pages/trialflow-patients-page"
import { TrialFlowSitesPage } from "./pages/trialflow-sites-page"
import { TrialFlowPlaceholderPage } from "./pages/trialflow-placeholder-page"

const subtitles: Partial<Record<TrialFlowPage, string>> = {
  dashboard: "Clinical trial overview and metrics",
}

interface TrialFlowAppProps {
  slug: string
}

export function TrialFlowApp({ slug }: TrialFlowAppProps) {
  const [activePage, setActivePage] = useState<TrialFlowPage>("dashboard")

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      <TrialFlowSidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TrialFlowHeader
          title={PAGE_TITLES[activePage]}
          subtitle={subtitles[activePage]}
          slug={slug}
        />

        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          {activePage === "dashboard" && <TrialFlowDashboardPage />}
          {activePage === "trials" && <TrialFlowTrialsPage />}
          {activePage === "patients" && <TrialFlowPatientsPage />}
          {activePage === "sites" && <TrialFlowSitesPage />}
          {activePage === "documents" && (
            <TrialFlowPlaceholderPage
              title="Documents"
              description="Manage clinical trial documents, protocols, informed consent forms, and regulatory submissions."
              icon={FileText}
            />
          )}
          {activePage === "reports" && (
            <TrialFlowPlaceholderPage
              title="Reports"
              description="Generate and view enrollment reports, safety summaries, site performance metrics, and compliance reports."
              icon={BarChart3}
            />
          )}
          {activePage === "settings" && (
            <TrialFlowPlaceholderPage
              title="Settings"
              description="Configure user roles, notification preferences, data export settings, and integration options."
              icon={Settings}
            />
          )}
        </main>
      </div>
    </div>
  )
}
