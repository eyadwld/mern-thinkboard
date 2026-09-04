import express from "express";
import { body } from "express-validator";

import {
  getNotes,
  createNotes,
  updateNotes,
  deleteNotes,
  getNoteByID,
} from "../controllers/notes.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.get("/", isAuth, getNotes);

router.get("/:id", isAuth, getNoteByID);

router.post(
  "/",
  isAuth,
  [
    body("title").trim().notEmpty().isLength({ min: 5 }),
    body("content").trim().notEmpty().isLength({ min: 10 }),
  ],
  createNotes,
);

router.put(
  "/:id",
  isAuth,
  [
    body("title").trim().notEmpty().isLength({ min: 5 }),
    body("content").trim().notEmpty().isLength({ min: 10 }),
  ],
  updateNotes,
);

router.delete("/:id", isAuth, deleteNotes);

export default router;
