import express from "express";
import { body } from "express-validator";

import { createAccount, login, logout } from "../controllers/auth.js";

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").trim().notEmpty().isLength({ min: 5 }),

    body("email").isEmail().notEmpty().normalizeEmail(),

    body("password").trim().notEmpty().isLength({ min: 8 }),

    body("confirmPassword")
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        return value === req.body.password;
      }),
  ],
  createAccount,
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  login,
);

router.post("/logout", logout);

export default router;
