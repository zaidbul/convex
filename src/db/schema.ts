import { sql } from "drizzle-orm"
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"

export const workspaceMembershipRoles = [
  "owner",
  "admin",
  "member",
  "guest",
] as const

export const cycleStatuses = ["active", "upcoming", "completed"] as const

export const issueStatuses = [
  "backlog",
  "todo",
  "in-progress",
  "in-review",
  "done",
  "cancelled",
] as const

export const issuePriorities = [
  "urgent",
  "high",
  "medium",
  "low",
  "none",
] as const

export const issueActivityTypes = [
  "created",
  "status_change",
  "priority_change",
  "assignee_change",
  "cycle_change",
  "label_change",
  "description_change",
  "comment",
] as const

export const notificationTypes = [
  "issue_assigned",
  "issue_status_changed",
  "issue_commented",
  "issue_mentioned",
  "cycle_started",
  "cycle_completed",
] as const

export const notificationEntityTypes = ["issue", "cycle"] as const

export const feedbackImportKinds = ["paste", "txt", "md", "csv", "json"] as const
export const feedbackItemSeverities = ["low", "medium", "high"] as const
export const feedbackSuggestionStatuses = [
  "new",
  "reviewing",
  "accepted",
  "issue_created",
  "dismissed",
] as const
export const feedbackAnalysisRunStatuses = [
  "queued",
  "running",
  "completed",
  "failed",
] as const

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    avatarUrl: text("avatar_url"),
    initials: text("initials").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    clerkUserIdUnique: uniqueIndex("users_clerk_user_id_uq").on(table.clerkUserId),
    emailUnique: uniqueIndex("users_email_uq").on(table.email),
  })
)

export const workspaces = sqliteTable(
  "workspaces",
  {
    id: text("id").primaryKey(),
    clerkOrgId: text("clerk_org_id").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    clerkOrgIdUnique: uniqueIndex("workspaces_clerk_org_id_uq").on(table.clerkOrgId),
    slugUnique: uniqueIndex("workspaces_slug_uq").on(table.slug),
  })
)

export const workspaceMemberships = sqliteTable(
  "workspace_memberships",
  {
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: workspaceMembershipRoles }).notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.workspaceId, table.userId],
      name: "workspace_memberships_pk",
    }),
    userIdIdx: index("workspace_memberships_user_id_idx").on(table.userId),
  })
)

export const teams = sqliteTable(
  "teams",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    identifier: text("identifier").notNull(),
    color: text("color").notNull(),
    nextIssueNumber: integer("next_issue_number").notNull().default(1),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("teams_workspace_id_idx").on(table.workspaceId),
    workspaceSlugUnique: uniqueIndex("teams_workspace_slug_uq").on(
      table.workspaceId,
      table.slug
    ),
    workspaceIdentifierUnique: uniqueIndex("teams_workspace_identifier_uq").on(
      table.workspaceId,
      table.identifier
    ),
  })
)

export const teamMemberships = sqliteTable(
  "team_memberships",
  {
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.teamId, table.userId],
      name: "team_memberships_pk",
    }),
    userIdIdx: index("team_memberships_user_id_idx").on(table.userId),
  })
)

export const cycles = sqliteTable(
  "cycles",
  {
    id: text("id").primaryKey(),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    number: integer("number").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    status: text("status", { enum: cycleStatuses }).notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    teamIdIdx: index("cycles_team_id_idx").on(table.teamId),
    teamNumberUnique: uniqueIndex("cycles_team_number_uq").on(table.teamId, table.number),
  })
)

export const labels = sqliteTable(
  "labels",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("labels_workspace_id_idx").on(table.workspaceId),
    workspaceNameUnique: uniqueIndex("labels_workspace_name_uq").on(
      table.workspaceId,
      table.name
    ),
  })
)

