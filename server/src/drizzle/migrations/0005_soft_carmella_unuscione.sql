PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chat_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT '',
	`title` text DEFAULT '',
	`name` text NOT NULL,
	`assistant` text DEFAULT 'chat',
	`ref_id` text DEFAULT '',
	`ref_type` text DEFAULT 'general',
	`favorite` integer DEFAULT 0,
	`status` integer DEFAULT 0,
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_chat_session`("id", "user_id", "title", "name", "assistant", "ref_id", "ref_type", "status", "create_time", "update_time") SELECT "id", "user_id", "title", "name", "assistant", "ref_id", "ref_type", "status", "create_time", "update_time" FROM `chat_session`;--> statement-breakpoint
DROP TABLE `chat_session`;--> statement-breakpoint
ALTER TABLE `__new_chat_session` RENAME TO `chat_session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `chat_session_id_unique` ON `chat_session` (`id`);
