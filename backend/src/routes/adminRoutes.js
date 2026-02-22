// src/routes/adminRoutes.js
import express from "express";
import { addProperty } from "../controllers/adminController.js"; // or propertyController.js

const router = express.Router();

// Admin adds a property
router.post("/properties", addProperty);

export default router;