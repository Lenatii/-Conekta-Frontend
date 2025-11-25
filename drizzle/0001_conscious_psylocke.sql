CREATE TABLE `contactReveals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`propertyId` int NOT NULL,
	`amount` int NOT NULL,
	`paymentMethod` varchar(50) DEFAULT 'mpesa',
	`transactionId` varchar(255),
	`status` enum('pending','completed','failed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactReveals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guestSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`searchCount` int DEFAULT 0,
	`ipAddress` varchar(50),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastActivity` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guestSessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `guestSessions_sessionId_unique` UNIQUE(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`propertyType` enum('apartment','house','bedsitter','studio','commercial') NOT NULL,
	`bedrooms` int NOT NULL,
	`bathrooms` int NOT NULL,
	`price` int NOT NULL,
	`location` varchar(255) NOT NULL,
	`city` varchar(100) NOT NULL,
	`county` varchar(100) NOT NULL,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`hasParking` boolean DEFAULT false,
	`hasWifi` boolean DEFAULT false,
	`hasGenerator` boolean DEFAULT false,
	`hasWater` boolean DEFAULT false,
	`hasSecurity` boolean DEFAULT false,
	`landlordName` varchar(255),
	`landlordPhone` varchar(20),
	`landlordEmail` varchar(320),
	`status` enum('active','rented','inactive') NOT NULL DEFAULT 'active',
	`isVerified` boolean DEFAULT false,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `propertyImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`imageUrl` varchar(500) NOT NULL,
	`caption` varchar(255),
	`orderIndex` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `propertyImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`targetType` enum('property','service_provider') NOT NULL,
	`targetId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `serviceProviders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320),
	`serviceType` enum('plumber','electrician','carpenter','painter','cleaner','other') NOT NULL,
	`description` text,
	`location` varchar(255),
	`city` varchar(100),
	`hourlyRate` int,
	`isVerified` boolean DEFAULT false,
	`rating` int DEFAULT 0,
	`totalJobs` int DEFAULT 0,
	`status` enum('active','inactive') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `serviceProviders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);