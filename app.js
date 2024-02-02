import express from "express";
import "express-async-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { connectDB } from "./database/database.js";
import authRouter from "./router/auth.js";
import productRouter from "./router/product.js";
import paymentRouter from "./router/payment.js";
import adminRouter from "./router/admin.js";
import { csrfCheck } from "./middleware/csrf.js";

const app = express();
const corsOption = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOption));
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(helmet());

app.use(csrfCheck);
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/payment", paymentRouter);
app.use("/admin", adminRouter);
app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
});

connectDB().then(() => {
  console.log("--server start--");
  app.listen(8080);
});
