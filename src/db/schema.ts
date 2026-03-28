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

export const projectStatuses = [
  "planned",
  "active",
  "paused",
  "completed",
  "cancelled",
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
    nextIssueNumber: integer("next_issue_number").notNull().default(0),
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

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    status: text("status", { enum: projectStatuses }).notNull().default("planned"),
    leadUserId: text("lead_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("projects_workspace_id_idx").on(table.workspaceId),
    leadUserIdIdx: index("projects_lead_user_id_idx").on(table.leadUserId),
    workspaceSlugUnique: uniqueIndex("projects_workspace_slug_uq").on(
      table.workspaceId,
      table.slug
    ),
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
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
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
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    completedAt: text("completed_at"),
    cancelledAt: text("cancelled_at"),
  },
  (table) => ({
    workspaceIdIdx: index("issues_workspace_id_idx").on(table.workspaceId),
    teamIdIdx: index("issues_team_id_idx").on(table.teamId),
    projectIdIdx: index("issues_project_id_idx").on(table.projectId),
    cycleIdIdx: index("issues_cycle_id_idx").on(table.cycleId),
    assigneeUserIdIdx: index("issues_assignee_user_id_idx").on(table.assigneeUserId),
    creatorUserIdIdx: index("issues_creator_user_id_idx").on(table.creatorUserId),
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

export const issueLabels = sqliteTable(
  "issue_labels",
  {
    issueId: text("issue_id")
      .notNull()
      .references(() => issues.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.issueId, table.labelId],
      name: "issue_labels_pk",
    }),
    labelIdIdx: index("issue_labels_label_id_idx").on(table.labelId),
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
    type: text("type").notNull(),
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

export type User = typeof users.$inferSelect
export type Workspace = typeof workspaces.$inferSelect
export type WorkspaceMembership = typeof workspaceMemberships.$inferSelect
export type Team = typeof teams.$inferSelect
export type TeamMembership = typeof teamMemberships.$inferSelect
export type Project = typeof projects.$inferSelect
export type Cycle = typeof cycles.$inferSelect
export type Label = typeof labels.$inferSelect
export type Issue = typeof issues.$inferSelect
export type IssueComment = typeof issueComments.$inferSelect
export type IssueActivity = typeof issueActivity.$inferSelect
