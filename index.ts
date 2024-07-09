import express from "express";
import bodyParser from "body-parser";
import userRouter from "./src/routes/user_router";
import cors from "cors";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRouter);

app.listen(3001, () => {
  console.log("servjkher working");
});
