import { db } from "../db/connection.js";
import fs from "fs";
import path from "path";

// CREATE: Add a new property with MULTIPLE Image Uploads
export const addProperty = (req, res) => {
  const { title, description, price, type } = req.body;
  
  // Multer puts multiple files in req.files
  // We map them to an array of strings: ["/uploads/1.jpg", "/uploads/2.jpg"]
  const image_urls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  const sql = "INSERT INTO properties (title, description, price, image_url, type) VALUES (?, ?, ?, ?, ?)";
  
  // IMPORTANT: We must stringify the array so MySQL accepts it into the JSON column
  db.query(sql, [title, description, price, JSON.stringify(image_urls), type], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Property created", id: result.insertId, image_urls });
  });
};

// READ: Get all properties
export const getProperties = (req, res) => {
  db.query("SELECT * FROM properties ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// READ: Get a single property by ID
export const getPropertyById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM properties WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Property not found" });
    res.json(result[0]);
  });
};

// UPDATE: Update property and optionally add NEW images
export const updateProperty = (req, res) => {
  const { id } = req.params;
  const { title, description, price, type } = req.body;
  
  // Logic: If new files are uploaded, use them. Otherwise, use existing images from body.
  let image_url = req.body.image_url; 
  if (req.files && req.files.length > 0) {
    image_url = JSON.stringify(req.files.map(file => `/uploads/${file.filename}`));
  }

  const sql = "UPDATE properties SET title=?, description=?, price=?, image_url=?, type=? WHERE id=?";
  
  db.query(sql, [title, description, price, image_url, type, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property updated successfully" });
  });
};

// DELETE: Remove property and ALL associated physical files
export const deleteProperty = (req, res) => {
  const { id } = req.params;

  // 1. Get the JSON array of images before deleting the DB record
  db.query("SELECT image_url FROM properties WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Property not found" });

    const imageUrls = result[0].image_url; // This will be an array since it's a JSON column

    // 2. Delete from Database
    db.query("DELETE FROM properties WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // 3. Delete every file in the array from the public/uploads folder
      if (Array.isArray(imageUrls)) {
        imageUrls.forEach((url) => {
          const filePath = path.join(process.cwd(), "public", url);
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("Could not delete file:", url);
          });
        });
      }
      res.json({ message: "Property and all associated images deleted" });
    });
  });
};