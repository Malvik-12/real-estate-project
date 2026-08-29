import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const isLocalhost =
  !process.env.DB_HOST ||
  process.env.DB_HOST === "localhost" ||
  process.env.DB_HOST === "127.0.0.1";

// Use connection pool with auto SSL detection for remote cloud databases (Aiven/Railway)
export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "real_estate",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: isLocalhost && process.env.DB_SSL !== "true" ? undefined : { rejectUnauthorized: false },
});

// Test connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Pool connection error:", err.message);
  } else {
    console.log("✅ MySQL Database connected successfully (Pool Ready)");
    connection.release();
  }
});