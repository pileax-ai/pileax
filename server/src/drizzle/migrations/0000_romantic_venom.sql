CREATE TABLE `note` (
	`id` text PRIMARY KEY NOT NULL,
	`parent` text DEFAULT '',
	`title` text NOT NULL,
	`content` text NOT NULL,
	`icon` text DEFAULT '',
	`cover` text DEFAULT '',
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `note_id_unique` ON `note` (`id`);