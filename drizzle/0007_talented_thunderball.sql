CREATE TABLE `feedback_analysis_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`status` text NOT NULL,
	`trigger` text NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text,
	`error_message` text,
	`items_processed` integer DEFAULT 0 NOT NULL,
	`suggestions_produced` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `feedback_analysis_runs_workspace_id_idx` ON `feedback_analysis_runs` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `feedback_analysis_runs_status_idx` ON `feedback_analysis_runs` (`status`);--> statement-breakpoint
CREATE INDEX `feedback_analysis_runs_workspace_started_at_idx` ON `feedback_analysis_runs` (`workspace_id`,`started_at`);--> statement-breakpoint
CREATE TABLE `feedback_cluster_items` (
	`cluster_id` text NOT NULL,
	`item_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`cluster_id`, `item_id`),
	FOREIGN KEY (`cluster_id`) REFERENCES `feedback_clusters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `feedback_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `feedback_cluster_items_item_id_idx` ON `feedback_cluster_items` (`item_id`);--> statement-breakpoint
CREATE TABLE `feedback_clusters` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`cluster_key` text NOT NULL,
	`suggested_team_id` text,
	`feature_area` text,
	`problem_type` text,
	`title` text NOT NULL,
	`reason` text,
	`pain_summary` text,
	`proposed_direction` text,
	`confidence` integer DEFAULT 0 NOT NULL,
	`impact_score` integer DEFAULT 0 NOT NULL,
	`signal_count` integer DEFAULT 0 NOT NULL,
	`dedupe_key_set_json` text DEFAULT '[]' NOT NULL,
	`last_analyzed_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`suggested_team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `feedback_clusters_workspace_id_idx` ON `feedback_clusters` (`workspace_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `feedback_clusters_workspace_cluster_key_uq` ON `feedback_clusters` (`workspace_id`,`cluster_key`);--> statement-breakpoint
CREATE INDEX `feedback_clusters_suggested_team_id_idx` ON `feedback_clusters` (`suggested_team_id`);--> statement-breakpoint
CREATE TABLE `feedback_imports` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`created_by_user_id` text NOT NULL,
	`kind` text NOT NULL,
	`source_name` text NOT NULL,
	`source_description` text,
	`raw_content` text,
	`raw_payload_json` text,
	`item_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'ready' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `feedback_imports_workspace_id_idx` ON `feedback_imports` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `feedback_imports_created_by_user_id_idx` ON `feedback_imports` (`created_by_user_id`);--> statement-breakpoint
CREATE INDEX `feedback_imports_workspace_created_at_idx` ON `feedback_imports` (`workspace_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `feedback_items` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`import_id` text NOT NULL,
	`source_index` integer NOT NULL,
	`title` text,
	`original_text` text NOT NULL,
	`normalized_text` text NOT NULL,
	`raw_payload_json` text,
	`summary` text,
	`feature_area` text,
	`problem_type` text,
	`severity` text,
	`requested_capability` text,
	`suggested_team_id` text,
	`tags_json` text DEFAULT '[]' NOT NULL,
	`dedupe_keys_json` text DEFAULT '[]' NOT NULL,
	`analysis_version` integer DEFAULT 0 NOT NULL,
	`analyzed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`import_id`) REFERENCES `feedback_imports`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`suggested_team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `feedback_items_workspace_id_idx` ON `feedback_items` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `feedback_items_import_id_idx` ON `feedback_items` (`import_id`);--> statement-breakpoint
CREATE INDEX `feedback_items_suggested_team_id_idx` ON `feedback_items` (`suggested_team_id`);--> statement-breakpoint
CREATE INDEX `feedback_items_workspace_feature_problem_idx` ON `feedback_items` (`workspace_id`,`suggested_team_id`,`feature_area`,`problem_type`);--> statement-breakpoint
CREATE TABLE `feedback_suggestions` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`cluster_id` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`proposed_solution` text NOT NULL,
	`ai_rationale` text,
	`status` text DEFAULT 'new' NOT NULL,
	`suggested_team_id` text,
	`selected_team_id` text,
	`confidence` integer DEFAULT 0 NOT NULL,
	`impact_score` integer DEFAULT 0 NOT NULL,
	`evidence_count` integer DEFAULT 0 NOT NULL,
	`source_diversity` integer DEFAULT 0 NOT NULL,
	`priority_score` integer DEFAULT 0 NOT NULL,
	`issue_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cluster_id`) REFERENCES `feedback_clusters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`suggested_team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`selected_team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`issue_id`) REFERENCES `issues`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `feedback_suggestions_workspace_id_idx` ON `feedback_suggestions` (`workspace_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `feedback_suggestions_cluster_id_uq` ON `feedback_suggestions` (`cluster_id`);--> statement-breakpoint
CREATE INDEX `feedback_suggestions_status_idx` ON `feedback_suggestions` (`status`);--> statement-breakpoint
CREATE INDEX `feedback_suggestions_selected_team_id_idx` ON `feedback_suggestions` (`selected_team_id`);--> statement-breakpoint
CREATE INDEX `feedback_suggestions_priority_idx` ON `feedback_suggestions` (`workspace_id`,`status`,`priority_score`,`updated_at`);