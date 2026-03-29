PRAGMA foreign_keys=OFF;--> statement-breakpoint

DROP TABLE `projects`;--> statement-breakpoint

CREATE TABLE `issues_new` (
  `id` text PRIMARY KEY NOT NULL,
  `workspace_id` text NOT NULL REFERENCES `workspaces`(`id`) ON DELETE cascade,
  `team_id` text NOT NULL REFERENCES `teams`(`id`) ON DELETE cascade,
  `cycle_id` text REFERENCES `cycles`(`id`) ON DELETE set null,
  `creator_user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE restrict,
  `assignee_user_id` text REFERENCES `users`(`id`) ON DELETE set null,
  `identifier` text NOT NULL,
  `sequence_number` integer NOT NULL,
  `title` text NOT NULL,
  `description` text,
  `status` text NOT NULL,
  `priority` text NOT NULL,
  `priority_score` integer NOT NULL DEFAULT 0,
  `due_date` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `completed_at` text,
  `cancelled_at` text,
  `archived_at` text,
  `deleted_at` text
);--> statement-breakpoint

INSERT INTO `issues_new` SELECT
  `id`, `workspace_id`, `team_id`, `cycle_id`, `creator_user_id`, `assignee_user_id`,
  `identifier`, `sequence_number`, `title`, `description`, `status`, `priority`,
  `priority_score`, `due_date`, `created_at`, `updated_at`, `completed_at`,
  `cancelled_at`, `archived_at`, `deleted_at`
FROM `issues`;--> statement-breakpoint

DROP TABLE `issues`;--> statement-breakpoint

ALTER TABLE `issues_new` RENAME TO `issues`;--> statement-breakpoint

CREATE INDEX `issues_workspace_id_idx` ON `issues` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `issues_team_id_idx` ON `issues` (`team_id`);--> statement-breakpoint
CREATE INDEX `issues_cycle_id_idx` ON `issues` (`cycle_id`);--> statement-breakpoint
CREATE INDEX `issues_assignee_user_id_idx` ON `issues` (`assignee_user_id`);--> statement-breakpoint
CREATE INDEX `issues_creator_user_id_idx` ON `issues` (`creator_user_id`);--> statement-breakpoint
CREATE INDEX `issues_due_date_idx` ON `issues` (`due_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `issues_workspace_identifier_uq` ON `issues` (`workspace_id`, `identifier`);--> statement-breakpoint
CREATE UNIQUE INDEX `issues_team_sequence_uq` ON `issues` (`team_id`, `sequence_number`);--> statement-breakpoint

PRAGMA foreign_keys=ON;
