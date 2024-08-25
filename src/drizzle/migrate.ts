import {drizzle} from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

async function migrate() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "user",
        database: "MasjidClock",
        password: "P@ssW0rd",
        dateStrings: true
    });

    const db = drizzle(connection);
}

migrate();
