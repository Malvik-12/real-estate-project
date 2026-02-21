import { db } from "../db/connection.js";

export const getProperties = (req, res) => {
  db.query("SELECT * FROM properties", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};