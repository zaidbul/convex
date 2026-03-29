import { and, asc, desc, eq, inArray, isNull, or, sql } from "drizzle-orm"
import * as schema from "@/db/schema"
import type { Team } from "@/components/tickets/types"
import {
  buildFeedbackIssueDescription,
  normalizeFeedbackImport,
  type CreateFeedbackImportInput,
  type FeedbackSuggestionStatus,
} from "./feedback-domain"
import {
  analyzeFeedbackCluster,
  analyzeFeedbackItem,
  clusterFeedbackItems,
  computeImpactScore,
  computePriorityScore,
  type ClusterableFeedbackItem,
} from "./feedback-analysis"
import {
  createIssueForViewer,
  type TicketsDatabase,
  type ViewerContext,
} from "./tickets-data"

function nowIso(): string {
  return new Date().toISOString()
}

function mapTeam(row: typeof schema.teams.$inferSelect | undefined | null): Team | undefined {
  if (!row) return undefined
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    identifier: row.identifier,
    color: row.color,
  }
}

export type FeedbackImportRecord = {
  id: string
  kind: typeof schema.feedbackImportKinds[number]
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
  severity: typeof schema.feedbackItemSeverities[number] | null
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

async function listWorkspaceTeams(db: TicketsDatabase, workspaceId: string) {
  return db.query.teams.findMany({
    where: eq(schema.teams.workspaceId, workspaceId),
    orderBy: asc(schema.teams.name),
  })
}

async function resolveAccessibleTeam(
  db: TicketsDatabase,
  workspaceId: string,
  teamId: string | null | undefined
) {
  if (!teamId) return null
  const team = await db.query.teams.findFirst({
    where: and(eq(schema.teams.workspaceId, workspaceId), eq(schema.teams.id, teamId)),
  })
  return team ?? null
}

export async function createFeedbackImportForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  input: CreateFeedbackImportInput
) {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const timestamp = nowIso()
  const importId = crypto.randomUUID()
  const chunks = normalizeFeedbackImport(input)

  await db.transaction(async (tx) => {
    await tx.insert(schema.feedbackImports).values({
      id: importId,
      workspaceId: context.workspaceId!,
      createdByUserId: context.userId,
      kind: input.kind,
      sourceName: input.sourceName,
      sourceDescription: input.sourceDescription ?? null,
      rawContent: input.rawContent ?? null,
      rawPayloadJson: input.rawPayloadJson ?? null,
      itemCount: chunks.length,
      status: "ready",
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    if (chunks.length > 0) {
      await tx.insert(schema.feedbackItems).values(
        chunks.map((chunk) => ({
          id: crypto.randomUUID(),
          workspaceId: context.workspaceId!,
          importId,
          sourceIndex: chunk.sourceIndex,
          title: chunk.title ?? null,
          originalText: chunk.originalText,
          normalizedText: chunk.normalizedText,
          rawPayloadJson: chunk.rawPayloadJson ?? null,
          createdAt: timestamp,
          updatedAt: timestamp,
        }))
      )
    }
  })

  return { id: importId, itemCount: chunks.length }
}

export async function listFeedbackImportsForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<FeedbackImportRecord[]> {
  if (!context.workspaceId) return []

  const rows = await db.query.feedbackImports.findMany({
    where: eq(schema.feedbackImports.workspaceId, context.workspaceId),
    orderBy: desc(schema.feedbackImports.createdAt),
  })

  return rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    sourceName: row.sourceName,
    sourceDescription: row.sourceDescription ?? null,
    itemCount: row.itemCount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

export async function listFeedbackItemsForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<FeedbackItemRecord[]> {
  if (!context.workspaceId) return []

  const rows = await db
    .select({
      item: schema.feedbackItems,
      importSourceName: schema.feedbackImports.sourceName,
      team: schema.teams,
    })
    .from(schema.feedbackItems)
    .innerJoin(schema.feedbackImports, eq(schema.feedbackItems.importId, schema.feedbackImports.id))
    .leftJoin(schema.teams, eq(schema.feedbackItems.suggestedTeamId, schema.teams.id))
    .where(eq(schema.feedbackItems.workspaceId, context.workspaceId))
    .orderBy(desc(schema.feedbackItems.createdAt), asc(schema.feedbackItems.sourceIndex))

  return rows.map((row) => ({
    id: row.item.id,
    importId: row.item.importId,
    importSourceName: row.importSourceName,
    title: row.item.title ?? null,
    summary: row.item.summary ?? null,
    featureArea: row.item.featureArea ?? null,
    problemType: row.item.problemType ?? null,
    severity: row.item.severity ?? null,
    requestedCapability: row.item.requestedCapability ?? null,
    suggestedTeam: mapTeam(row.team) ?? null,
    tags: (row.item.tagsJson as string[] | null) ?? [],
    analyzedAt: row.item.analyzedAt ?? null,
    createdAt: row.item.createdAt,
  }))
}

export async function listFeedbackClustersForViewer(
  db: TicketsDatabase,
  context: ViewerContext
): Promise<FeedbackClusterRecord[]> {
  if (!context.workspaceId) return []

  const rows = await db
    .select({
      cluster: schema.feedbackClusters,
      team: schema.teams,
    })
    .from(schema.feedbackClusters)
    .leftJoin(schema.teams, eq(schema.feedbackClusters.suggestedTeamId, schema.teams.id))
    .where(eq(schema.feedbackClusters.workspaceId, context.workspaceId))
    .orderBy(desc(schema.feedbackClusters.impactScore), desc(schema.feedbackClusters.updatedAt))

  return rows.map((row) => ({
    id: row.cluster.id,
    title: row.cluster.title,
    featureArea: row.cluster.featureArea ?? null,
    problemType: row.cluster.problemType ?? null,
    suggestedTeam: mapTeam(row.team) ?? null,
    signalCount: row.cluster.signalCount,
    confidence: row.cluster.confidence,
    impactScore: row.cluster.impactScore,
    lastAnalyzedAt: row.cluster.lastAnalyzedAt,
  }))
}

export async function listFeedbackSuggestionsForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  input?: { limit?: number }
): Promise<FeedbackSuggestionRecord[]> {
  if (!context.workspaceId) return []

  const limit = Math.min(Math.max(input?.limit ?? 20, 1), 100)

  const rows = await db.query.feedbackSuggestions.findMany({
    where: eq(schema.feedbackSuggestions.workspaceId, context.workspaceId),
    orderBy: [
      desc(schema.feedbackSuggestions.priorityScore),
      desc(schema.feedbackSuggestions.updatedAt),
    ],
    limit,
  })

  const allTeamIds = uniqueNonNull(
    rows.flatMap((row) => [row.suggestedTeamId, row.selectedTeamId])
  )
  const teams = allTeamIds.length
    ? await db.query.teams.findMany({
        where: inArray(schema.teams.id, allTeamIds),
      })
    : []
  const teamMap = new Map(teams.map((team) => [team.id, team]))

  return rows.map((row) => ({
    id: row.id,
    clusterId: row.clusterId,
    title: row.title,
    summary: row.summary,
    proposedSolution: row.proposedSolution,
    aiRationale: row.aiRationale ?? null,
    status: row.status,
    suggestedTeam: mapTeam(teamMap.get(row.suggestedTeamId ?? "")) ?? null,
    selectedTeam: mapTeam(teamMap.get(row.selectedTeamId ?? "")) ?? null,
    confidence: row.confidence,
    impactScore: row.impactScore,
    evidenceCount: row.evidenceCount,
    sourceDiversity: row.sourceDiversity,
    priorityScore: row.priorityScore,
    issueId: row.issueId ?? null,
    updatedAt: row.updatedAt,
  }))
}

function uniqueNonNull(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))))
}

