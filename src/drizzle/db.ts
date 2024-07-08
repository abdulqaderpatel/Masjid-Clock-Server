import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const poolConnection = mysql.createPool({
  host: "localhost",
  user: "user",
  database: "MasjidClock",
  password: "P@ssW0rd",
});
export const db = drizzle(poolConnection, { schema, mode: "default" });
