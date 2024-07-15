import { eq, gt, gte, lt, lte, param } from "drizzle-orm";
import express from "express";
import { db } from "../drizzle/db";
import { NamazTimeTable, UserTable } from "../drizzle/schema";
import { log } from "console";
import { deepEqual, strictEqual } from "assert";

const namazRouter = express.Router();

function adjustForTimezone(date: Date): Date {
  var timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
  date.setTime(date.getTime() + timeOffsetInMS);
  return date;
}

namazRouter.get("/date/:date", async (req, res) => {
  const { date } = req.params;

  const userDate = adjustForTimezone(new Date());

  console.log(userDate);
  console.log(Date.now().toString());

  const startOfDay = adjustForTimezone(
    new Date(
      Date.UTC(
        userDate.getUTCFullYear(),
        userDate.getUTCMonth(),
        userDate.getUTCDate()
      )
    )
  );
  const endOfDay = adjustForTimezone(
    new Date(
      Date.UTC(
        userDate.getUTCFullYear(),
        userDate.getUTCMonth(),
        userDate.getUTCDate() + 1
      )
    )
  );

  console.log(userDate);

  console.log(startOfDay);
  console.log(endOfDay);

  log(userDate > endOfDay);

  let dateData = await db.query.NamazTimeTable.findFirst({
    where:
      lt(NamazTimeTable.date, endOfDay) && gte(NamazTimeTable.date, startOfDay),
  });

  console.log(dateData?.date.toUTCString());

  console.log(typeof date);

  return res.json({
    success: true,
    message: "data successfully fetched",
    data: dateData,
  });
});

export default namazRouter;
