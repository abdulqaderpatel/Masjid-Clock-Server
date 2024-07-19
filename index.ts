import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import userRouter from "./src/routes/user_router";
import namazRouter from "./src/routes/namaz_router";
import masjidRouter from './src/routes/masjid_router';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/masjid", masjidRouter);
app.use("/api/namaz", namazRouter);

app.listen(process.env.PORT, () => {});
