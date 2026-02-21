import express from "express";
import cors from "cors";
import propertyRoutes from "./routes/propertyRoutes.js"; // Make sure this file exists

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

export default app;