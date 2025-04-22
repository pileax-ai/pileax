ALTER TABLE `note` RENAME COLUMN "chat_id" TO "ref_id";--> statement-breakpoint
CREATE TABLE `knowledge` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT '',
	`name` text DEFAULT '',
	`description` text DEFAULT '',
	`logo` text DEFAULT '',
	`status` integer DEFAULT 1,
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `knowledge_id_unique` ON `knowledge` (`id`);--> statement-breakpoint
ALTER TABLE `note` ADD `ref_type` text DEFAULT 'general';--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_file_meta` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT '',
	`mimetype` text DEFAULT '',
	`size` integer DEFAULT 0,
	`original_name` text DEFAULT '',
	`file_name` text DEFAULT '',
	`url` text DEFAULT '',
	`path` text DEFAULT '',
	`ref_id` text DEFAULT '',
	`ref_type` text DEFAULT 'general',
	`status` integer DEFAULT 1,
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_file_meta`("id", "user_id", "mimetype", "size", "original_name", "file_name", "url", "path", "ref_id", "ref_type", "status", "create_time", "update_time") SELECT "id", "user_id", "mimetype", "size", "original_name", "file_name", "url", "path", "ref_id", "ref_type", "status", "create_time", "update_time" FROM `file_meta`;--> statement-breakpoint
DROP TABLE `file_meta`;--> statement-breakpoint
ALTER TABLE `__new_file_meta` RENAME TO `file_meta`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `file_meta_id_unique` ON `file_meta` (`id`);--> statement-breakpoint
ALTER TABLE `chat_session` ADD `ref_id` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `chat_session` ADD `ref_type` text DEFAULT 'general';