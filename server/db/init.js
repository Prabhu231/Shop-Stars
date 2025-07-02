import fs from "fs/promises";
import path from "path";
import pool from "./db.js";

const initDb = async () => {
  try {
    const sqlPath = path.join(process.cwd(), "db", "init.sql");
    const sql = await fs.readFile(sqlPath, "utf8");

    await pool.query(sql);
    console.log("Tables initialized from init.sql");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
};

export default initDb;
