import cors from "cors";
import express from "express";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Backend is running" });
});

// Property routes
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);

export default app;