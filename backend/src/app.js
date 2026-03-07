import cors from "cors";
import express from "express";
import path from "path"; // 1. Import path
import { fileURLToPath } from "url"; // 2. Import url helper
import inquiryRoutes from "./routes/inquiryRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";

const app = express();

// --- Path Setup for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// --- STATIC FILE SERVING ---
// This serves the entire "public" folder.
// Since your DB stores "/uploads/filename.jpg", the browser will request 
// http://localhost:5001/uploads/filename.jpg and Express will find it 
// inside the public/uploads folder.
app.use(express.static(path.join(__dirname, "../public")));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Backend is running" });
});

// Property routes
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);

export default app;