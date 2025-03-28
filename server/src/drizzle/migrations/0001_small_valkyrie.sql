CREATE TABLE `book` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`title` text NOT NULL,
	`path` text NOT NULL,
	`file_name` text DEFAULT '',
	`extension` text DEFAULT '',
	`cover_name` text DEFAULT '',
	`rating` integer DEFAULT 0,
	`author` text DEFAULT '',
	`language` text DEFAULT '',
	`description` text DEFAULT '',
	`publisher` text DEFAULT '',
	`published` text DEFAULT '',
	`reading_position` text DEFAULT '',
	`reading_percentage` real DEFAULT 0,
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book_uuid_unique` ON `book` (`uuid`);--> statement-breakpoint
CREATE TABLE `book_annotation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book_id` integer NOT NULL,
	`type` text NOT NULL,
	`value` text NOT NULL,
	`note` text DEFAULT '',
	`color` text DEFAULT '',
	`page` integer DEFAULT 0,
	`chapter` text DEFAULT '',
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