export const issues = sqliteTable(
  "issues",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    cycleId: text("cycle_id").references(() => cycles.id, {
      onDelete: "set null",
    }),
    creatorUserId: text("creator_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    assigneeUserId: text("assignee_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    identifier: text("identifier").notNull(),
    sequenceNumber: integer("sequence_number").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status", { enum: issueStatuses }).notNull(),
    priority: text("priority", { enum: issuePriorities }).notNull(),
    priorityScore: integer("priority_score").notNull().default(0),
    dueDate: text("due_date"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    completedAt: text("completed_at"),
    cancelledAt: text("cancelled_at"),
    archivedAt: text("archived_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    workspaceIdIdx: index("issues_workspace_id_idx").on(table.workspaceId),
    teamIdIdx: index("issues_team_id_idx").on(table.teamId),
    teamVisibleOrderIdx: index("issues_team_visible_order_idx").on(
      table.teamId,
      table.archivedAt,
      table.deletedAt,
      table.priorityScore,
      table.updatedAt,
      table.createdAt
    ),
    teamStatusVisibleOrderIdx: index("issues_team_status_visible_order_idx").on(
      table.teamId,
      table.status,
      table.archivedAt,
      table.deletedAt,
      table.priorityScore,
      table.updatedAt,
      table.createdAt
    ),
    cycleIdIdx: index("issues_cycle_id_idx").on(table.cycleId),
    assigneeUserIdIdx: index("issues_assignee_user_id_idx").on(table.assigneeUserId),
    creatorUserIdIdx: index("issues_creator_user_id_idx").on(table.creatorUserId),
    dueDateIdx: index("issues_due_date_idx").on(table.dueDate),
    workspaceIdentifierUnique: uniqueIndex("issues_workspace_identifier_uq").on(
      table.workspaceId,
      table.identifier
    ),
    teamSequenceUnique: uniqueIndex("issues_team_sequence_uq").on(
      table.teamId,
      table.sequenceNumber
    ),
  })
)

export const savedViews = sqliteTable(
  "saved_views",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    presetFilter: text("preset_filter"),
    advancedFiltersJson: text("advanced_filters_json", { mode: "json" }),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("saved_views_workspace_id_idx").on(table.workspaceId),
    teamIdIdx: index("saved_views_team_id_idx").on(table.teamId),
    ownerUserIdIdx: index("saved_views_owner_user_id_idx").on(table.ownerUserId),
    ownerTeamUpdatedIdx: index("saved_views_owner_team_updated_idx").on(
      table.ownerUserId,
      table.teamId,
      table.updatedAt
    ),
  })
)

export const issueLabels = sqliteTable(
  "issue_labels",
  {
    issueId: text("issue_id")
      .notNull()
      .references(() => issues.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.issueId, table.labelId],
      name: "issue_labels_pk",
    }),
    labelIdIdx: index("issue_labels_label_id_idx").on(table.labelId),
  })
)

export const issueFavorites = sqliteTable(
  "issue_favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    issueId: text("issue_id")
      .notNull()
      .references(() => issues.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.issueId],
      name: "issue_favorites_pk",
    }),
    issueIdIdx: index("issue_favorites_issue_id_idx").on(table.issueId),
  })
)

export const issueComments = sqliteTable(
  "issue_comments",
  {
    id: text("id").primaryKey(),
    issueId: text("issue_id")
      .notNull()
      .references(() => issues.id, { onDelete: "cascade" }),
    authorUserId: text("author_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    body: text("body").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    issueIdIdx: index("issue_comments_issue_id_idx").on(table.issueId),
    authorUserIdIdx: index("issue_comments_author_user_id_idx").on(table.authorUserId),
  })
)

export const issueActivity = sqliteTable(
  "issue_activity",
  {
    id: text("id").primaryKey(),
    issueId: text("issue_id")
      .notNull()
      .references(() => issues.id, { onDelete: "cascade" }),
    actorUserId: text("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    type: text("type", { enum: issueActivityTypes }).notNull(),
    data: text("data", { mode: "json" })
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'`),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    issueIdIdx: index("issue_activity_issue_id_idx").on(table.issueId),
    actorUserIdIdx: index("issue_activity_actor_user_id_idx").on(table.actorUserId),
    typeIdx: index("issue_activity_type_idx").on(table.type),
  })
)

