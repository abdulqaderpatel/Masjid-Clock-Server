// @ts-nocheck
import { Router } from "express";
import express, { Request, Response } from "express";
import { db } from ".././drizzle/db";
import { NamazTimeTable, UserTable } from ".././drizzle/schema";
import multer from "multer";
import xlsx from "xlsx";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { format } from "path";

const upload = multer({ dest: "uploads/" });
const userRouter = express.Router();

userRouter.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, address, country, state, city } = req.body;
  // Check if the user already exists

  const userExists = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
  });

  if (userExists) {
    return res.status(400).json({ errors: [{ msg: "User already exists" }] });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(UserTable).values({
    name,
    email,
    password: hashedPassword,
    address,
    country,
    state,
    city,
  });

  res.status(201).json("user created successfully");
});
function ExcelDateToJSDate(date) {
  return new Date(Math.round((date - 25569) * 86400 * 1000));
}

userRouter.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const workbook = xlsx.readFile(req.file.path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  console.log(workbook);
  let data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);

  try {
    data.forEach(async (value, index, array) => {
      const formattedDate = ExcelDateToJSDate(value[0])
        .toISOString()
        .split("T", 1)[0];
      console.log(formattedDate);
      console.log(typeof value[0]);
      await db.insert(NamazTimeTable).values({
        user_id: 1,
        date: formattedDate, // Default date if not provided
        fajr_namaz: value[1].toString(),
        fajr_jamat: value[2].toString(),
        zuhr_namaz: value[3].toString(),
        zuhr_jamat: value[4].toString(),
        asr_namaz: value[5].toString(),
        asr_jamat: value[6].toString(),
        maghrib_namaz: value[7].toString(),
        maghrib_jamat: value[8].toString(),
        isha_namaz: value[9].toString(),
        isha_jamat: value[10].toString(),
      });
    });
    return res.send("Data uploaded");
  } catch (e) {
    return res.send("some error occured");
  }
});

export default userRouter;
