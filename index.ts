import express from "express";
import { drizzle } from "drizzle-orm/mysql2";
import { db } from "./src/drizzle/db";
import { UserTable } from "./src/drizzle/schema";
import multer from "multer";
import xlsx from "xlsx";
import bodyParser from "body-parser";

const upload = multer({ dest: "uploads/" });
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post("/create", async (req, res) => {
  await db
    .insert(UserTable)
    .values({ name: "dsf", email: "dfd", password: "sdfd", address: "sdf" });
  return res.json({ success: true });
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const workbook = xlsx.readFile(req.file.path);

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  const insertData = async () => {
    try {
      for (let row of data) {
        console.log(row);
      }

      return res.send("Data uploaded");
    } catch (e) {
      return res.send("some error occured");
    }
  };
  insertData();
});
app.listen(3001, () => {
  console.log("servjkher working");
});
