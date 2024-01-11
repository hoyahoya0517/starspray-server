import express from "express";
import "express-async-errors";
import * as authController from "../controller/auth.js";
import { validate } from "../middleware/validator.js";
import { body } from "express-validator";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

const validateEmail = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("이메일을 입력하세요")
    .isEmail()
    .withMessage("이메일 양식에 맞게 입력하세요"),
  validate,
];

const validatePassword = [
  body("password")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("비밀번호를 입력하세요(6자 이상 20자 이하)"),
  validate,
];

const validateCredential = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("이메일을 입력하세요")
    .isEmail()
    .withMessage("이메일 양식에 맞게 입력하세요"),
  body("password")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("비밀번호를 입력하세요(6자 이상 20자 이하)"),
  validate,
];

const validateSignup = [
  body("name").trim().notEmpty().withMessage("이름을 입력하세요"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("전화번호를 입력하세요")
    .isMobilePhone()
    .withMessage("전화번호 양식에 맞게 입력하세요"),
  ...validateCredential,
];

const validateUpdateProfile = [
  body("name").trim().notEmpty().withMessage("이름을 입력하세요"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("전화번호를 입력하세요")
    .isMobilePhone()
    .withMessage("전화번호 양식에 맞게 입력하세요"),
  body("zipcode")
    .trim()
    .notEmpty()
    .withMessage("주소를 입력하세요")
    .optional({ nullable: true, checkFalsy: true }),
  body("address1")
    .trim()
    .notEmpty()
    .withMessage("주소를 입력하세요")
    .optional({ nullable: true, checkFalsy: true }),
  body("address2")
    .trim()
    .notEmpty()
    .withMessage("상세주소를 입력하세요")
    .optional({ nullable: true, checkFalsy: true }),
  body("oldPassword")
    .isLength({ min: 6, max: 20 })
    .withMessage("원래 비밀번호를 입력하세요(6자 이상 20자 이하)")
    .optional({ nullable: true, checkFalsy: true }),
  body("newPassword")
    .isLength({ min: 6, max: 20 })
    .withMessage("변경할 비밀번호를 입력하세요(6자 이상 20자 이하)")
    .optional({ nullable: true, checkFalsy: true }),
  validate,
];

router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateCredential, authController.login);
router.post("/logout", authController.logout);

/*----------------------------------*/

router.get("/getUserInfo", isAuth, authController.getUserInfo);
router.put(
  "/updateProfile",
  validateUpdateProfile,
  isAuth,
  authController.updateProfile
);
router.post("/resetPassword", validateEmail, authController.resetPassword);
router.post(
  "/settingPassword/:token",
  validatePassword,
  authController.settingPassword
);

/*----------------------------------*/

router.post("/cart", isAuth, authController.addCart);
router.put("/cart", isAuth, authController.updateCart);

/*----------------------------------*/

router.get("/me", isAuth, authController.me);
router.get("/csrf-token", authController.csrfToken);

/*----------------------------------*/

export default router;
