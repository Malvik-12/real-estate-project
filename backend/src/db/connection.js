import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// ── Parse connection params ───────────────────────────────────────────────────
let host = process.env.DB_HOST?.trim() || "localhost";
let port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
let user = process.env.DB_USER?.trim() || "root";
let password = process.env.DB_PASSWORD?.trim() || "";
let database = process.env.DB_NAME?.trim() || "real_estate";

// Handle "host:port" in DB_HOST
if (host.includes(":")) {
  const [h, p] = host.split(":");
  host = h;
  port = parseInt(p, 10) || port;
}

// Strip accidental surrounding quotes entered in the Render dashboard
if (
  (password.startsWith('"') && password.endsWith('"')) ||
  (password.startsWith("'") && password.endsWith("'"))
) {
  password = password.slice(1, -1);
}

const isLocalhost = host === "localhost" || host === "127.0.0.1";

console.log(
  `📡 [DB] Connecting to MySQL Host: ${host} | Port: ${port} | User: ${user} | DB: ${database} | PassLength: ${password.length} | SSL: ${!isLocalhost}`
);

// ── Connection pool ───────────────────────────────────────────────────────────
export const db = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,                                  // 20 s per attempt
  ssl: isLocalhost ? undefined : { rejectUnauthorized: false },
});

// ── Startup connectivity check with exponential-backoff retry ─────────────────
const MAX_RETRIES = 6;
const RETRY_BASE_MS = 3000; // 3 s, 6 s, 12 s … up to ~96 s total

function testConnection(attempt = 1) {
  db.getConnection((err, connection) => {
    if (err) {
      console.error(
        `❌ MySQL connection error (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`
      );
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_MS * Math.pow(2, attempt - 1);
        console.log(`🔄 Retrying in ${delay / 1000}s …`);
        setTimeout(() => testConnection(attempt + 1), delay);
      } else {
        console.error(
          "💀 Could not connect to MySQL after maximum retries. " +
          "Check that DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME " +
          "are set correctly in the Render dashboard AND that the Aiven IP " +
          "allowlist includes 0.0.0.0/0 (or Render's outbound IPs)."
        );
      }
    } else {
      console.log("✅ MySQL Database connected successfully (Pool Ready)");
      connection.release();
    }
  });
}

testConnection();