import {eq, gte, lt,} from "drizzle-orm";
import express from "express";
import {db} from "../drizzle/db";
import {NamazTable, UserTable} from "../drizzle/schema";

const namazRouter = express.Router();

function adjustForTimezone(date: Date): Date {
    var timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() + timeOffsetInMS);
    return date;
}

namazRouter.get("/user/:id/date/:date", async (req, res) => {
    const {date, id} = req.params;


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

    let dateData = await db.query.NamazTable.findFirst({
        where:
            lt(NamazTable.date, endOfDay) && gte(NamazTable.date, startOfDay) && eq(NamazTable.user_id, Number.parseInt(id)),
    });

    console.log(dateData?.date.toUTCString());

    console.log(typeof date);

    return res.json({
        success: true,
        data: dateData,
    });
});

export default namazRouter;
