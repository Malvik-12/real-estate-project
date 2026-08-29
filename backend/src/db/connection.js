import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Parse Host & Port gracefully
let host = process.env.DB_HOST?.trim() || "localhost";
let port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 16899;
let user = process.env.DB_USER?.trim() || "avnadmin";
let password = process.env.DB_PASSWORD?.trim() || "";
let database = process.env.DB_NAME?.trim() || "defaultdb";

// Handle host:port strings
if (host.includes(":")) {
  const parts = host.split(":");
  host = parts[0];
  port = parseInt(parts[1], 10) || port;
}

// Strip surrounding quotes if user entered quotes in dashboard
if (
  (password.startsWith('"') && password.endsWith('"')) ||
  (password.startsWith("'") && password.endsWith("'"))
) {
  password = password.slice(1, -1);
}

const isLocalhost = host === "localhost" || host === "127.0.0.1";

console.log(`📡 [DB] Connecting to MySQL Host: ${host} | Port: ${port} | User: ${user} | DB: ${database} | SSL: ${!isLocalhost}`);

// Create resilient connection pool
export const db = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: isLocalhost ? undefined : { rejectUnauthorized: false },
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