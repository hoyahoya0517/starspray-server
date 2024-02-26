import express from "express";
import "express-async-errors";

const router = express.Router();

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("Health Check Page");
  res.end();
});

export default router;
