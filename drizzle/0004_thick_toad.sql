CREATE TABLE `saved_views` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`team_id` text NOT NULL,
	`owner_user_id` text NOT NULL,
	`name` text NOT NULL,
	`preset_filter` text,
	`advanced_filters_json` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `saved_views_workspace_id_idx` ON `saved_views` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `saved_views_team_id_idx` ON `saved_views` (`team_id`);--> statement-breakpoint
CREATE INDEX `saved_views_owner_user_id_idx` ON `saved_views` (`owner_user_id`);--> statement-breakpoint
CREATE INDEX `saved_views_owner_team_updated_idx` ON `saved_views` (`owner_user_id`,`team_id`,`updated_at`);--> statement-breakpoint
ALTER TABLE `issues` ADD `due_date` text;--> statement-breakpoint
CREATE INDEX `issues_due_date_idx` ON `issues` (`due_date`);