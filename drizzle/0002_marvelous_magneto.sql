CREATE TABLE `issue_favorites` (
	`user_id` text NOT NULL,
	`issue_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `issue_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`issue_id`) REFERENCES `issues`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `issue_favorites_issue_id_idx` ON `issue_favorites` (`issue_id`);--> statement-breakpoint
DROP INDEX "cycles_team_id_idx";--> statement-breakpoint
DROP INDEX "cycles_team_number_uq";--> statement-breakpoint
DROP INDEX "issue_activity_issue_id_idx";--> statement-breakpoint
DROP INDEX "issue_activity_actor_user_id_idx";--> statement-breakpoint
DROP INDEX "issue_activity_type_idx";--> statement-breakpoint
DROP INDEX "issue_comments_issue_id_idx";--> statement-breakpoint
DROP INDEX "issue_comments_author_user_id_idx";--> statement-breakpoint
DROP INDEX "issue_favorites_issue_id_idx";--> statement-breakpoint
DROP INDEX "issue_labels_label_id_idx";--> statement-breakpoint
DROP INDEX "issues_workspace_id_idx";--> statement-breakpoint
DROP INDEX "issues_team_id_idx";--> statement-breakpoint
DROP INDEX "issues_project_id_idx";--> statement-breakpoint
DROP INDEX "issues_cycle_id_idx";--> statement-breakpoint
DROP INDEX "issues_assignee_user_id_idx";--> statement-breakpoint
DROP INDEX "issues_creator_user_id_idx";--> statement-breakpoint
DROP INDEX "issues_workspace_identifier_uq";--> statement-breakpoint
DROP INDEX "issues_team_sequence_uq";--> statement-breakpoint
DROP INDEX "labels_workspace_id_idx";--> statement-breakpoint
DROP INDEX "labels_workspace_name_uq";--> statement-breakpoint
DROP INDEX "notes_workspace_id_idx";--> statement-breakpoint
DROP INDEX "notes_author_user_id_idx";--> statement-breakpoint
DROP INDEX "projects_workspace_id_idx";--> statement-breakpoint
DROP INDEX "projects_lead_user_id_idx";--> statement-breakpoint
DROP INDEX "projects_workspace_slug_uq";--> statement-breakpoint
DROP INDEX "team_memberships_user_id_idx";--> statement-breakpoint
DROP INDEX "teams_workspace_id_idx";--> statement-breakpoint
DROP INDEX "teams_workspace_slug_uq";--> statement-breakpoint
DROP INDEX "teams_workspace_identifier_uq";--> statement-breakpoint
DROP INDEX "users_clerk_user_id_uq";--> statement-breakpoint
DROP INDEX "users_email_uq";--> statement-breakpoint
DROP INDEX "workspace_memberships_user_id_idx";--> statement-breakpoint
DROP INDEX "workspaces_clerk_org_id_uq";--> statement-breakpoint
DROP INDEX "workspaces_slug_uq";--> statement-breakpoint
ALTER TABLE `teams` ALTER COLUMN "next_issue_number" TO "next_issue_number" integer NOT NULL DEFAULT 1;--> statement-breakpoint
CREATE INDEX `cycles_team_id_idx` ON `cycles` (`team_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `cycles_team_number_uq` ON `cycles` (`team_id`,`number`);--> statement-breakpoint
CREATE INDEX `issue_activity_issue_id_idx` ON `issue_activity` (`issue_id`);--> statement-breakpoint
CREATE INDEX `issue_activity_actor_user_id_idx` ON `issue_activity` (`actor_user_id`);--> statement-breakpoint
CREATE INDEX `issue_activity_type_idx` ON `issue_activity` (`type`);--> statement-breakpoint
CREATE INDEX `issue_comments_issue_id_idx` ON `issue_comments` (`issue_id`);--> statement-breakpoint
CREATE INDEX `issue_comments_author_user_id_idx` ON `issue_comments` (`author_user_id`);--> statement-breakpoint
CREATE INDEX `issue_labels_label_id_idx` ON `issue_labels` (`label_id`);--> statement-breakpoint
CREATE INDEX `issues_workspace_id_idx` ON `issues` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `issues_team_id_idx` ON `issues` (`team_id`);--> statement-breakpoint
CREATE INDEX `issues_project_id_idx` ON `issues` (`project_id`);--> statement-breakpoint
CREATE INDEX `issues_cycle_id_idx` ON `issues` (`cycle_id`);--> statement-breakpoint
CREATE INDEX `issues_assignee_user_id_idx` ON `issues` (`assignee_user_id`);--> statement-breakpoint
CREATE INDEX `issues_creator_user_id_idx` ON `issues` (`creator_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `issues_workspace_identifier_uq` ON `issues` (`workspace_id`,`identifier`);--> statement-breakpoint
CREATE UNIQUE INDEX `issues_team_sequence_uq` ON `issues` (`team_id`,`sequence_number`);--> statement-breakpoint
CREATE INDEX `labels_workspace_id_idx` ON `labels` (`workspace_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `labels_workspace_name_uq` ON `labels` (`workspace_id`,`name`);--> statement-breakpoint
CREATE INDEX `notes_workspace_id_idx` ON `notes` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `notes_author_user_id_idx` ON `notes` (`author_user_id`);--> statement-breakpoint
CREATE INDEX `projects_workspace_id_idx` ON `projects` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `projects_lead_user_id_idx` ON `projects` (`lead_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `projects_workspace_slug_uq` ON `projects` (`workspace_id`,`slug`);--> statement-breakpoint
CREATE INDEX `team_memberships_user_id_idx` ON `team_memberships` (`user_id`);--> statement-breakpoint
CREATE INDEX `teams_workspace_id_idx` ON `teams` (`workspace_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_workspace_slug_uq` ON `teams` (`workspace_id`,`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_workspace_identifier_uq` ON `teams` (`workspace_id`,`identifier`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_clerk_user_id_uq` ON `users` (`clerk_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_uq` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `workspace_memberships_user_id_idx` ON `workspace_memberships` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspaces_clerk_org_id_uq` ON `workspaces` (`clerk_org_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspaces_slug_uq` ON `workspaces` (`slug`);--> statement-breakpoint
ALTER TABLE `issues` ADD `archived_at` text;--> statement-breakpoint
ALTER TABLE `issues` ADD `deleted_at` text;