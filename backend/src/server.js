import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import notesRoutes from "./routes/notes.js";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/db.js";
import rateLimiter from "./middleware/rate-limiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve(); // this is needed because we are using ES modules and __dirname is not available by default so we need to use path.resolve() to get the current directory path and resolve function is used to resolve the path of the current directory.

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.use(rateLimiter);

app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // we use this in production to serve the static files from the frontend build folder. The path.join() method is used to join the current directory path with the frontend build folder path and express.static() method is used to serve the static files from the build folder.

  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  }); // this is needed because we are using React Router and we need to serve the index.html file for all the routes that are not defined in the backend.
}

app.use((error, _req, res, _next) => {
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port 5001");
  });
});
