import express from "express";
import "express-async-errors";
import * as questionRouter from "../controller/question.js";

const router = express.Router();

router.get("/", questionRouter.getQuestions);

export default router;
