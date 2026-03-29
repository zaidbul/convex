CREATE INDEX `issues_team_visible_order_idx` ON `issues` (`team_id`,`archived_at`,`deleted_at`,`priority_score`,`updated_at`,`created_at`);--> statement-breakpoint
CREATE INDEX `issues_team_status_visible_order_idx` ON `issues` (`team_id`,`status`,`archived_at`,`deleted_at`,`priority_score`,`updated_at`,`created_at`);
