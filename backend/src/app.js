import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import { adminLogin } from "./middleware/auth.js";

const app = express();

// --- Path Setup for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Security Headers ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to load cross-origin
}));

// --- CORS Configuration ---
app.use(cors({
  origin: true,
  credentials: true,
}));

// --- Body Parsing ---
app.use(express.json({ limit: "1mb" }));

// --- Rate Limiting ---
// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// Strict rate limit for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: "Too many login attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for inquiry submissions
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: "Too many inquiries submitted. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Static File Serving ---
// This serves the entire "public" folder.
// Since your DB stores "/uploads/filename.jpg", the browser will request 
// http://localhost:5001/uploads/filename.jpg and Express will find it 
// inside the public/uploads folder.
app.use(express.static(path.join(__dirname, "../public")));

// --- Root Welcome Route ---
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Bahumukhi Real Estate API is Live 🚀",
    message: "Backend services are active.",
    health: "/health",
    properties: "/api/properties",
  });
});

// --- Health check ---
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Backend is running" });
});

// --- Admin Login Route ---
app.post("/api/admin/login", loginLimiter, adminLogin);

// --- API Routes ---
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryLimiter, inquiryRoutes);

export default app;