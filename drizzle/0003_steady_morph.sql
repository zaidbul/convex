CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`recipient_user_id` text NOT NULL,
	`actor_user_id` text,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`body` text,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`metadata` text DEFAULT '{}' NOT NULL,
	`read_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipient_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `notifications_workspace_id_idx` ON `notifications` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `notifications_recipient_user_id_idx` ON `notifications` (`recipient_user_id`);--> statement-breakpoint
CREATE INDEX `notifications_actor_user_id_idx` ON `notifications` (`actor_user_id`);--> statement-breakpoint
CREATE INDEX `notifications_type_idx` ON `notifications` (`type`);--> statement-breakpoint
CREATE INDEX `notifications_created_at_idx` ON `notifications` (`created_at`);--> statement-breakpoint
CREATE INDEX `notifications_recipient_read_created_idx` ON `notifications` (`recipient_user_id`,`read_at`,`created_at`);