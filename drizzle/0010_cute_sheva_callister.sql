CREATE TABLE `feedback_chat_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`message_id` text NOT NULL,
	`file_name` text NOT NULL,
	`file_type` text NOT NULL,
	`file_size` integer NOT NULL,
	`raw_content` text NOT NULL,
	`import_id` text,
	`processed_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `feedback_chats`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`message_id`) REFERENCES `feedback_chat_messages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`import_id`) REFERENCES `feedback_imports`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `feedback_chat_attachments_chat_id_idx` ON `feedback_chat_attachments` (`chat_id`);--> statement-breakpoint
CREATE INDEX `feedback_chat_attachments_message_id_idx` ON `feedback_chat_attachments` (`message_id`);--> statement-breakpoint
CREATE INDEX `feedback_chat_attachments_import_id_idx` ON `feedback_chat_attachments` (`import_id`);--> statement-breakpoint
CREATE TABLE `feedback_chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`tool_calls_json` text,
	`tool_result_json` text,
	`attachments_json` text,
	`message_index` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `feedback_chats`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `feedback_chat_messages_chat_id_idx` ON `feedback_chat_messages` (`chat_id`);--> statement-breakpoint
CREATE INDEX `feedback_chat_messages_chat_id_order_idx` ON `feedback_chat_messages` (`chat_id`,`message_index`);--> statement-breakpoint
CREATE TABLE `feedback_chats` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`created_by_user_id` text NOT NULL,
	`title` text,
	`status` text DEFAULT 'active' NOT NULL,
	`readiness_score` integer DEFAULT 0 NOT NULL,
	`linked_import_ids` text DEFAULT '[]' NOT NULL,
	`metadata` text DEFAULT '{}' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `feedback_chats_workspace_id_idx` ON `feedback_chats` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `feedback_chats_created_by_user_id_idx` ON `feedback_chats` (`created_by_user_id`);--> statement-breakpoint
CREATE INDEX `feedback_chats_workspace_status_idx` ON `feedback_chats` (`workspace_id`,`status`,`updated_at`);