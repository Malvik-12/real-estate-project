import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Use connection pool for production resilience (auto-reconnect, handles concurrent traffic)
export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "real_estate",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
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