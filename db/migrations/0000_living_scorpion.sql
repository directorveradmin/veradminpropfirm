CREATE TABLE `firms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `firms_slug_uidx` ON `firms` (`slug`);--> statement-breakpoint
CREATE INDEX `firms_name_idx` ON `firms` (`name`);--> statement-breakpoint
CREATE TABLE `rule_profile_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`rule_profile_id` text NOT NULL,
	`version_number` integer NOT NULL,
	`version_label` text NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`effective_from` text NOT NULL,
	`effective_to` text,
	`supersedes_version_id` text,
	`firm_rules_json` text NOT NULL,
	`operator_overlay_compatibility_json` text NOT NULL,
	`normalized_summary_json` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`rule_profile_id`) REFERENCES `rule_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `rule_profile_versions_profile_idx` ON `rule_profile_versions` (`rule_profile_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `rule_profile_versions_family_version_uidx` ON `rule_profile_versions` (`rule_profile_id`,`version_number`);--> statement-breakpoint
CREATE INDEX `rule_profile_versions_active_idx` ON `rule_profile_versions` (`rule_profile_id`,`is_active`);--> statement-breakpoint
CREATE TABLE `rule_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`profile_key` text NOT NULL,
	`name` text NOT NULL,
	`stage_type` text NOT NULL,
	`account_class` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`firm_id`) REFERENCES `firms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `rule_profiles_firm_idx` ON `rule_profiles` (`firm_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `rule_profiles_profile_key_uidx` ON `rule_profiles` (`firm_id`,`profile_key`);--> statement-breakpoint
CREATE TABLE `account_day_state` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`trading_date` text NOT NULL,
	`day_start_balance_cents` integer NOT NULL,
	`realized_pnl_today_cents` integer DEFAULT 0 NOT NULL,
	`reset_completed_at` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_day_state_account_idx` ON `account_day_state` (`account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `account_day_state_account_date_uidx` ON `account_day_state` (`account_id`,`trading_date`);--> statement-breakpoint
CREATE TABLE `account_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`note_type` text DEFAULT 'general' NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_notes_account_idx` ON `account_notes` (`account_id`);--> statement-breakpoint
CREATE TABLE `account_rule_profile_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`rule_profile_id` text NOT NULL,
	`rule_profile_version_id` text NOT NULL,
	`assigned_at` text NOT NULL,
	`ended_at` text,
	`assignment_reason` text NOT NULL,
	`assigned_by` text NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rule_profile_id`) REFERENCES `rule_profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rule_profile_version_id`) REFERENCES `rule_profile_versions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_assignments_account_idx` ON `account_rule_profile_assignments` (`account_id`);--> statement-breakpoint
CREATE INDEX `account_assignments_version_idx` ON `account_rule_profile_assignments` (`rule_profile_version_id`);--> statement-breakpoint
CREATE TABLE `account_tag_links` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_tag_links_account_idx` ON `account_tag_links` (`account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `account_tag_links_account_tag_uidx` ON `account_tag_links` (`account_id`,`tag_id`);--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`current_rule_profile_id` text NOT NULL,
	`current_rule_profile_version_id` text NOT NULL,
	`account_label` text NOT NULL,
	`external_account_ref` text,
	`lifecycle_stage` text NOT NULL,
	`account_status` text DEFAULT 'active' NOT NULL,
	`starting_balance_cents` integer NOT NULL,
	`current_balance_cents` integer NOT NULL,
	`peak_balance_cents` integer NOT NULL,
	`days_traded_reference` integer,
	`last_payout_date` text,
	`fee_refunded` integer DEFAULT false NOT NULL,
	`manually_paused` integer DEFAULT false NOT NULL,
	`archived_at` text,
	`breached_at` text,
	`notes_summary` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`firm_id`) REFERENCES `firms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`current_rule_profile_id`) REFERENCES `rule_profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`current_rule_profile_version_id`) REFERENCES `rule_profile_versions`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "accounts_starting_balance_positive_chk" CHECK("accounts"."starting_balance_cents" > 0),
	CONSTRAINT "accounts_current_balance_nonnegative_chk" CHECK("accounts"."current_balance_cents" >= 0),
	CONSTRAINT "accounts_peak_balance_nonnegative_chk" CHECK("accounts"."peak_balance_cents" >= 0)
);
--> statement-breakpoint
CREATE INDEX `accounts_firm_idx` ON `accounts` (`firm_id`);--> statement-breakpoint
CREATE INDEX `accounts_profile_idx` ON `accounts` (`current_rule_profile_id`);--> statement-breakpoint
CREATE INDEX `accounts_profile_version_idx` ON `accounts` (`current_rule_profile_version_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_label_uidx` ON `accounts` (`account_label`);--> statement-breakpoint
CREATE TABLE `fleet_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`trading_day_boundary` text NOT NULL,
	`default_news_lock_minutes_before` integer NOT NULL,
	`default_news_lock_minutes_after` integer NOT NULL,
	`default_fractional_risk_policy` text NOT NULL,
	`backup_schedule` text,
	`theme_preference` text,
	`safety_preferences_json` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`scope` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`color_token` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_scope_slug_uidx` ON `tags` (`scope`,`slug`);--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`type` text NOT NULL,
	`severity` text NOT NULL,
	`status` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`source` text NOT NULL,
	`source_ref_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`resolved_at` text,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `alerts_status_severity_idx` ON `alerts` (`status`,`severity`);--> statement-breakpoint
CREATE INDEX `alerts_account_idx` ON `alerts` (`account_id`);--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`event_type` text NOT NULL,
	`event_timestamp` text NOT NULL,
	`actor_type` text NOT NULL,
	`summary` text NOT NULL,
	`payload_json` text,
	`rule_profile_version_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_events_account_timestamp_idx` ON `audit_events` (`account_id`,`event_timestamp`);--> statement-breakpoint
CREATE TABLE `balance_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`snapshot_timestamp` text NOT NULL,
	`current_balance_cents` integer NOT NULL,
	`peak_balance_cents` integer NOT NULL,
	`daily_start_balance_cents` integer,
	`snapshot_reason` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `balance_snapshots_account_timestamp_idx` ON `balance_snapshots` (`account_id`,`snapshot_timestamp`);--> statement-breakpoint
CREATE TABLE `calendar_rotations` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`rotation_type` text NOT NULL,
	`window_start` text NOT NULL,
	`window_end` text NOT NULL,
	`state` text NOT NULL,
	`reason` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `calendar_rotations_account_start_idx` ON `calendar_rotations` (`account_id`,`window_start`);--> statement-breakpoint
CREATE TABLE `imports_exports_log` (
	`id` text PRIMARY KEY NOT NULL,
	`operation_type` text NOT NULL,
	`file_path` text,
	`status` text NOT NULL,
	`summary` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `imports_exports_log_type_idx` ON `imports_exports_log` (`operation_type`);--> statement-breakpoint
CREATE TABLE `news_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_timestamp` text NOT NULL,
	`title` text NOT NULL,
	`impact_level` text NOT NULL,
	`asset_scope` text NOT NULL,
	`lock_minutes_before` integer NOT NULL,
	`lock_minutes_after` integer NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `news_events_timestamp_idx` ON `news_events` (`event_timestamp`);--> statement-breakpoint
CREATE TABLE `payout_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`requested_at` text NOT NULL,
	`expected_arrival_at` text,
	`received_at` text,
	`amount_requested_cents` integer NOT NULL,
	`amount_received_cents` integer,
	`status` text NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `payout_requests_account_requested_idx` ON `payout_requests` (`account_id`,`requested_at`);--> statement-breakpoint
CREATE TABLE `refund_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`triggered_at` text NOT NULL,
	`status` text NOT NULL,
	`resolution_note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `refund_tasks_account_triggered_idx` ON `refund_tasks` (`account_id`,`triggered_at`);--> statement-breakpoint
CREATE TABLE `trade_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`trading_timestamp` text NOT NULL,
	`trade_date` text NOT NULL,
	`session` text NOT NULL,
	`direction` text NOT NULL,
	`result_type` text NOT NULL,
	`points` real,
	`pnl_amount_cents` integer NOT NULL,
	`risk_unit_fraction` real,
	`was_rule_following` integer DEFAULT true NOT NULL,
	`was_near_news` integer DEFAULT false NOT NULL,
	`setup_tag_id` text,
	`screenshot_path` text,
	`note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`setup_tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `trade_logs_account_timestamp_idx` ON `trade_logs` (`account_id`,`trading_timestamp`);