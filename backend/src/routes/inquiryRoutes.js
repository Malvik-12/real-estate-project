import express from "express";
import { createInquiry, getInquiries } from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/", createInquiry); // POST /api/inquiries
router.get("/", getInquiries);   // GET /api/inquiries (for admin)

export default router;