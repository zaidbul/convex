import type { FeedbackItemSeverity } from "./feedback-domain"
import type {
  FeedbackClusterAnalysis,
  FeedbackItemAnalysis,
} from "./feedback-domain"

type TeamCandidate = {
  id: string
  slug: string
  name: string
}

export type AnalyzableFeedbackItem = {
  id: string
  title?: string | null
  normalizedText: string
}

export type ClusterableFeedbackItem = {
  id: string
  importId: string
  title?: string | null
  originalText: string
  normalizedText: string
  summary: string | null
  featureArea: string | null
  problemType: string | null
  severity: FeedbackItemSeverity | null
  requestedCapability: string | null
  suggestedTeamId: string | null
  tags: string[]
  dedupeKeys: string[]
  createdAt: string
}

export type DeterministicFeedbackCluster = {
  clusterKey: string
  suggestedTeamId: string | null
  featureArea: string | null
  problemType: string | null
  items: ClusterableFeedbackItem[]
}

// ── Heuristic helpers (kept for tests and fallback) ─────────────────

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

function overlapScore(a: ClusterableFeedbackItem, b: ClusterableFeedbackItem): number {
  const dedupeOverlap = a.dedupeKeys.filter((key) => b.dedupeKeys.includes(key)).length
  const tagOverlap = a.tags.filter((tag) => b.tags.includes(tag)).length
  return dedupeOverlap * 2 + tagOverlap
}

// ── Exported functions ──────────────────────────────────────────────

export async function analyzeFeedbackItem(
  item: AnalyzableFeedbackItem,
  _teams: TeamCandidate[]
): Promise<FeedbackItemAnalysis> {
  // Return a simple heuristic analysis in demo mode
  const text = item.normalizedText.trim()
  return {
    summary: item.title?.trim() || text.slice(0, 140),
    tags: ["general"],
    featureArea: "general",
    problemType: "feature-gap",
    severity: "medium",
    requestedCapability: text.slice(0, 180),
    suggestedTeamSlug: undefined,
    dedupeKeys: ["general"],
  }
}

export function clusterFeedbackItems(items: ClusterableFeedbackItem[]): DeterministicFeedbackCluster[] {
  const byBaseKey = new Map<string, ClusterableFeedbackItem[]>()

  for (const item of items) {
    const baseKey = [
      item.suggestedTeamId ?? "unassigned",
      slugify(item.featureArea ?? "general"),
      slugify(item.problemType ?? "general"),
    ].join("|")

    const current = byBaseKey.get(baseKey) ?? []
    current.push(item)
    byBaseKey.set(baseKey, current)
  }

  const clusters: DeterministicFeedbackCluster[] = []

  for (const [baseKey, baseItems] of Array.from(byBaseKey.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    const stableItems = [...baseItems].sort((left, right) => left.id.localeCompare(right.id))
    const groupClusters: Array<DeterministicFeedbackCluster> = []

    for (const item of stableItems) {
      const existing = groupClusters.find((cluster) =>
        cluster.items.some((clusterItem) => overlapScore(clusterItem, item) >= 2)
      )

      if (existing) {
        existing.items.push(item)
        continue
      }

      groupClusters.push({
        clusterKey: baseKey,
        suggestedTeamId: item.suggestedTeamId,
        featureArea: item.featureArea,
        problemType: item.problemType,
        items: [item],
      })
    }

    for (const cluster of groupClusters) {
      const seedKey = uniqueStrings(cluster.items.flatMap((item) => item.dedupeKeys)).slice(0, 3)
      const suffix = seedKey.length > 0 ? seedKey.join("-") : cluster.items[0]?.id ?? "cluster"
      clusters.push({
        ...cluster,
        clusterKey: `${baseKey}|${suffix}`,
        items: cluster.items.sort((left, right) => left.id.localeCompare(right.id)),
      })
    }
  }

  return clusters.sort((left, right) => left.clusterKey.localeCompare(right.clusterKey))
}

export async function analyzeFeedbackCluster(
  cluster: DeterministicFeedbackCluster
): Promise<FeedbackClusterAnalysis> {
  const representative = cluster.items[0]
  return {
    title: representative?.featureArea
      ? `${representative.featureArea} ${representative.problemType ?? "issue"}`
      : "Feedback cluster",
    reason: `Grouped by recurring feedback in ${cluster.featureArea ?? "the app"}.`,
    painSummary: cluster.items
      .slice(0, 3)
      .map((item) => item.summary || item.originalText.slice(0, 140))
      .join(" "),
    proposedDirection:
      representative?.requestedCapability ||
      "Investigate the repeated complaints and turn them into a scoped product improvement.",
    confidence: Math.min(95, 45 + cluster.items.length * 8),
  }
}

export function computeImpactScore(cluster: DeterministicFeedbackCluster): number {
  const severityWeight = cluster.items.reduce((total, item) => {
    switch (item.severity) {
      case "high":
        return total + 3
      case "medium":
        return total + 2
      default:
        return total + 1
    }
  }, 0)

  return severityWeight * 10 + cluster.items.length * 8
}

export function computePriorityScore(input: {
  impactScore: number
  confidence: number
  evidenceCount: number
  sourceDiversity: number
  lastTouchedAt: string
}): number {
  const recencyBoost = Math.max(
    0,
    15 - Math.floor((Date.now() - new Date(input.lastTouchedAt).getTime()) / (1000 * 60 * 60 * 24))
  )

  return (
    input.impactScore +
    Math.round(input.confidence * 0.5) +
    input.evidenceCount * 4 +
    input.sourceDiversity * 6 +
    recencyBoost
  )
}