export async function getFeedbackSuggestionForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  suggestionId: string
): Promise<FeedbackSuggestionDetail | null> {
  if (!context.workspaceId) return null

  const suggestion = await db.query.feedbackSuggestions.findFirst({
    where: and(
      eq(schema.feedbackSuggestions.workspaceId, context.workspaceId),
      eq(schema.feedbackSuggestions.id, suggestionId)
    ),
  })

  if (!suggestion) return null

  const [cluster, suggestedTeam, selectedTeam, evidenceRows] = await Promise.all([
    db.query.feedbackClusters.findFirst({
      where: eq(schema.feedbackClusters.id, suggestion.clusterId),
    }),
    resolveAccessibleTeam(db, context.workspaceId, suggestion.suggestedTeamId),
    resolveAccessibleTeam(db, context.workspaceId, suggestion.selectedTeamId),
    db
      .select({
        item: schema.feedbackItems,
        importSourceName: schema.feedbackImports.sourceName,
      })
      .from(schema.feedbackClusterItems)
      .innerJoin(schema.feedbackItems, eq(schema.feedbackClusterItems.itemId, schema.feedbackItems.id))
      .innerJoin(schema.feedbackImports, eq(schema.feedbackItems.importId, schema.feedbackImports.id))
      .where(eq(schema.feedbackClusterItems.clusterId, suggestion.clusterId))
      .orderBy(desc(schema.feedbackItems.createdAt))
      .limit(12),
  ])

  const clusterTeam = cluster
    ? await resolveAccessibleTeam(db, context.workspaceId, cluster.suggestedTeamId)
    : null

  return {
    id: suggestion.id,
    clusterId: suggestion.clusterId,
    title: suggestion.title,
    summary: suggestion.summary,
    proposedSolution: suggestion.proposedSolution,
    aiRationale: suggestion.aiRationale ?? null,
    status: suggestion.status,
    suggestedTeam: mapTeam(suggestedTeam) ?? null,
    selectedTeam: mapTeam(selectedTeam) ?? null,
    confidence: suggestion.confidence,
    impactScore: suggestion.impactScore,
    evidenceCount: suggestion.evidenceCount,
    sourceDiversity: suggestion.sourceDiversity,
    priorityScore: suggestion.priorityScore,
    issueId: suggestion.issueId ?? null,
    updatedAt: suggestion.updatedAt,
    cluster: cluster
      ? {
          id: cluster.id,
          title: cluster.title,
          featureArea: cluster.featureArea ?? null,
          problemType: cluster.problemType ?? null,
          suggestedTeam: mapTeam(clusterTeam) ?? null,
          signalCount: cluster.signalCount,
          confidence: cluster.confidence,
          impactScore: cluster.impactScore,
          lastAnalyzedAt: cluster.lastAnalyzedAt,
        }
      : null,
    evidence: evidenceRows.map((row) => ({
      id: row.item.id,
      importSourceName: row.importSourceName,
      title: row.item.title ?? null,
      summary: row.item.summary ?? null,
      originalText: row.item.originalText,
      createdAt: row.item.createdAt,
    })),
  }
}

export async function updateFeedbackSuggestionForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  suggestionId: string,
  input: {
    status?: FeedbackSuggestionStatus
    selectedTeamId?: string | null
  }
) {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  if (input.selectedTeamId) {
    const membership = await db
      .select({ teamId: schema.teamMemberships.teamId })
      .from(schema.teamMemberships)
      .innerJoin(schema.teams, eq(schema.teamMemberships.teamId, schema.teams.id))
      .where(
        and(
          eq(schema.teamMemberships.userId, context.userId),
          eq(schema.teamMemberships.teamId, input.selectedTeamId),
          eq(schema.teams.workspaceId, context.workspaceId)
        )
      )
      .limit(1)

    if (membership.length === 0) {
      throw new Error("Selected team is not accessible")
    }
  }

  const [updated] = await db
    .update(schema.feedbackSuggestions)
    .set({
      status: input.status,
      selectedTeamId:
        input.selectedTeamId === undefined ? undefined : input.selectedTeamId,
      updatedAt: nowIso(),
    })
    .where(
      and(
        eq(schema.feedbackSuggestions.workspaceId, context.workspaceId),
        eq(schema.feedbackSuggestions.id, suggestionId)
      )
    )
    .returning()

  if (!updated) {
    throw new Error("Suggestion not found")
  }

  return updated
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

async function candidateWorkspaceIds(db: TicketsDatabase): Promise<string[]> {
  const [workspacesWithItems, latestRuns] = await Promise.all([
    db
      .selectDistinct({ workspaceId: schema.feedbackItems.workspaceId })
      .from(schema.feedbackItems),
    db
      .select({
        workspaceId: schema.feedbackAnalysisRuns.workspaceId,
        completedAt: sql<string | null>`max(${schema.feedbackAnalysisRuns.completedAt})`,
      })
      .from(schema.feedbackAnalysisRuns)
      .where(eq(schema.feedbackAnalysisRuns.status, "completed"))
      .groupBy(schema.feedbackAnalysisRuns.workspaceId),
  ])

  const latestRunByWorkspace = new Map(
    latestRuns.map((row) => [row.workspaceId, row.completedAt])
  )

  const results: string[] = []

  for (const row of workspacesWithItems) {
    const lastCompletedAt = latestRunByWorkspace.get(row.workspaceId)

    if (!lastCompletedAt) {
      results.push(row.workspaceId)
      continue
    }

    const [pendingCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.feedbackItems)
      .where(
        and(
          eq(schema.feedbackItems.workspaceId, row.workspaceId),
          or(
            isNull(schema.feedbackItems.analyzedAt),
            sql`${schema.feedbackItems.updatedAt} > ${lastCompletedAt}`
          )
        )
      )

    const staleMs = Date.now() - new Date(lastCompletedAt).getTime()
    const intervalMs =
      Number.parseInt(process.env.ANALYSIS_INTERVAL_MINUTES ?? "5", 10) * 60 * 1000

    if ((pendingCount?.count ?? 0) > 0 || staleMs >= intervalMs) {
      results.push(row.workspaceId)
    }
  }

  return results
}

async function analyzeWorkspaceFeedback(
  db: TicketsDatabase,
  workspaceId: string,
  input: { trigger: AnalysisRunInput["trigger"]; force?: boolean }
): Promise<WorkspaceAnalysisResult> {
  const timestamp = nowIso()
  const runId = crypto.randomUUID()

  // Atomically insert a "running" row; the partial unique index on
  // (workspace_id) WHERE status='running' prevents duplicates.
  const inserted = await db
    .insert(schema.feedbackAnalysisRuns)
    .values({
      id: runId,
      workspaceId,
      status: "running",
      trigger: input.trigger,
      startedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoNothing()

  if (inserted.rowsAffected === 0) {
    return {
      workspaceId,
      itemsProcessed: 0,
      suggestionsProduced: 0,
      skipped: true,
    }
  }

  try {
    const [teamRows, itemRows] = await Promise.all([
      listWorkspaceTeams(db, workspaceId),
      db.query.feedbackItems.findMany({
        where: eq(schema.feedbackItems.workspaceId, workspaceId),
        orderBy: [desc(schema.feedbackItems.createdAt), asc(schema.feedbackItems.sourceIndex)],
      }),
    ])

    const teamCandidates = teamRows.map((team) => ({
      id: team.id,
      slug: team.slug,
      name: team.name,
    }))
    const teamBySlug = new Map(teamRows.map((team) => [team.slug, team]))

    let itemsProcessed = 0

    for (const item of itemRows) {
      const needsAnalysis =
        input.force ||
        !item.analyzedAt ||
        !item.summary ||
        !item.featureArea ||
        !item.problemType ||
        !item.requestedCapability

      if (!needsAnalysis) continue

      const analysis = await analyzeFeedbackItem(
        {
          id: item.id,
          title: item.title ?? undefined,
          normalizedText: item.normalizedText,
        },
        teamCandidates
      )

      await db
        .update(schema.feedbackItems)
        .set({
          summary: analysis.summary,
          featureArea: analysis.featureArea,
          problemType: analysis.problemType,
          severity: analysis.severity,
          requestedCapability: analysis.requestedCapability,
          suggestedTeamId: teamBySlug.get(analysis.suggestedTeamSlug ?? "")?.id ?? null,
          tagsJson: analysis.tags,
          dedupeKeysJson: analysis.dedupeKeys,
          analyzedAt: timestamp,
          analysisVersion: item.analysisVersion + 1,
          updatedAt: timestamp,
        })
        .where(eq(schema.feedbackItems.id, item.id))

      itemsProcessed += 1
    }

    const analyzedRows = await db.query.feedbackItems.findMany({
      where: eq(schema.feedbackItems.workspaceId, workspaceId),
      orderBy: asc(schema.feedbackItems.id),
    })

    const clusterableItems: ClusterableFeedbackItem[] = analyzedRows
      .filter((item) => item.summary && item.featureArea && item.problemType)
      .map((item) => ({
        id: item.id,
        importId: item.importId,
        title: item.title ?? null,
        originalText: item.originalText,
        normalizedText: item.normalizedText,
        summary: item.summary ?? null,
        featureArea: item.featureArea ?? null,
        problemType: item.problemType ?? null,
        severity: item.severity ?? null,
        requestedCapability: item.requestedCapability ?? null,
        suggestedTeamId: item.suggestedTeamId ?? null,
        tags: (item.tagsJson as string[] | null) ?? [],
        dedupeKeys: (item.dedupeKeysJson as string[] | null) ?? [],
        createdAt: item.createdAt,
      }))

    const clusters = clusterFeedbackItems(clusterableItems)
    const existingClusters = await db.query.feedbackClusters.findMany({
      where: eq(schema.feedbackClusters.workspaceId, workspaceId),
    })
    const existingClusterByKey = new Map(existingClusters.map((cluster) => [cluster.clusterKey, cluster]))
    const activeClusterIds: string[] = []
    const activeSuggestionIds: string[] = []

    for (const cluster of clusters) {
      const clusterAnalysis = await analyzeFeedbackCluster(cluster)
      const impactScore = computeImpactScore(cluster)
      const existingCluster = existingClusterByKey.get(cluster.clusterKey)
      const clusterId = existingCluster?.id ?? crypto.randomUUID()
      activeClusterIds.push(clusterId)

      if (existingCluster) {
        await db
          .update(schema.feedbackClusters)
          .set({
            suggestedTeamId: cluster.suggestedTeamId,
            featureArea: cluster.featureArea,
            problemType: cluster.problemType,
            title: clusterAnalysis.title,
            reason: clusterAnalysis.reason,
            painSummary: clusterAnalysis.painSummary,
            proposedDirection: clusterAnalysis.proposedDirection,
            confidence: clusterAnalysis.confidence,
            impactScore,
            signalCount: cluster.items.length,
            dedupeKeySetJson: Array.from(new Set(cluster.items.flatMap((item) => item.dedupeKeys))),
            lastAnalyzedAt: timestamp,
            updatedAt: timestamp,
          })
          .where(eq(schema.feedbackClusters.id, clusterId))
      } else {
        await db.insert(schema.feedbackClusters).values({
          id: clusterId,
          workspaceId,
          clusterKey: cluster.clusterKey,
          suggestedTeamId: cluster.suggestedTeamId,
          featureArea: cluster.featureArea,
          problemType: cluster.problemType,
          title: clusterAnalysis.title,
          reason: clusterAnalysis.reason,
          painSummary: clusterAnalysis.painSummary,
          proposedDirection: clusterAnalysis.proposedDirection,
          confidence: clusterAnalysis.confidence,
          impactScore,
          signalCount: cluster.items.length,
          dedupeKeySetJson: Array.from(new Set(cluster.items.flatMap((item) => item.dedupeKeys))),
          lastAnalyzedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      }

      await db.delete(schema.feedbackClusterItems).where(eq(schema.feedbackClusterItems.clusterId, clusterId))
      if (cluster.items.length > 0) {
        await db.insert(schema.feedbackClusterItems).values(
          cluster.items.map((item) => ({
            clusterId,
            itemId: item.id,
            createdAt: timestamp,
          }))
        )
      }

      const existingSuggestion = await db.query.feedbackSuggestions.findFirst({
        where: eq(schema.feedbackSuggestions.clusterId, clusterId),
      })
      const sourceDiversity = new Set(cluster.items.map((item) => item.importId)).size
      const priorityScore = computePriorityScore({
        impactScore,
        confidence: clusterAnalysis.confidence,
        evidenceCount: cluster.items.length,
        sourceDiversity,
        lastTouchedAt: cluster.items[0]?.createdAt ?? timestamp,
      })

      if (existingSuggestion) {
        activeSuggestionIds.push(existingSuggestion.id)
        await db
          .update(schema.feedbackSuggestions)
          .set({
            title: clusterAnalysis.title,
            summary: clusterAnalysis.painSummary,
            proposedSolution: clusterAnalysis.proposedDirection,
            aiRationale: clusterAnalysis.reason,
            suggestedTeamId: cluster.suggestedTeamId,
            confidence: clusterAnalysis.confidence,
            impactScore,
            evidenceCount: cluster.items.length,
            sourceDiversity,
            priorityScore,
            updatedAt: timestamp,
          })
          .where(eq(schema.feedbackSuggestions.id, existingSuggestion.id))
      } else {
        const suggestionId = crypto.randomUUID()
        activeSuggestionIds.push(suggestionId)
        await db.insert(schema.feedbackSuggestions).values({
          id: suggestionId,
          workspaceId,
          clusterId,
          title: clusterAnalysis.title,
          summary: clusterAnalysis.painSummary,
          proposedSolution: clusterAnalysis.proposedDirection,
          aiRationale: clusterAnalysis.reason,
          status: "new",
          suggestedTeamId: cluster.suggestedTeamId,
          selectedTeamId: null,
          confidence: clusterAnalysis.confidence,
          impactScore,
          evidenceCount: cluster.items.length,
          sourceDiversity,
          priorityScore,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      }
    }

    if (existingClusters.length > 0) {
      const obsoleteClusterIds = existingClusters
        .filter((cluster) => !activeClusterIds.includes(cluster.id))
        .map((cluster) => cluster.id)

      if (obsoleteClusterIds.length > 0) {
        await db.delete(schema.feedbackSuggestions).where(
          inArray(schema.feedbackSuggestions.clusterId, obsoleteClusterIds)
        )
        await db.delete(schema.feedbackClusters).where(inArray(schema.feedbackClusters.id, obsoleteClusterIds))
      }
    }

    await db
      .update(schema.feedbackAnalysisRuns)
      .set({
        status: "completed",
        completedAt: timestamp,
        itemsProcessed,
        suggestionsProduced: activeSuggestionIds.length,
        updatedAt: timestamp,
      })
      .where(eq(schema.feedbackAnalysisRuns.id, runId))

    return {
      workspaceId,
      itemsProcessed,
      suggestionsProduced: activeSuggestionIds.length,
      skipped: false,
    }
  } catch (error) {
    await db
      .update(schema.feedbackAnalysisRuns)
      .set({
        status: "failed",
        completedAt: nowIso(),
        errorMessage: error instanceof Error ? error.message : "Unknown analysis error",
        updatedAt: nowIso(),
      })
      .where(eq(schema.feedbackAnalysisRuns.id, runId))

    throw error
  }
}

export async function runFeedbackAnalysis(
  db: TicketsDatabase,
  input: AnalysisRunInput
) {
  const workspaceIds = input.workspaceId
    ? [input.workspaceId]
    : await candidateWorkspaceIds(db)

  const results: WorkspaceAnalysisResult[] = []
  for (const workspaceId of workspaceIds) {
    results.push(await analyzeWorkspaceFeedback(db, workspaceId, input))
  }

  return {
    processedWorkspaceCount: results.filter((result) => !result.skipped).length,
    results,
  }
}

export async function createIssueFromFeedbackSuggestionForViewer(
  db: TicketsDatabase,
  context: ViewerContext,
  input: {
    suggestionId: string
    teamId?: string
    title?: string
    description?: string
  }
) {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const suggestion = await getFeedbackSuggestionForViewer(db, context, input.suggestionId)
  if (!suggestion) {
    throw new Error("Suggestion not found")
  }

  const teamId = input.teamId ?? suggestion.selectedTeam?.id ?? suggestion.suggestedTeam?.id
  if (!teamId) {
    throw new Error("Select a team before creating an issue")
  }

  const description =
    input.description?.trim() ||
    buildFeedbackIssueDescription({
      suggestionTitle: input.title?.trim() || suggestion.title,
      summary: suggestion.summary,
      proposedSolution: suggestion.proposedSolution,
      aiRationale: suggestion.aiRationale,
      evidence: suggestion.evidence.map((item) => ({
        title: item.title,
        summary: item.summary,
        originalText: item.originalText,
      })),
    })

  const created = await createIssueForViewer(db, context, {
    teamId,
    title: input.title?.trim() || suggestion.title,
    description,
    status: "backlog",
    priority: "medium",
    dueDate: null,
  })

  await db
    .update(schema.feedbackSuggestions)
    .set({
      status: "issue_created",
      selectedTeamId: teamId,
      issueId: created.id,
      updatedAt: nowIso(),
    })
    .where(eq(schema.feedbackSuggestions.id, input.suggestionId))

  return created
}

export async function autoCreateTicketsFromSuggestions(
  db: TicketsDatabase,
  context: ViewerContext,
  input?: { confidenceThreshold?: number; cycleId?: string }
): Promise<{ created: number; skipped: number }> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const threshold = input?.confidenceThreshold ?? 75

  const suggestions = await listFeedbackSuggestionsForViewer(db, context, { limit: 100 })
  const eligible = suggestions.filter(
    (s) => s.status === "new" && s.confidence >= threshold && (s.suggestedTeam || s.selectedTeam)
  )

  let created = 0
  let skipped = 0

  for (const suggestion of eligible) {
    const teamId = suggestion.selectedTeam?.id ?? suggestion.suggestedTeam?.id
    if (!teamId) {
      skipped++
      continue
    }

    try {
      const issue = await createIssueFromFeedbackSuggestionForViewer(db, context, {
        suggestionId: suggestion.id,
        teamId,
      })

      // Optionally assign to cycle
      if (input?.cycleId && issue.id) {
        await db
          .update(schema.issues)
          .set({ cycleId: input.cycleId, updatedAt: nowIso() })
          .where(eq(schema.issues.id, issue.id))
      }

      created++
    } catch {
      skipped++
    }
  }

  return { created, skipped }
}
