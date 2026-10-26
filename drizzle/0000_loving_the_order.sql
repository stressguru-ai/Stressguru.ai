CREATE TABLE `blogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(256) NOT NULL,
	`title` varchar(512) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`image` varchar(1024),
	`category` varchar(128),
	`guruId` int NOT NULL,
	`authorName` varchar(128),
	`authorRole` varchar(256),
	`authorImage` varchar(512),
	`seoKeywords` json,
	`readTime` varchar(32),
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`createdBy` enum('manual','ai') NOT NULL DEFAULT 'manual',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogs_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogs_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `gurus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL,
	`role` varchar(256) NOT NULL,
	`image` varchar(512) NOT NULL,
	`description` text,
	`icpProblems` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gurus_id` PRIMARY KEY(`id`),
	CONSTRAINT `gurus_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
