import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const UserTable = mysqlTable("user", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
});
