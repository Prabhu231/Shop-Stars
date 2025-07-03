import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env.js";

const loginUser = async ({ email, password }) => {
  try {
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
        token: null,
        user: null,
      };
    }

    const userResult = await pool.query(
      'SELECT id, name, email, password, role_id FROM "user" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return {
        success: false,
        message: "Invalid email or password",
        token: null,
        user: null,
      };
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid email or password",
        token: null,
        user: null,
      };
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(token);

    return {
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    };
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      message: "Server error during login",
      token: null,
      user: null,
    };
  }
};

export default loginUser;
