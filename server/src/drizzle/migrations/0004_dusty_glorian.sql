ALTER TABLE `chat_session` ADD `assistant` text DEFAULT 'general';--> statement-breakpoint
ALTER TABLE `chat` DROP COLUMN `note_id`;