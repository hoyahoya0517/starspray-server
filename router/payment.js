import express from "express";
import "express-async-errors";
import { isAuth } from "../middleware/auth.js";
import * as paymentController from "../controller/payment.js";

const router = express.Router();

router.post("/newOrder", isAuth, paymentController.newOrder);
router.get("/complete", isAuth, paymentController.complete);

export default router;
