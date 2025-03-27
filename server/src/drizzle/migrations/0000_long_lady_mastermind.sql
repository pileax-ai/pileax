CREATE TABLE `note` (
	`id` text PRIMARY KEY NOT NULL,
	`parent` text DEFAULT '',
	`title` text NOT NULL,
	`content` text NOT NULL,
	`icon` text DEFAULT '',
	`cover` text DEFAULT '',
	`createTime` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`updateTime` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `note_id_unique` ON `note` (`id`);