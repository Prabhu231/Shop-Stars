import { config } from "dotenv";
import express from "express";
import initDb from "./db/init.js";
import registerUser from "./authentication/register.js";
import loginUser from "./authentication/login.js";
import getUser from "./authentication/getUser.js";
import changePassword from "./authentication/changePassword.js";
import { PORT } from "./env.js";
import cors from "cors";
initDb();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { success, message, token, user } = await loginUser({
      email,
      password,
    });
    console.log(email, password);
    console.log({ success, message, token, user });
    if (!success) {
      return res.status(400).json({ success: false, message });
    }

    return res.status(201).json({ success: true, message, token, user });
  } catch (error) {
    console.error("Unexpected error in /register:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password, address } = req.body;
  console.log(req.body);
  try {
    const { success, message } = await registerUser({
      name,
      email,
      password,
      address,
    });

    if (!success) {
      return res.status(400).json({ success: false, message });
    }

    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Unexpected error in /register:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.get("/user", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const { success, message, user } = await getUser(token);

    if (!success) {
      return res.status(400).json({ success: false, message });
    }

    return res.status(201).json({
      success: true,
      message,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Unexpected error in /register:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.post("/password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const authHeader = req.headers.authorization;
    console.log(oldPassword, newPassword, authHeader);
    const token = authHeader.split(" ")[1];
    const { success, message } = await changePassword({
      token,
      oldPassword,
      newPassword,
    });
    console.log(success, message);

    if (!success) {
      return res.status(400).json({ success: false, message });
    }

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.listen(Number(PORT || 8000), () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
