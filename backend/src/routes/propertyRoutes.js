import express from "express";
import multer from "multer";
import path from "path";
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
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// --- 2. Routes ---
router.get("/", getProperties);
router.get("/:id", getPropertyById);

const uploadMiddleware = (req, res, next) => {
  upload.array("images", 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File is too large. Max limit is 10MB." });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: "Unknown upload error." });
    }
    next();
  });
};

router.post("/", uploadMiddleware, addProperty);
router.put("/:id", uploadMiddleware, updateProperty);
router.delete("/:id", deleteProperty);

export default router;