import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import notesRoutes from "./routes/notes.js";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/db.js";
import rateLimiter from "./middleware/rate-limiter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);

app.use((error, _req, res, _next) => {
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message });
});

connectDB().then(() => {
  app.listen(process.env.PORT || 5001, () => {
    console.log("Server is running on port 5001");
  });
});
