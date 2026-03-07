import { db } from "../db/connection.js";
import fs from "fs";
import path from "path";

// CREATE: Add a new property with MULTIPLE Image Uploads
export const addProperty = (req, res) => {
  // 1. Added 'parking' to destructuring
  const { title, description, price, type, location, area, beds, parking } = req.body;
  
  const image_urls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  // 2. UPDATED: Added 'parking' column and a 9th '?' placeholder
  const sql = "INSERT INTO properties (title, description, price, image_url, type, location, area, beds, parking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
  db.query(sql, [
    title, 
    description, 
    price, 
    JSON.stringify(image_urls), 
    type, 
    location, 
    area || "0-0-0-0", 
    beds || 0,
    parking || "No Parking" // 3. Added parking value
  ], (err, result) => {
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
  // 4. Added 'parking' to destructuring
  const { title, description, price, type, location, area, beds, parking } = req.body;
  
  let image_url = req.body.image_url; 
  if (req.files && req.files.length > 0) {
    image_url = JSON.stringify(req.files.map(file => `/uploads/${file.filename}`));
  }

  // 5. UPDATED: Added 'parking=?' to the UPDATE statement and adjusted parameters
  const sql = "UPDATE properties SET title=?, description=?, price=?, image_url=?, type=?, location=?, area=?, beds=?, parking=? WHERE id=?";
  
  db.query(sql, [
    title, 
    description, 
    price, 
    image_url, 
    type, 
    location, 
    area, 
    beds, 
    parking, // 6. Added parking to the array
    id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property updated successfully" });
  });
};

// DELETE: Remove property and ALL associated physical files
export const deleteProperty = (req, res) => {
  const { id } = req.params;

  db.query("SELECT image_url FROM properties WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Property not found" });

    let imageUrls = result[0].image_url;
    
    try {
      if (typeof imageUrls === 'string') {
        imageUrls = JSON.parse(imageUrls);
      }
    } catch (e) {
      imageUrls = [];
    }

    db.query("DELETE FROM properties WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      if (Array.isArray(imageUrls)) {
        imageUrls.forEach((url) => {
          const filePath = path.join(process.cwd(), "public", url);
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) console.error("Could not delete file:", url);
            });
          }
        });
      }
      res.json({ message: "Property and all associated images deleted" });
    });
  });
};