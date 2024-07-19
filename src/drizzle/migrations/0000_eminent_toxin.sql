CREATE TABLE `masjids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`country` varchar(255),
	`state` varchar(255),
	`city` varchar(255),
	`isVerified` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `masjids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `namaz` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`date` date NOT NULL,
	`fajr_namaz` time NOT NULL,
	`fajr_jamat` time NOT NULL,
	`zuhr_namaz` time NOT NULL,
	`zuhr_jamat` time NOT NULL,
	`asr_namaz` time NOT NULL,
	`asr_jamat` time NOT NULL,
	`maghrib_namaz` time NOT NULL,
	`maghrib_jamat` time NOT NULL,
	`isha_namaz` time NOT NULL,
	`isha_jamat` time NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `namaz_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`country` varchar(255),
	`state` varchar(255),
	`city` varchar(255),
	`isVerified` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `namaz` ADD CONSTRAINT `namaz_user_id_masjids_id_fk` FOREIGN KEY (`user_id`) REFERENCES `masjids`(`id`) ON DELETE no action ON UPDATE no action;