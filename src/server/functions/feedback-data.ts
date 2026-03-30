import type { Team } from "@/components/tickets/types"
import type {
  CreateFeedbackImportInput,
  FeedbackSuggestionStatus,
} from "./feedback-domain"
import type {
  TicketsDatabase,
  ViewerContext,
} from "./tickets-data"

function nowIso(): string {
  return new Date().toISOString()
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

// ── Types ────────────────────────────────────────────────────────────

export type FeedbackImportRecord = {
  id: string
  kind: "paste" | "txt" | "md" | "csv" | "json"
  sourceName: string
  sourceDescription: string | null
  itemCount: number
  createdAt: string
  updatedAt: string
}

export type FeedbackItemRecord = {
  id: string
  importId: string
  importSourceName: string
  title: string | null
  summary: string | null
  featureArea: string | null
  problemType: string | null
  severity: "low" | "medium" | "high" | null
  requestedCapability: string | null
  suggestedTeam: Team | null
  tags: string[]
  analyzedAt: string | null
  createdAt: string
}

export type FeedbackClusterRecord = {
  id: string
  title: string
  featureArea: string | null
  problemType: string | null
  suggestedTeam: Team | null
  signalCount: number
  confidence: number
  impactScore: number
  lastAnalyzedAt: string
}

export type FeedbackSuggestionRecord = {
  id: string
  clusterId: string
  title: string
  summary: string
  proposedSolution: string
  aiRationale: string | null
  status: FeedbackSuggestionStatus
  suggestedTeam: Team | null
  selectedTeam: Team | null
  confidence: number
  impactScore: number
  evidenceCount: number
  sourceDiversity: number
  priorityScore: number
  issueId: string | null
  updatedAt: string
}

export type FeedbackSuggestionDetail = FeedbackSuggestionRecord & {
  cluster: FeedbackClusterRecord | null
  evidence: Array<{
    id: string
    importSourceName: string
    title: string | null
    summary: string | null
    originalText: string
    createdAt: string
  }>
}

// ── Mock Data ───────────────────────────────────────────────────────

const ENG_TEAM: Team = { id: "team-eng-001", slug: "engineering", name: "Engineering", identifier: "ENG", color: "#6366f1" }
const DES_TEAM: Team = { id: "team-des-001", slug: "design", name: "Design", identifier: "DES", color: "#ec4899" }
const PRD_TEAM: Team = { id: "team-prd-001", slug: "product", name: "Product", identifier: "PRD", color: "#f59e0b" }

const MOCK_IMPORTS: FeedbackImportRecord[] = [
  { id: "fb-import-001", kind: "csv", sourceName: "Customer Support Q1 Export", sourceDescription: "Support tickets from Q1 2026", itemCount: 5, createdAt: daysAgo(14), updatedAt: daysAgo(14) },
  { id: "fb-import-002", kind: "json", sourceName: "NPS Survey March 2026", sourceDescription: "Monthly NPS survey responses", itemCount: 3, createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  { id: "fb-import-003", kind: "txt", sourceName: "Sales Call Notes", sourceDescription: null, itemCount: 2, createdAt: daysAgo(3), updatedAt: daysAgo(3) },
]

const MOCK_ITEMS: FeedbackItemRecord[] = [
  {
    id: "fb-item-001", importId: "fb-import-001", importSourceName: "Customer Support Q1 Export",
    title: "Search is painfully slow", summary: "Users report search taking 5-10 seconds for simple queries in large workspaces.",
    featureArea: "search", problemType: "performance", severity: "high",
    requestedCapability: "Search should return results in under 1 second.",
    suggestedTeam: ENG_TEAM, tags: ["search", "performance", "latency"],
    analyzedAt: daysAgo(13), createdAt: daysAgo(14),
  },
  {
    id: "fb-item-002", importId: "fb-import-001", importSourceName: "Customer Support Q1 Export",
    title: "Can't find keyboard shortcuts", summary: "Multiple users asking how to use keyboard shortcuts — discoverability issue.",
    featureArea: "editor", problemType: "ux", severity: "medium",
    requestedCapability: "Add a keyboard shortcut cheat sheet or hints in the UI.",
    suggestedTeam: DES_TEAM, tags: ["keyboard", "ux", "discoverability"],
    analyzedAt: daysAgo(13), createdAt: daysAgo(14),
  },
  {
    id: "fb-item-003", importId: "fb-import-001", importSourceName: "Customer Support Q1 Export",
    title: "Dashboard charts don't update in real-time", summary: "Charts on the dashboard require a page refresh to show updated data.",
    featureArea: "dashboard", problemType: "bug", severity: "medium",
    requestedCapability: "Dashboard should auto-refresh or use real-time data.",
    suggestedTeam: ENG_TEAM, tags: ["dashboard", "real-time", "bug"],
    analyzedAt: daysAgo(13), createdAt: daysAgo(14),
  },
  {
    id: "fb-item-004", importId: "fb-import-001", importSourceName: "Customer Support Q1 Export",
    title: "Need API access for integrations", summary: "Enterprise customers requesting a public API for custom integrations.",
    featureArea: "tickets", problemType: "feature-gap", severity: "high",
    requestedCapability: "Provide a REST or GraphQL API for third-party integrations.",
    suggestedTeam: ENG_TEAM, tags: ["api", "integration", "enterprise"],
    analyzedAt: daysAgo(13), createdAt: daysAgo(14),
  },
  {
    id: "fb-item-005", importId: "fb-import-001", importSourceName: "Customer Support Q1 Export",
    title: "Confusing permission model", summary: "Admins find it difficult to set up team-level permissions correctly.",
    featureArea: "workspace-management", problemType: "ux", severity: "medium",
    requestedCapability: "Simplify the permission model with clear role-based access controls.",
    suggestedTeam: PRD_TEAM, tags: ["permissions", "admin", "ux"],
    analyzedAt: daysAgo(13), createdAt: daysAgo(14),
  },
  {
    id: "fb-item-006", importId: "fb-import-002", importSourceName: "NPS Survey March 2026",
    title: "Love the speed of issue creation", summary: "Positive feedback about the quick issue creation flow.",
    featureArea: "tickets", problemType: "feature-gap", severity: "low",
    requestedCapability: null, suggestedTeam: null, tags: ["positive", "issue-creation"],
    analyzedAt: daysAgo(6), createdAt: daysAgo(7),
  },
  {
    id: "fb-item-007", importId: "fb-import-002", importSourceName: "NPS Survey March 2026",
    title: "Search results are not relevant", summary: "Search returns too many irrelevant results, especially when querying by title.",
    featureArea: "search", problemType: "ux", severity: "high",
    requestedCapability: "Improve search ranking and add filters for result relevance.",
    suggestedTeam: ENG_TEAM, tags: ["search", "relevance", "ranking"],
    analyzedAt: daysAgo(6), createdAt: daysAgo(7),
  },
  {
    id: "fb-item-008", importId: "fb-import-002", importSourceName: "NPS Survey March 2026",
    title: "Wish there was a mobile app", summary: "Multiple respondents requesting a native mobile experience.",
    featureArea: "general", problemType: "feature-gap", severity: "medium",
    requestedCapability: "Build a native mobile app for iOS and Android.",
    suggestedTeam: PRD_TEAM, tags: ["mobile", "native", "feature-request"],
    analyzedAt: daysAgo(6), createdAt: daysAgo(7),
  },
]

const MOCK_CLUSTERS: FeedbackClusterRecord[] = [
  {
    id: "fb-cluster-001", title: "Search Performance and Relevance",
    featureArea: "search", problemType: "performance",
    suggestedTeam: ENG_TEAM, signalCount: 3, confidence: 82, impactScore: 74,
    lastAnalyzedAt: daysAgo(5),
  },
  {
    id: "fb-cluster-002", title: "UX Discoverability Issues",
    featureArea: "editor", problemType: "ux",
    suggestedTeam: DES_TEAM, signalCount: 2, confidence: 65, impactScore: 42,
    lastAnalyzedAt: daysAgo(5),
  },
  {
    id: "fb-cluster-003", title: "Enterprise Integration Needs",
    featureArea: "tickets", problemType: "feature-gap",
    suggestedTeam: ENG_TEAM, signalCount: 2, confidence: 70, impactScore: 58,
    lastAnalyzedAt: daysAgo(5),
  },
]

const MOCK_SUGGESTIONS: FeedbackSuggestionRecord[] = [
  {
    id: "fb-sug-001", clusterId: "fb-cluster-001",
    title: "Overhaul search indexing and ranking",
    summary: "Users consistently report slow and irrelevant search results. Improving the search infrastructure would address one of the top pain points.",
    proposedSolution: "Implement a dedicated search index (e.g. Meilisearch) with relevance tuning, and add result filtering by status, team, and date.",
    aiRationale: "Search complaints appeared in 3 out of 8 feedback items across two separate sources, with 2 rated high severity.",
    status: "new", suggestedTeam: ENG_TEAM, selectedTeam: null,
    confidence: 82, impactScore: 74, evidenceCount: 3, sourceDiversity: 2, priorityScore: 156,
    issueId: null, updatedAt: daysAgo(5),
  },
  {
    id: "fb-sug-002", clusterId: "fb-cluster-002",
    title: "Improve keyboard shortcut discoverability",
    summary: "Users struggle to find and learn keyboard shortcuts, reducing power-user adoption.",
    proposedSolution: "Add a keyboard shortcut overlay (? key), contextual hints in tooltips, and an onboarding tip for new users.",
    aiRationale: "Two separate feedback items mentioned difficulty discovering shortcuts, suggesting this is a recurring friction point.",
    status: "reviewing", suggestedTeam: DES_TEAM, selectedTeam: DES_TEAM,
    confidence: 65, impactScore: 42, evidenceCount: 2, sourceDiversity: 1, priorityScore: 89,
    issueId: null, updatedAt: daysAgo(4),
  },
  {
    id: "fb-sug-003", clusterId: "fb-cluster-003",
    title: "Build a public REST API for integrations",
    summary: "Enterprise customers need API access to integrate with their existing toolchains.",
    proposedSolution: "Design and ship a documented REST API covering core resources (issues, teams, cycles) with OAuth2 authentication.",
    aiRationale: "API access was explicitly requested by enterprise accounts, and integration needs appeared in support and sales feedback alike.",
    status: "accepted", suggestedTeam: ENG_TEAM, selectedTeam: ENG_TEAM,
    confidence: 70, impactScore: 58, evidenceCount: 2, sourceDiversity: 2, priorityScore: 121,
    issueId: null, updatedAt: daysAgo(3),
  },
  {
    id: "fb-sug-004", clusterId: "fb-cluster-001",
    title: "Add real-time dashboard updates",
    summary: "Dashboard data goes stale requiring manual refreshes, creating a poor experience for users monitoring project progress.",
    proposedSolution: "Implement WebSocket-based data subscriptions for dashboard charts and counters.",
    aiRationale: "Dashboard staleness was mentioned in support feedback and is closely related to the broader real-time infrastructure gap.",
    status: "new", suggestedTeam: ENG_TEAM, selectedTeam: null,
    confidence: 60, impactScore: 36, evidenceCount: 1, sourceDiversity: 1, priorityScore: 72,
    issueId: null, updatedAt: daysAgo(5),
  },
  {
    id: "fb-sug-005", clusterId: "fb-cluster-002",
    title: "Simplify workspace permission model",
    summary: "Admins find team-level permissions confusing, leading to misconfigured access controls.",
    proposedSolution: "Redesign the permissions UI with a role matrix view and add guided setup for common configurations.",
    aiRationale: "Permission confusion was flagged in support tickets, indicating an onboarding and UX gap.",
    status: "new", suggestedTeam: PRD_TEAM, selectedTeam: null,
    confidence: 55, impactScore: 32, evidenceCount: 1, sourceDiversity: 1, priorityScore: 64,
    issueId: null, updatedAt: daysAgo(5),
  },
]

// ── Exported Functions ──────────────────────────────────────────────

export async function createFeedbackImportForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _input: CreateFeedbackImportInput
): Promise<{ id: string; itemCount: number }> {
  return { id: `fb-import-${crypto.randomUUID().slice(0, 8)}`, itemCount: 0 }
}

export async function listFeedbackImportsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<FeedbackImportRecord[]> {
  return MOCK_IMPORTS
}

export async function listFeedbackItemsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<FeedbackItemRecord[]> {
  return MOCK_ITEMS
}

export async function listFeedbackClustersForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<FeedbackClusterRecord[]> {
  return MOCK_CLUSTERS
}

export async function listFeedbackSuggestionsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _input?: { limit?: number }
): Promise<FeedbackSuggestionRecord[]> {
  return MOCK_SUGGESTIONS
}

