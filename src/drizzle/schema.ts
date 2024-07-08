import {
  date,
  datetime,
  int,
  mysqlTable,
  time,
  varchar,
} from "drizzle-orm/mysql-core";

export const UserTable = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }),
  state: varchar("state", { length: 255 }),
  city: varchar("city", { length: 255 }),
});

export const NamazTimeTable = mysqlTable("namaz_times", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").references(() => UserTable.id),
  date: date("date").notNull(),
  fajr_namaz: time("fajr_namaz").notNull(),
  fajr_jamat: time("fajr_jamat").notNull(),
  zuhr_namaz: time("zuhr_namaz").notNull(),
  zuhr_jamat: time("zuhr_jamat").notNull(),
  asr_namaz: time("asr_namaz").notNull(),
  asr_jamat: time("asr_jamat").notNull(),
  maghrib_namaz: time("maghrib_namaz").notNull(),
  maghrib_jamat: time("maghrib_jamat").notNull(),
  isha_namaz: time("isha_namaz").notNull(),
  isha_jamat: time("isha_jamat").notNull(),
});
