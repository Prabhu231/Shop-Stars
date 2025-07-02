import { config } from "dotenv";
import express from "express";
import initDb from "./db/init.js";
import registerUser from "./authentication/register.js";
import { PORT } from "./env.js";
import cors from "cors";
initDb();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/login", (req, res) => {
  res.send("abc");
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

app.listen(Number(PORT || 8000), () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
