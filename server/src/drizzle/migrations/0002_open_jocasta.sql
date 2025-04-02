CREATE TABLE `chat` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer DEFAULT 0,
	`session_id` text NOT NULL,
	`message` text NOT NULL,
	`response` text NOT NULL,
	`provider` text NOT NULL,
	`model` text DEFAULT '',
	`result` integer DEFAULT 0,
	`like` integer DEFAULT 0,
	`status` integer DEFAULT 1,
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chat_id_unique` ON `chat` (`id`);--> statement-breakpoint
CREATE TABLE `chat_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer DEFAULT 0,
	`title` text DEFAULT '',
	`name` text NOT NULL,
	`status` integer DEFAULT 0,
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chat_session_id_unique` ON `chat_session` (`id`);