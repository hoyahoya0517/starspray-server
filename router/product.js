import express from "express";
import "express-async-errors";
import * as productController from "../controller/product.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/category/:category", productController.getProducts);
router.get("/detail/:id", productController.getProduct);
router.get("/cart", isAuth, productController.getProductByCart);
router.post("/cart/check", isAuth, productController.checkCart);
// router.post("/cart/complete", isAuth, productController.payCompleteCart);
router.get("/order/:id", isAuth, productController.getProductByOrder);

export default router;