export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    recipientUserId: text("recipient_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    actorUserId: text("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    type: text("type", { enum: notificationTypes }).notNull(),
    title: text("title").notNull(),
    body: text("body"),
    entityType: text("entity_type", { enum: notificationEntityTypes }).notNull(),
    entityId: text("entity_id").notNull(),
    metadata: text("metadata", { mode: "json" })
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'`),
    readAt: text("read_at"),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("notifications_workspace_id_idx").on(table.workspaceId),
    recipientUserIdIdx: index("notifications_recipient_user_id_idx").on(table.recipientUserId),
    actorUserIdIdx: index("notifications_actor_user_id_idx").on(table.actorUserId),
    typeIdx: index("notifications_type_idx").on(table.type),
    createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
    recipientReadCreatedIdx: index("notifications_recipient_read_created_idx").on(
      table.recipientUserId,
      table.readAt,
      table.createdAt
    ),
  })
)

export const notes = sqliteTable(
  "notes",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    authorUserId: text("author_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    title: text("title").notNull().default(""),
    content: text("content"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("notes_workspace_id_idx").on(table.workspaceId),
    authorUserIdIdx: index("notes_author_user_id_idx").on(table.authorUserId),
  })
)

export const feedbackImports = sqliteTable(
  "feedback_imports",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    kind: text("kind", { enum: feedbackImportKinds }).notNull(),
    sourceName: text("source_name").notNull(),
    sourceDescription: text("source_description"),
    rawContent: text("raw_content"),
    rawPayloadJson: text("raw_payload_json", { mode: "json" }),
    itemCount: integer("item_count").notNull().default(0),
    status: text("status").notNull().default("ready"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("feedback_imports_workspace_id_idx").on(table.workspaceId),
    createdByUserIdIdx: index("feedback_imports_created_by_user_id_idx").on(table.createdByUserId),
    workspaceCreatedAtIdx: index("feedback_imports_workspace_created_at_idx").on(
      table.workspaceId,
      table.createdAt
    ),
  })
)

export const feedbackItems = sqliteTable(
  "feedback_items",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    importId: text("import_id")
      .notNull()
      .references(() => feedbackImports.id, { onDelete: "cascade" }),
    sourceIndex: integer("source_index").notNull(),
    title: text("title"),
    originalText: text("original_text").notNull(),
    normalizedText: text("normalized_text").notNull(),
    rawPayloadJson: text("raw_payload_json", { mode: "json" }),
    summary: text("summary"),
    featureArea: text("feature_area"),
    problemType: text("problem_type"),
    severity: text("severity", { enum: feedbackItemSeverities }),
    requestedCapability: text("requested_capability"),
    suggestedTeamId: text("suggested_team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    tagsJson: text("tags_json", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    dedupeKeysJson: text("dedupe_keys_json", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'`),
    analysisVersion: integer("analysis_version").notNull().default(0),
    analyzedAt: text("analyzed_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("feedback_items_workspace_id_idx").on(table.workspaceId),
    importIdIdx: index("feedback_items_import_id_idx").on(table.importId),
    suggestedTeamIdIdx: index("feedback_items_suggested_team_id_idx").on(table.suggestedTeamId),
    workspaceFeatureProblemIdx: index("feedback_items_workspace_feature_problem_idx").on(
      table.workspaceId,
      table.suggestedTeamId,
      table.featureArea,
      table.problemType
    ),
  })
)

export const feedbackClusters = sqliteTable(
  "feedback_clusters",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    clusterKey: text("cluster_key").notNull(),
    suggestedTeamId: text("suggested_team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    featureArea: text("feature_area"),
    problemType: text("problem_type"),
    title: text("title").notNull(),
    reason: text("reason"),
    painSummary: text("pain_summary"),
    proposedDirection: text("proposed_direction"),
    confidence: integer("confidence").notNull().default(0),
    impactScore: integer("impact_score").notNull().default(0),
    signalCount: integer("signal_count").notNull().default(0),
    dedupeKeySetJson: text("dedupe_key_set_json", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'`),
    lastAnalyzedAt: text("last_analyzed_at").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("feedback_clusters_workspace_id_idx").on(table.workspaceId),
    clusterKeyUnique: uniqueIndex("feedback_clusters_workspace_cluster_key_uq").on(
      table.workspaceId,
      table.clusterKey
    ),
    suggestedTeamIdIdx: index("feedback_clusters_suggested_team_id_idx").on(table.suggestedTeamId),
  })
)

