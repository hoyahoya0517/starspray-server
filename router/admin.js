import express from "express";
import "express-async-errors";
import { validate } from "../middleware/validator.js";
import { body } from "express-validator";
import { isAdmin } from "../middleware/isAdmin.js";
import * as adminController from "../controller/admin.js";
const router = express.Router();

const validateProduct = [
  body("name").trim().notEmpty().withMessage("물건의 이름을 입력하세요"),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("물건의 가격을 정확히 입력하세요"),
  body("img").trim().notEmpty().withMessage("물건의 사진을 입력하세요"),
  body("info").trim().notEmpty().withMessage("물건의 정보를 입력하세요"),
  body("qty").trim().notEmpty().withMessage("물건의 수량을 정확히 입력하세요"),
  body("size").trim().notEmpty().withMessage("물건의 사이즈를 입력하세요"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("물건의 카테고리를 입력하세요"),
  validate,
];

const validateOrder = [
  body("name").trim().notEmpty().withMessage("이름을 입력하세요"),
  body("phone").trim().notEmpty().withMessage("전화번호를 입력하세요"),
  body("zipcode").trim().notEmpty().withMessage("zipcode를 입력하세요"),
  body("address1").trim().notEmpty().withMessage("address1을 입력하세요"),
  body("address2").trim().notEmpty().withMessage("address2를 입력하세요"),
  body("complete").isBoolean().withMessage("complete을 정확히 입력하세요"),
  body("refund").isBoolean().withMessage("refund을 정확히 입력하세요"),
  body("shipping").trim().notEmpty().withMessage("shpping을 입력하세요"),
  validate,
];

const validateAuth = [
  body("name").trim().notEmpty().withMessage("이름을 입력하세요"),
  body("phone").trim().notEmpty().withMessage("전화번호를 입력하세요"),
  body("password").trim().notEmpty().withMessage("비밀번호를 입력하세요"),
  body("isAdmin").isBoolean().withMessage("isAdmin을 정확히 입력하세요"),
  validate,
];

router.post("/products", validateProduct, isAdmin, adminController.addProducts);
router.put(
  "/updateProduct",
  validateProduct,
  isAdmin,
  adminController.updateProduct
);
router.delete("/product/:id", isAdmin, adminController.deleteProduct);

router.get("/orders", isAdmin, adminController.getAllOrders);
router.put("/updateOrder", validateOrder, isAdmin, adminController.updateOrder);
router.delete("/order/:id", isAdmin, adminController.deleteOrder);
router.post("/order/refund", isAdmin, adminController.refundOrder);

router.get("/auth", isAdmin, adminController.getAllAuth);
router.put("/updateAuth", validateAuth, isAdmin, adminController.updateAuth);
router.delete("/auth/:id", isAdmin, adminController.deleteAuth);

export default router;
