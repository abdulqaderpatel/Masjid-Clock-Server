CREATE TABLE `namaz_times` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
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
	CONSTRAINT `namaz_times_id` PRIMARY KEY(`id`)
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
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `namaz_times` ADD CONSTRAINT `namaz_times_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;