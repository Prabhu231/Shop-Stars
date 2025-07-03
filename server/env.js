import { config } from "dotenv";
config();

export const {
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  PORT,
  JWT_SECRET,
} = process.env;
