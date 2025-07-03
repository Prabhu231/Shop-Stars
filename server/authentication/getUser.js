import jwt from "jsonwebtoken";
import pool from "../db/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

const getUser = async (token) => {
  try {
    if (!token) {
      return {
        success: false,
        message: "Token is required",
        user: null,
      };
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const userResult = await pool.query(
      `
      SELECT u.name, u.email, r.name AS role
      FROM "user" u
      JOIN "role" r ON u.role_id = r.id
      WHERE u.id = $1
      `,
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return {
        success: false,
        message: "User not found",
        user: null,
      };
    }

    const user = userResult.rows[0];

    return {
      success: true,
      message: "User fetched successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (err) {
    console.error("GetUser error:", err);

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return {
        success: false,
        message: "Invalid or expired token",
        user: null,
      };
    }

    return {
      success: false,
      message: "Server error during token verification",
      user: null,
    };
  }
};

export default getUser;
