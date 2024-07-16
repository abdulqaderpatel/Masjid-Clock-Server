import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import userRouter from "./src/routes/user_router";
import namazRouter from "./src/routes/namaz_router";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/naxmaz", namazRouter);

console.log(process.env.PORT);

app.listen(process.env.PORT, () => {});
