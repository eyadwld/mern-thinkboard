import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

import User from "../models/User.js";

export const createAccount = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      throw error;
    }
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    const hashePassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashePassword });
    await newUser.save();
    res.status(201).json({
      message: "User created!",
      userId: newUser._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      throw error;
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Set token in an HttpOnly cookie — inaccessible to JavaScript (XSS-safe)
    res.cookie("token", token, {
      httpOnly: true,           // JS cannot read this cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict",       // CSRF protection
      maxAge: 60 * 60 * 1000,   // 1 hour, matches JWT expiry
    });

    res.status(200).json({
      message: "Login successful",
      userId: user._id.toString(), // token is in cookie, not in body
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out" });
};
