import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

const config = {
  host: process.env.DB_HOST || "mysql-3c2cefe4-bahumukhi-realestate.d.aivencloud.com",
  port: parseInt(process.env.DB_PORT, 10) || 16899,
  user: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "defaultdb",
  ssl: { rejectUnauthorized: false },
  multipleStatements: true,
};

async function importDatabase() {
  console.log("🔄 Connecting to MySQL Database...");
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
          if (trimmed.startsWith("/*") && trimmed.endsWith("*/;")) return false;
          if (trimmed.startsWith("SET @") || trimmed.startsWith("SET @@")) return false;
          if (trimmed.startsWith("--")) return false;
          return true;
        })
        .join("\n") +
      "\nSET FOREIGN_KEY_CHECKS = 1;\n";

    console.log("📦 Importing tables...");
    await connection.query(cleanedSql);
    console.log("🎉 SUCCESS! All tables and data imported!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Import error:", err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

importDatabase();
