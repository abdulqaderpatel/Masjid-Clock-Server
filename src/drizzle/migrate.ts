import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    database: process.env.DB_DATABASE || "",
    password: process.env.DB_PASSWORD || "",
    dateStrings: true,
  });

  const db = drizzle(connection);
}

migrate();
