import { Config, defineConfig } from "drizzle-kit";

import "dotenv/config";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  verbose: true,
  strict: true,
  dialect: "mysql",
  dbCredentials: {
    host: process.env.HOST || "",
    user: process.env.USER || "",
    database: process.env.DB_DATABASE || "",
    password: process.env.DB_PASSWORD
  },
});