export async function getFeedbackSuggestionForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  suggestionId: string
): Promise<FeedbackSuggestionDetail | null> {
  const suggestion = MOCK_SUGGESTIONS.find((s) => s.id === suggestionId)
  if (!suggestion) return null

  const cluster = MOCK_CLUSTERS.find((c) => c.id === suggestion.clusterId) ?? null
  const evidence = MOCK_ITEMS
    .filter((item) => {
      if (cluster?.featureArea) return item.featureArea === cluster.featureArea
      return false
    })
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      importSourceName: item.importSourceName,
      title: item.title,
      summary: item.summary,
      originalText: item.summary ?? "Original feedback text",
      createdAt: item.createdAt,
    }))

  return { ...suggestion, cluster, evidence }
}

export async function updateFeedbackSuggestionForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _suggestionId: string,
  _input: {
    status?: FeedbackSuggestionStatus
    selectedTeamId?: string | null
  }
): Promise<{ id: string; updatedAt: string }> {
  return { id: _suggestionId, updatedAt: nowIso() }
}

type AnalysisRunInput = {
  workspaceId?: string
  trigger: "manual" | "cron"
  force?: boolean
}

type WorkspaceAnalysisResult = {
  workspaceId: string
  itemsProcessed: number
  suggestionsProduced: number
  skipped: boolean
}

export async function runFeedbackAnalysis(
  _db: TicketsDatabase,
  _input: AnalysisRunInput
): Promise<{ processedWorkspaceCount: number; results: WorkspaceAnalysisResult[] }> {
  return {
    processedWorkspaceCount: 1,
    results: [{ workspaceId: "demo-workspace-001", itemsProcessed: 8, suggestionsProduced: 5, skipped: false }],
  }
}

export async function createIssueFromFeedbackSuggestionForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _input: {
    suggestionId: string
    teamId?: string
    title?: string
    description?: string
  }
): Promise<{ id: string; identifier: string }> {
  return { id: `issue-${crypto.randomUUID().slice(0, 8)}`, identifier: "ENG-999" }
}

export async function autoCreateTicketsFromSuggestions(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _input?: { confidenceThreshold?: number; cycleId?: string }
): Promise<{ created: number; skipped: number }> {
  return { created: 2, skipped: 1 }
}
