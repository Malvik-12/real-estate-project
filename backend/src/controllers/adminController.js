// src/controllers/adminController.js
import { db } from "../db/connection.js";

// Add new property
export const addProperty = (req, res) => {
  const { title, description, price, image_url, category } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ error: "Title, price, and category are required." });
  }

  const sql = `
    INSERT INTO properties (title, description, price, image_url, category)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [title, description, price, image_url, category], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Property added successfully", propertyId: result.insertId });
  });
};

// Optional: Get properties by category
export const getPropertiesByCategory = (req, res) => {
  const { category } = req.params;
  const sql = "SELECT * FROM properties WHERE category = ?";
  db.query(sql, [category], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Optional: Update property
export const updateProperty = (req, res) => {
  const { id } = req.params;
  const { title, description, price, image_url, category } = req.body;

  const sql = `
    UPDATE properties
    SET title=?, description=?, price=?, image_url=?, category=?
    WHERE id=?
  `;
  db.query(sql, [title, description, price, image_url, category, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Property updated successfully" });
  });
};

// Optional: Delete property
export const deleteProperty = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM properties WHERE id=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Property deleted successfully" });
  });
};