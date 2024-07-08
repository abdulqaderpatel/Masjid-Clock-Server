import { Config, defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  verbose: true,
  strict: true,
  dialect: "mysql",
  dbCredentials: {
    host: "localhost",
    user: "user",
    database: "MasjidClock",
    password: "P@ssW0rd",
  },
});
