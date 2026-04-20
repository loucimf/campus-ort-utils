import dotenv from "dotenv";

dotenv.config();

const defaultFrontendOrigins = [
  "http://127.0.0.1:5173",
  "https://ort-manager.vercel.app",
];

function parseFrontendOrigins() {
  const configuredOrigins = [
    process.env.FRONTEND_ORIGIN,
  ]
    .filter(Boolean)
    .flatMap(origins => origins?.split(",") ?? [])
    .map(origin => origin.trim())
    .filter(Boolean);

  return [...new Set([...defaultFrontendOrigins, ...configuredOrigins])];
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  frontendOrigins: parseFrontendOrigins(),
  databaseUrl: process.env.DATABASE_URL,
};
