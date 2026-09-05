import fs from "fs";
import path from "path";
import { db } from "../db/connection.js";

// ── Helper: safely parse image_url to array (handles auto-parsed JSON objects) ─
const parseImages = (image_url) => {
  if (!image_url) return [];
  if (Array.isArray(image_url)) return image_url;
  try { return JSON.parse(image_url); } catch { return []; }
};

// ── CREATE: Add a new property with MULTIPLE Image Uploads ────────────────────
export const addProperty = (req, res) => {
  const { title, description, price, type, location, area, beds, parking } = req.body;

  if (!title || !price || !type) {
    return res.status(400).json({ error: "Title, price, and type are required." });
  }

  const image_urls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  const sql = `INSERT INTO properties
    (title, description, price, image_url, type, location, area, beds, parking)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    title,
    description,
    price,
    JSON.stringify(image_urls),
    type,
    location,
    area || "0-0-0-0",
    beds || 0,
    parking || 0,
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Property created", id: result.insertId, image_urls });
  });
};

// ── READ: Get all properties (supports ?type= and ?limit= query params) ───────
export const getProperties = (req, res) => {
  const { type, limit } = req.query;

  let sql = "SELECT * FROM properties";
  const params = [];

  if (type) {
    sql += " WHERE type = ?";
    params.push(type);
  }

  sql += " ORDER BY id DESC";

  if (limit) {
    const cap = Math.min(parseInt(limit, 10) || 50, 200);
    sql += " LIMIT ?";
    params.push(cap);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Normalize image_url to array on every row so clients never deal with raw JSON strings
    const normalized = results.map(row => ({
      ...row,
      image_url: parseImages(row.image_url),
    }));

    res.json(normalized);
  });
};

// ── READ: Get a single property by ID ─────────────────────────────────────────
export const getPropertyById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM properties WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Property not found" });

    const row = result[0];
    res.json({ ...row, image_url: parseImages(row.image_url) });
  });
};

// ── UPDATE: Safely update property; preserve images when no new file uploaded ──
export const updateProperty = (req, res) => {
  const { id } = req.params;
  const { title, description, price, type, location, area, beds, parking } = req.body;

  const performUpdate = (imageUrlJson) => {
    const sql = `UPDATE properties
      SET title=?, description=?, price=?, image_url=?, type=?, location=?, area=?, beds=?, parking=?
      WHERE id=?`;

    db.query(sql, [
      title, description, price, imageUrlJson,
      type, location, area, beds, parking, id,
    ], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Property not found" });
      res.json({ message: "Property updated successfully" });
    });
  };

  if (req.files && req.files.length > 0) {
    // New files uploaded — use them
    const newUrls = req.files.map(file => `/uploads/${file.filename}`);
    performUpdate(JSON.stringify(newUrls));
  } else if (req.body.image_url) {
    // Client explicitly sent existing image_url string
    performUpdate(req.body.image_url);
  } else {
    // No new files, no body image_url — fetch existing value to avoid wiping images
    db.query("SELECT image_url FROM properties WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(404).json({ message: "Property not found" });

      const existing = result[0].image_url;
      const imageUrlJson = Array.isArray(existing)
        ? JSON.stringify(existing)
        : existing || "[]";
      performUpdate(imageUrlJson);
    });
  }
};

// ── DELETE: Remove property and ALL associated physical files ─────────────────
export const deleteProperty = (req, res) => {
  const { id } = req.params;

  db.query("SELECT image_url FROM properties WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Property not found" });

    const imageUrls = parseImages(result[0].image_url);

    db.query("DELETE FROM properties WHERE id = ?", [id], (delErr) => {
      if (delErr) return res.status(500).json({ error: delErr.message });

      imageUrls.forEach((url) => {
        const filePath = path.join(process.cwd(), "public", url);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("Could not delete file:", url);
          });
        }
      });

      res.json({ message: "Property and all associated images deleted" });
    });
  });
};