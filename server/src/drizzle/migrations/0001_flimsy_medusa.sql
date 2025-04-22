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
CREATE INDEX `config_scope_idx` ON `config` (`scope`);