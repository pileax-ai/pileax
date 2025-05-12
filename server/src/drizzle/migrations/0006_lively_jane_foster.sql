CREATE TABLE `user_book` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT '',
	`book_id` text NOT NULL,
	`rating` integer DEFAULT 0,
	`reading_position` text DEFAULT '',
	`reading_percentage` real DEFAULT 0,
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_book_id_unique` ON `user_book` (`id`);--> statement-breakpoint
ALTER TABLE `book` ADD `scope` integer DEFAULT 9;--> statement-breakpoint
ALTER TABLE `book` DROP COLUMN `reading_position`;--> statement-breakpoint
ALTER TABLE `book` DROP COLUMN `reading_percentage`;