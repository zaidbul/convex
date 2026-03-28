CREATE TABLE `cycles` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text NOT NULL,
	`name` text NOT NULL,
	`number` integer NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `cycles_team_id_idx` ON `cycles` (`team_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `cycles_team_number_uq` ON `cycles` (`team_id`,`number`);--> statement-breakpoint
CREATE TABLE `issue_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`issue_id` text NOT NULL,
	`actor_user_id` text,
	`type` text NOT NULL,
	`data` text DEFAULT '{}' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`issue_id`) REFERENCES `issues`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `issue_activity_issue_id_idx` ON `issue_activity` (`issue_id`);--> statement-breakpoint
CREATE INDEX `issue_activity_actor_user_id_idx` ON `issue_activity` (`actor_user_id`);--> statement-breakpoint
CREATE INDEX `issue_activity_type_idx` ON `issue_activity` (`type`);--> statement-breakpoint
CREATE TABLE `issue_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`issue_id` text NOT NULL,
	`author_user_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`issue_id`) REFERENCES `issues`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `issue_comments_issue_id_idx` ON `issue_comments` (`issue_id`);--> statement-breakpoint
CREATE INDEX `issue_comments_author_user_id_idx` ON `issue_comments` (`author_user_id`);--> statement-breakpoint
CREATE TABLE `issue_labels` (
	`issue_id` text NOT NULL,
	`label_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`issue_id`, `label_id`),
	FOREIGN KEY (`issue_id`) REFERENCES `issues`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`label_id`) REFERENCES `labels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `issue_labels_label_id_idx` ON `issue_labels` (`label_id`);--> statement-breakpoint
CREATE TABLE `issues` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`team_id` text NOT NULL,
	`project_id` text,
	`cycle_id` text,
	`creator_user_id` text NOT NULL,
	`assignee_user_id` text,
	`identifier` text NOT NULL,
	`sequence_number` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text NOT NULL,
	`priority` text NOT NULL,
	`priority_score` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`completed_at` text,
	`cancelled_at` text,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`creator_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`assignee_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `issues_workspace_id_idx` ON `issues` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `issues_team_id_idx` ON `issues` (`team_id`);--> statement-breakpoint
CREATE INDEX `issues_project_id_idx` ON `issues` (`project_id`);--> statement-breakpoint
CREATE INDEX `issues_cycle_id_idx` ON `issues` (`cycle_id`);--> statement-breakpoint
CREATE INDEX `issues_assignee_user_id_idx` ON `issues` (`assignee_user_id`);--> statement-breakpoint
CREATE INDEX `issues_creator_user_id_idx` ON `issues` (`creator_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `issues_workspace_identifier_uq` ON `issues` (`workspace_id`,`identifier`);--> statement-breakpoint
CREATE UNIQUE INDEX `issues_team_sequence_uq` ON `issues` (`team_id`,`sequence_number`);--> statement-breakpoint
CREATE TABLE `labels` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `labels_workspace_id_idx` ON `labels` (`workspace_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `labels_workspace_name_uq` ON `labels` (`workspace_id`,`name`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'planned' NOT NULL,
	`lead_user_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lead_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `projects_workspace_id_idx` ON `projects` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `projects_lead_user_id_idx` ON `projects` (`lead_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `projects_workspace_slug_uq` ON `projects` (`workspace_id`,`slug`);--> statement-breakpoint
CREATE TABLE `team_memberships` (
	`team_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`team_id`, `user_id`),
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `team_memberships_user_id_idx` ON `team_memberships` (`user_id`);--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`identifier` text NOT NULL,
	`color` text NOT NULL,
	`next_issue_number` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `teams_workspace_id_idx` ON `teams` (`workspace_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_workspace_slug_uq` ON `teams` (`workspace_id`,`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_workspace_identifier_uq` ON `teams` (`workspace_id`,`identifier`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`clerk_user_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`avatar_url` text,
	`initials` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_clerk_user_id_uq` ON `users` (`clerk_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_uq` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `workspace_memberships` (
	`workspace_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`workspace_id`, `user_id`),
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `workspace_memberships_user_id_idx` ON `workspace_memberships` (`user_id`);--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`clerk_org_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workspaces_clerk_org_id_uq` ON `workspaces` (`clerk_org_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspaces_slug_uq` ON `workspaces` (`slug`);