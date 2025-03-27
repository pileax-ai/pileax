CREATE TABLE `note` (
	`id` text PRIMARY KEY NOT NULL,
	`parent` text DEFAULT '',
	`title` text NOT NULL,
	`content` text NOT NULL,
	`icon` text DEFAULT '',
	`cover` text DEFAULT '',
	`createTime` text DEFAULT (CURRENT_TIMESTAMP),
	`updateTime` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `note_id_unique` ON `note` (`id`);