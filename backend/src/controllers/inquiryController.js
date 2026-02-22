import { db } from "../db/connection.js";

// POST: Customer submits an inquiry form
export const createInquiry = (req, res) => {
  const { name, email, phone, message, property_id } = req.body;

  // Basic validation
  if (!name || !email || !property_id) {
    return res.status(400).json({ error: "Name, email, and property ID are required." });
  }

  const sql = `INSERT INTO inquiries (name, email, phone, message, property_id) 
               VALUES (?, ?, ?, ?, ?)`;
  
  const values = [name, email, phone, message, property_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error saving inquiry:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "✅ Inquiry sent successfully!", inquiryId: result.insertId });
  });
};

// GET: Admin can view all inquiries (Optional but helpful)
export const getInquiries = (req, res) => {
  const sql = `
    SELECT i.*, p.title as property_name 
    FROM inquiries i 
    JOIN properties p ON i.property_id = p.id 
    ORDER BY i.created_at DESC`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};