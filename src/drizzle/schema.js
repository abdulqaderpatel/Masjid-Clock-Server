"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTable = void 0;
var mysql_core_1 = require("drizzle-orm/mysql-core");
exports.UserTable = (0, mysql_core_1.mysqlTable)("user", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }).notNull(),
    password: (0, mysql_core_1.varchar)("password", { length: 255 }).notNull(),
});
