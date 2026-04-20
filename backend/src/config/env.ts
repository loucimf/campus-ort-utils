import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3001),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://127.0.0.1:5173",
  databaseUrl: process.env.DATABASE_URL,
};
