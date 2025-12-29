// server\src\index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Import middleware
import { requireAuth } from "./middleware/auth.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import resultRoutes from "./routes/result.routes.js";
import feeRoutes from "./routes/fees.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import assignmentRoutes from "./routes/assignments.routes.js";
// Note: removed chatRoutes, reportRoutes, exportRoutes if they don't exist

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes (require authentication)
app.use(requireAuth);  // Changed from authMiddleware to requireAuth

// Role-based routing
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/assignments", assignmentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.originalUrl} not found` 
  });
});

// Error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 AcademeX API running on http://localhost:${PORT}`);
});