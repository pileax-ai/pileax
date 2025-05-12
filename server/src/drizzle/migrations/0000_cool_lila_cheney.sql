CREATE TABLE `book` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT '',
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
	`scope` integer DEFAULT 9,
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book_id_unique` ON `book` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `book_uuid_unique` ON `book` (`uuid`);--> statement-breakpoint
CREATE TABLE `book_annotation` (
	`id` text PRIMARY KEY NOT NULL,
	`user_book_id` text DEFAULT '',
	`user_id` text DEFAULT '',
	`book_id` text NOT NULL,
	`type` text NOT NULL,
	`value` text NOT NULL,
	`note` text DEFAULT '',
	`color` text DEFAULT '',
	`page` integer DEFAULT 0,
	`chapter` text DEFAULT '',
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book_annotation_id_unique` ON `book_annotation` (`id`);--> statement-breakpoint
CREATE TABLE `chat` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT '',
	`session_id` text NOT NULL,
	`message` text NOT NULL,
	`content` text NOT NULL,
	`reasoning` integer DEFAULT 0,
	`reasoning_content` text DEFAULT '',
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
CREATE UNIQUE INDEX `chat_session_id_unique` ON `chat_session` (`id`);--> statement-breakpoint
CREATE TABLE `config` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT '',
	`type` text DEFAULT '',
	`datatype` text DEFAULT '',
	`key` text NOT NULL,
	`value` text DEFAULT '',
	`owner` text DEFAULT '',
	`scope` text DEFAULT 'system',
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `config_id_unique` ON `config` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `config_key_owner_unique` ON `config` (`key`,`owner`);--> statement-breakpoint
CREATE INDEX `config_scope_idx` ON `config` (`scope`);--> statement-breakpoint
CREATE TABLE `file_meta` (
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
CREATE UNIQUE INDEX `file_meta_id_unique` ON `file_meta` (`id`);--> statement-breakpoint
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
CREATE TABLE `note` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT '',
	`parent` text DEFAULT '',
	`title` text NOT NULL,
	`content` text NOT NULL,
	`icon` text DEFAULT '',
	`cover` text DEFAULT '',
	`favorite` integer DEFAULT 0,
	`styles` text DEFAULT '',
	`ref_id` text DEFAULT '',
	`ref_type` text DEFAULT 'general',
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `note_id_unique` ON `note` (`id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`dialling_code` text DEFAULT '',
	`phone` text DEFAULT '',
	`email` text DEFAULT '',
	`name` text NOT NULL,
	`bio` text DEFAULT '',
	`avatar` text DEFAULT '',
	`cover` text DEFAULT '',
	`password` text,
	`remarks` text DEFAULT '',
	`status` integer DEFAULT 1,
	`create_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL,
	`update_time` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_unique` ON `user` (`id`);--> statement-breakpoint
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
CREATE UNIQUE INDEX `user_book_unique` ON `user_book` (`user_id`,`book_id`);