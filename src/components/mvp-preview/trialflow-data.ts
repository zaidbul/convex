import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  FlaskConical,
  Users,
  MapPin,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react"

export type TrialFlowPage =
  | "dashboard"
  | "trials"
  | "patients"
  | "sites"
  | "documents"
  | "reports"
  | "settings"

export const TRIALFLOW_STATS = {
  activeTrials: 12,
  totalPatients: 1547,
  activeSites: 48,
  complianceRate: 96.4,
}

export interface NavItem {
  id: TrialFlowPage
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "trials", label: "Trials", icon: FlaskConical },
  { id: "patients", label: "Patients", icon: Users },
  { id: "sites", label: "Sites", icon: MapPin },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export const PAGE_TITLES: Record<TrialFlowPage, string> = {
  dashboard: "Dashboard",
  trials: "Clinical Trials",
  patients: "Patient Registry",
  sites: "Research Sites",
  documents: "Documents",
  reports: "Reports",
  settings: "Settings",
}

export interface MockTrial {
  protocol: string
  name: string
  phase: string
  status: "Active" | "Recruiting" | "Completed" | "Suspended"
  sponsor: string
  sites: number
  enrollment: { current: number; target: number }
}

export const MOCK_TRIALS: MockTrial[] = [
  {
    protocol: "ONCO-0824-81",
    name: "Pembrolizumab + Chemo in NSCLC",
    phase: "Phase III",
    status: "Active",
    sponsor: "Meridian Pharma",
    sites: 24,
    enrollment: { current: 847, target: 1200 },
  },
  {
    protocol: "CARDIO-2024-15",
    name: "Novel Anticoagulant vs Warfarin",
    phase: "Phase II",
    status: "Recruiting",
    sponsor: "CardioVita Inc.",
    sites: 18,
    enrollment: { current: 312, target: 600 },
  },
  {
    protocol: "NEURO-2023-42",
    name: "Anti-Amyloid mAb in Early AD",
    phase: "Phase III",
    status: "Active",
    sponsor: "NeuraCure Labs",
    sites: 32,
    enrollment: { current: 1024, target: 1500 },
  },
  {
    protocol: "DERM-2024-07",
    name: "JAK Inhibitor for Atopic Dermatitis",
    phase: "Phase II",
    status: "Recruiting",
    sponsor: "DermaTech Bio",
    sites: 12,
    enrollment: { current: 156, target: 400 },
  },
  {
    protocol: "ENDO-2023-33",
    name: "GLP-1 Agonist in Type 2 Diabetes",
    phase: "Phase III",
    status: "Completed",
    sponsor: "EndoMed Global",
    sites: 28,
    enrollment: { current: 920, target: 900 },
  },
]

export interface MockPatient {
  patientId: string
  name: string
  trial: string
  site: string
  status: "Active" | "Screening" | "Completed" | "Withdrawn"
  lastVisit: string
}

export const MOCK_PATIENTS: MockPatient[] = [
  {
    patientId: "PT-00412",
    name: "Sarah Mitchell",
    trial: "ONCO-0824-81",
    site: "Mayo Clinic",
    status: "Active",
    lastVisit: "2024-03-15",
  },
  {
    patientId: "PT-00587",
    name: "James Rodriguez",
    trial: "CARDIO-2024-15",
    site: "Cleveland Clinic",
    status: "Screening",
    lastVisit: "2024-03-12",
  },
  {
    patientId: "PT-00234",
    name: "Emily Chen",
    trial: "NEURO-2023-42",
    site: "Johns Hopkins",
    status: "Active",
    lastVisit: "2024-03-18",
  },
  {
    patientId: "PT-00891",
    name: "Michael Thompson",
    trial: "DERM-2024-07",
    site: "Stanford Medical",
    status: "Active",
    lastVisit: "2024-03-10",
  },
  {
    patientId: "PT-00156",
    name: "Lisa Park",
    trial: "ENDO-2023-33",
    site: "Mass General",
    status: "Completed",
    lastVisit: "2024-02-28",
  },
  {
    patientId: "PT-00723",
    name: "David Wilson",
    trial: "ONCO-0824-81",
    site: "MD Anderson",
    status: "Withdrawn",
    lastVisit: "2024-01-20",
  },
]

export interface MockSite {
  siteId: string
  name: string
  location: string
  principalInvestigator: string
  activeTrials: number
  status: "Active" | "Pending" | "Inactive"
}

export const MOCK_SITES: MockSite[] = [
  {
    siteId: "SITE-001",
    name: "Mayo Clinic",
    location: "Rochester, MN",
    principalInvestigator: "Dr. Amanda Foster",
    activeTrials: 4,
    status: "Active",
  },
  {
    siteId: "SITE-002",
    name: "Cleveland Clinic",
    location: "Cleveland, OH",
    principalInvestigator: "Dr. Robert Chang",
    activeTrials: 3,
    status: "Active",
  },
  {
    siteId: "SITE-003",
    name: "Johns Hopkins Hospital",
    location: "Baltimore, MD",
    principalInvestigator: "Dr. Maria Santos",
    activeTrials: 5,
    status: "Active",
  },
  {
    siteId: "SITE-004",
    name: "Stanford Medical Center",
    location: "Palo Alto, CA",
    principalInvestigator: "Dr. Kevin Patel",
    activeTrials: 2,
    status: "Pending",
  },
  {
    siteId: "SITE-005",
    name: "Mass General Hospital",
    location: "Boston, MA",
    principalInvestigator: "Dr. Jennifer Liu",
    activeTrials: 0,
    status: "Inactive",
  },
]

export interface MockActivity {
  id: string
  message: string
  time: string
  type: "patient" | "protocol" | "alert" | "visit" | "site"
}

export const MOCK_RECENT_ACTIVITY: MockActivity[] = [
  {
    id: "1",
    message: "New patient enrolled — Patient #0412 enrolled in ONCO-0824-81",
    time: "10 min ago",
    type: "patient",
  },
  {
    id: "2",
    message: "Protocol amendment approved — CARDIO-2024-15 v2.1 approved by IRB",
    time: "1 hr ago",
    type: "protocol",
  },
  {
    id: "3",
    message: "Adverse event reported — Grade 2 AE in NEURO-2023-42, Site 003",
    time: "3 hrs ago",
    type: "alert",
  },
  {
    id: "4",
    message: "Monitoring visit completed — Site 004 ONCO-0824-01 routine visit",
    time: "5 hrs ago",
    type: "visit",
  },
  {
    id: "5",
    message: "New site activated — Riverside Hospital added to CARDIO-2024-15",
    time: "1 day ago",
    type: "site",
  },
]
