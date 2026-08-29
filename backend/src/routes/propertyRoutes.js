import express from "express";
import multer from "multer";
import path from "path";
import { verifyToken } from "../middleware/auth.js";
import {
  getProperties,
  getPropertyById,
  addProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

// --- 1. Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); 
  },
  filename: (req, file, cb) => {
    // Force lowercase extension to avoid case-sensitivity issues
    const ext = path.extname(file.originalname).toLowerCase(); 
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e6) + ext);
  },
});

// --- File filter: only allow image types ---
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, WebP, GIF) are allowed."), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// --- 2. Routes ---

// Public: anyone can view properties
router.get("/", getProperties);
router.get("/:id", getPropertyById);

const uploadMiddleware = (req, res, next) => {
  upload.array("images", 15)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File is too large. Max limit is 10MB." });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// Protected: only authenticated admin can create/update/delete
router.post("/", verifyToken, uploadMiddleware, addProperty);
router.put("/:id", verifyToken, uploadMiddleware, updateProperty);
router.delete("/:id", verifyToken, deleteProperty);

export default router;