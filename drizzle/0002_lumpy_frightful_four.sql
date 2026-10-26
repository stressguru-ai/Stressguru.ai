CREATE TABLE `stressLeads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`score` int NOT NULL,
	`stressLevel` int NOT NULL,
	`tierTitle` varchar(64) NOT NULL,
	`tierId` int NOT NULL,
	`primaryGuru` varchar(64) NOT NULL,
	`secondaryGuru` varchar(64),
	`domainAverages` json,
	`answers` json,
	`bodyMapAreas` json,
	`emailSent` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stressLeads_id` PRIMARY KEY(`id`)
);
