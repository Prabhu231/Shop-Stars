import pool from "../db/db.js";
import bcrypt from "bcrypt";

const registerUser = async ({ name, email, password, address }) => {
  try {
    if (!name || !email || !password || !address) {
      return { success: false, message: "All fields are required" };
    }

    if (address.length > 400) {
      return {
        success: false,
        message: "Address is too long (max 400 characters)",
      };
    }

    const emailCheck = await pool.query(
      'SELECT id FROM "user" WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return { success: false, message: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO "user" (name, email, password, address, role_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, hashedPassword, address, 2] // role_id = 2 for normal user
    );

    return { success: true, message: "User registered successfully" };
  } catch (err) {
    console.log("Register error:", err);
    return { success: false, message: "Server error during registration" };
  }
};

export default registerUser;
