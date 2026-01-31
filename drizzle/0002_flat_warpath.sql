CREATE TABLE `verifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`idType` varchar(50) NOT NULL,
	`idNumber` varchar(100) NOT NULL,
	`location` varchar(255) NOT NULL,
	`emergencyContactName` varchar(255),
	`emergencyContactPhone` varchar(20),
	`userType` enum('tenant','landlord','fundi') NOT NULL,
	`tcAccepted` boolean NOT NULL DEFAULT false,
	`privacyAccepted` boolean NOT NULL DEFAULT false,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verifications_id` PRIMARY KEY(`id`)
);