export const feedbackClusterItems = sqliteTable(
  "feedback_cluster_items",
  {
    clusterId: text("cluster_id")
      .notNull()
      .references(() => feedbackClusters.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => feedbackItems.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.clusterId, table.itemId],
      name: "feedback_cluster_items_pk",
    }),
    itemIdIdx: index("feedback_cluster_items_item_id_idx").on(table.itemId),
  })
)

export const feedbackSuggestions = sqliteTable(
  "feedback_suggestions",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    clusterId: text("cluster_id")
      .notNull()
      .references(() => feedbackClusters.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    proposedSolution: text("proposed_solution").notNull(),
    aiRationale: text("ai_rationale"),
    status: text("status", { enum: feedbackSuggestionStatuses }).notNull().default("new"),
    suggestedTeamId: text("suggested_team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    selectedTeamId: text("selected_team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    confidence: integer("confidence").notNull().default(0),
    impactScore: integer("impact_score").notNull().default(0),
    evidenceCount: integer("evidence_count").notNull().default(0),
    sourceDiversity: integer("source_diversity").notNull().default(0),
    priorityScore: integer("priority_score").notNull().default(0),
    issueId: text("issue_id").references(() => issues.id, { onDelete: "set null" }),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("feedback_suggestions_workspace_id_idx").on(table.workspaceId),
    clusterIdUnique: uniqueIndex("feedback_suggestions_cluster_id_uq").on(table.clusterId),
    statusIdx: index("feedback_suggestions_status_idx").on(table.status),
    selectedTeamIdIdx: index("feedback_suggestions_selected_team_id_idx").on(table.selectedTeamId),
    priorityIdx: index("feedback_suggestions_priority_idx").on(
      table.workspaceId,
      table.status,
      table.priorityScore,
      table.updatedAt
    ),
  })
)

export const feedbackAnalysisRuns = sqliteTable(
  "feedback_analysis_runs",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    status: text("status", { enum: feedbackAnalysisRunStatuses }).notNull(),
    trigger: text("trigger").notNull(),
    startedAt: text("started_at").notNull(),
    completedAt: text("completed_at"),
    errorMessage: text("error_message"),
    itemsProcessed: integer("items_processed").notNull().default(0),
    suggestionsProduced: integer("suggestions_produced").notNull().default(0),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("feedback_analysis_runs_workspace_id_idx").on(table.workspaceId),
    statusIdx: index("feedback_analysis_runs_status_idx").on(table.status),
    workspaceStartedAtIdx: index("feedback_analysis_runs_workspace_started_at_idx").on(
      table.workspaceId,
      table.startedAt
    ),
  })
)

export type User = typeof users.$inferSelect
export type Workspace = typeof workspaces.$inferSelect
export type WorkspaceMembership = typeof workspaceMemberships.$inferSelect
export type Team = typeof teams.$inferSelect
export type TeamMembership = typeof teamMemberships.$inferSelect
export type Cycle = typeof cycles.$inferSelect
export type Label = typeof labels.$inferSelect
export type Issue = typeof issues.$inferSelect
export type SavedView = typeof savedViews.$inferSelect
export type IssueFavorite = typeof issueFavorites.$inferSelect
export type IssueComment = typeof issueComments.$inferSelect
export type IssueActivity = typeof issueActivity.$inferSelect
export type Notification = typeof notifications.$inferSelect
export type Note = typeof notes.$inferSelect
export type FeedbackImport = typeof feedbackImports.$inferSelect
export type FeedbackItem = typeof feedbackItems.$inferSelect
export type FeedbackCluster = typeof feedbackClusters.$inferSelect
export type FeedbackClusterItem = typeof feedbackClusterItems.$inferSelect
export type FeedbackSuggestion = typeof feedbackSuggestions.$inferSelect
export type FeedbackAnalysisRun = typeof feedbackAnalysisRuns.$inferSelect
