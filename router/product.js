import express from "express";
import "express-async-errors";
import * as productController from "../controller/product.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/cart", isAuth, productController.getProductByCart);
router.get("/order/:id", isAuth, productController.getProductByOrder);
router.get("/:id", productController.getProduct);
router.get("/cart/check", isAuth, productController.checkCart);
router.post("/cart/complete", isAuth, productController.payCompleteCart);

export default router;
