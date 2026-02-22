import { db } from "../db/connection.js";

// CREATE: Add a new property
export const addProperty = (req, res) => {
  const { title, description, price, image_url, type } = req.body;
  const sql = "INSERT INTO properties (title, description, price, image_url, type) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [title, description, price, image_url, type], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Property created", id: result.insertId });
  });
};

// READ: Get all properties
export const getProperties = (req, res) => {
  db.query("SELECT * FROM properties", (err, results) => {
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

// UPDATE: Update a property by ID
export const updateProperty = (req, res) => {
  const { id } = req.params;
  const { title, description, price, image_url, type } = req.body;
  const sql = "UPDATE properties SET title=?, description=?, price=?, image_url=?, type=? WHERE id=?";
  db.query(sql, [title, description, price, image_url, type, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Property updated successfully" });
  });
};

// DELETE: Remove a property
export const deleteProperty = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM properties WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Property deleted successfully" });
  });
};