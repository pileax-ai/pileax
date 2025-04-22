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
CREATE UNIQUE INDEX `knowledge_id_unique` ON `knowledge` (`id`);