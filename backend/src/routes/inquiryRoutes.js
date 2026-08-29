import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createInquiry, getInquiries } from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/", createInquiry);          // Public: anyone can submit an inquiry
router.get("/", verifyToken, getInquiries); // Protected: only admin can view inquiries

export default router;