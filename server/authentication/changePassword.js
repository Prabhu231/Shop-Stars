import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env.js";

const changePassword = async ({ token, oldPassword, newPassword }) => {
  try {
    console.log(token, oldPassword, newPassword);
    if (!token || !oldPassword || !newPassword) {
      return {
        success: false,
        message: "Token, old password, and new password are required",
      };
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return {
        success: false,
        message: "Invalid or expired token",
      };
    }

    const userId = decoded.id;

    const userResult = await pool.query(
      'SELECT id, password FROM "user" WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return { success: false, message: "Old password is incorrect" };
    }

    if (oldPassword === newPassword) {
      return {
        success: false,
        message: "New password must be different from old password",
      };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE "user" SET password = $1 WHERE id = $2', [
      hashedNewPassword,
      user.id,
    ]);

    return { success: true, message: "Password changed successfully" };
  } catch (err) {
    console.error("Change password error:", err);
    return { success: false, message: "Server error during password change" };
  }
};

export default changePassword;
