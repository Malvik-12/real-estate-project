import express from "express";
import { 
  addProperty, 
  getProperties, 
  getPropertyById, 
  updateProperty, 
  deleteProperty 
} from "../controllers/propertyController.js";

const router = express.Router();

// All these routes are prefixed by "/api/properties" from your app.js
router.post("/", addProperty);          // POST   /api/properties
router.get("/", getProperties);         // GET    /api/properties
router.get("/:id", getPropertyById);    // GET    /api/properties/1
router.put("/:id", updateProperty);     // PUT    /api/properties/1
router.delete("/:id", deleteProperty);  // DELETE /api/properties/1

export default router;