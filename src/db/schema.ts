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
