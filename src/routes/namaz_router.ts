import {and, eq, gt, gte, lt, lte,} from "drizzle-orm";
import express from "express";
import {db} from "../drizzle/db";
import {NamazTable} from "../drizzle/schema";

const namazRouter = express.Router();

function adjustForTimezone(date: Date): Date {
    const timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() + timeOffsetInMS);
    return date;
}

namazRouter.get("/user/:id/date/:date", async (req, res) => {
    const {date, id} = req.params;


    const userDate = adjustForTimezone(new Date(date));

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


    let dateData = await db.select()
        .from(NamazTable).where(and(
                eq(NamazTable.user_id, Number(id)),
                gt(NamazTable.date, startOfDay),
                lte(NamazTable.date, endOfDay)
            )
        );
    
    return res.json({
        message: "data successfully fetched",
        data: dateData,
    });
});
export default namazRouter;
