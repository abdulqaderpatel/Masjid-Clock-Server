"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var mysql2_1 = require("drizzle-orm/mysql2");
var promise_1 = require("mysql2/promise");
var poolConnection = promise_1.default.createPool({
    host: "localhost",
    user: "user",
    database: "MasjidClock",
    password: "P@ssW0rd",
});
exports.db = (0, mysql2_1.drizzle)(poolConnection);
