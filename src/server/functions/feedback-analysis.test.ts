import { describe, expect, test } from "vitest"
import {
  clusterFeedbackItems,
  computePriorityScore,
  computeImpactScore,
} from "./feedback-analysis"

describe("feedback-analysis helpers", () => {
  test("clusters related items deterministically using team/feature/problem and overlap", () => {
    const items = [
      {
        id: "a",
        importId: "import-1",
        title: "Search broken",
        originalText: "Search is broken for tickets",
        normalizedText: "Search is broken for tickets",
        summary: "Search is broken",
        featureArea: "search",
        problemType: "bug",
        severity: "high" as const,
        requestedCapability: "Fix search relevance",
        suggestedTeamId: "team-1",
        tags: ["search", "bug", "relevance"],
        dedupeKeys: ["search", "bug", "relevance"],
        createdAt: "2026-03-29T00:00:00.000Z",
      },
      {
        id: "b",
        importId: "import-2",
        title: "Search relevance",
        originalText: "Search returns random tickets",
        normalizedText: "Search returns random tickets",
        summary: "Search returns random tickets",
        featureArea: "search",
        problemType: "bug",
        severity: "medium" as const,
        requestedCapability: "Fix search relevance",
        suggestedTeamId: "team-1",
        tags: ["search", "bug", "relevance"],
        dedupeKeys: ["search", "bug", "relevance"],
        createdAt: "2026-03-28T00:00:00.000Z",
      },
      {
        id: "c",
        importId: "import-3",
        title: "Dashboard insights",
        originalText: "Dashboard should summarize complaints",
        normalizedText: "Dashboard should summarize complaints",
        summary: "Need dashboard insights",
        featureArea: "dashboard",
        problemType: "feature-gap",
        severity: "low" as const,
        requestedCapability: "Add summary dashboard",
        suggestedTeamId: "team-1",
        tags: ["dashboard", "feature-gap"],
        dedupeKeys: ["dashboard", "summary"],
        createdAt: "2026-03-27T00:00:00.000Z",
      },
    ]

    const clusters = clusterFeedbackItems(items)

    expect(clusters).toHaveLength(2)
    expect(clusters[0]?.items.map((item) => item.id)).toEqual(["c"])
    expect(clusters[1]?.items.map((item) => item.id)).toEqual(["a", "b"])
  })

  test("computes stable impact and priority scores", () => {
    const impactScore = computeImpactScore({
      clusterKey: "team-1|search|bug|search",
      suggestedTeamId: "team-1",
      featureArea: "search",
      problemType: "bug",
      items: [
        {
          id: "a",
          importId: "import-1",
          title: "Search broken",
          originalText: "Search is broken",
          normalizedText: "Search is broken",
          summary: "Search is broken",
          featureArea: "search",
          problemType: "bug",
          severity: "high",
          requestedCapability: "Fix search relevance",
          suggestedTeamId: "team-1",
          tags: ["search", "bug"],
          dedupeKeys: ["search", "bug"],
          createdAt: new Date().toISOString(),
        },
      ],
    })

    const priorityScore = computePriorityScore({
      impactScore,
      confidence: 82,
      evidenceCount: 4,
      sourceDiversity: 2,
      lastTouchedAt: new Date().toISOString(),
    })

    expect(impactScore).toBeGreaterThan(0)
    expect(priorityScore).toBeGreaterThan(impactScore)
  })
})
