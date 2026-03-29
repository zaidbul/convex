DROP INDEX `users_email_uq`;--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `feedback_analysis_runs_workspace_running_uq` ON `feedback_analysis_runs` (`workspace_id`) WHERE status = 'running';