import express from "express";
import { drizzle } from "drizzle-orm/mysql2";
import { db } from "./src/drizzle/db";
import { UserTable } from "./src/drizzle/schema";

const app = express();
console.log("tmiepas");

app.post("/create", async (req, res) => {
  await db
    .insert(UserTable)
    .values({ name: "dsf", email: "dfd", password: "sdfd" });
  return res.json({ success: true });
});
app.listen(3001, () => {
  console.log("servjkher working");
});
