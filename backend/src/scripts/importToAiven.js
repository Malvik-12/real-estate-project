import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_PASSWORD) {
  console.error("❌ DB_PASSWORD environment variable is not set. Aborting import.");
  process.exit(1);
}

const config = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "defaultdb",
  ssl: { rejectUnauthorized: false },
  multipleStatements: true,
};

async function importDatabase() {
  console.log(`🔄 Connecting to MySQL at ${config.host}:${config.port} ...`);
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log("✅ Connected successfully!");

    const sqlPath = path.join(process.cwd(), "../database_dump.sql");
    let rawSql = fs.readFileSync(sqlPath, "utf8");

    const cleanedSql =
      "SET FOREIGN_KEY_CHECKS = 0;\n" +
      rawSql
        .split("\n")
        .filter((line) => {
          const trimmed = line.trim();
          // Strip MySQL dump directives that require SUPER privilege or are incompatible with Aiven
          if (trimmed.startsWith("/*") && trimmed.endsWith("*/;")) return false;
          if (trimmed.startsWith("SET @")) return false;
          if (trimmed.startsWith("SET @@SESSION.")) return false;
          if (trimmed.startsWith("SET @@GLOBAL.")) return false;   // ← fixes GTID_PURGED
          if (trimmed.startsWith("SET @@")) return false;           // catch-all for other @@ vars
          if (trimmed.startsWith("--")) return false;
          if (trimmed.startsWith("LOCK TABLES")) return false;
          if (trimmed.startsWith("UNLOCK TABLES")) return false;
          return true;
        })
        .join("\n") +
      "\nSET FOREIGN_KEY_CHECKS = 1;\n";

    console.log("📦 Importing tables and data...");
    await connection.query(cleanedSql);
    console.log("🎉 SUCCESS! All tables and data imported to Aiven!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Import error:", err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

importDatabase();


