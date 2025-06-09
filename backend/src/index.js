import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"; // ✅ Required for resolving paths
import { fileURLToPath } from "url"; // ✅ Needed in ES module to get __dirname

// Route imports
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import aiRoute from "./routes/aiRoute.js";

dotenv.config();

// ✅ This is required in ES modules to simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Serve static files from React build
app.use(express.static(path.join(__dirname, "client", "dist")));

// ✅ Enable CORS for frontend URL
app.use(
  cors({
    origin: "https://code-drill-frontend.onrender.com",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Backend API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/ai", aiRoute);
app.use("/api/v1/playlist", playlistRoutes);

// ✅ Fallback to index.html for all client-side routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
