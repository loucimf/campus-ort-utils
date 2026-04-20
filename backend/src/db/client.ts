import { neon } from "@neondatabase/serverless";
import { env } from "../config/env.js";

export function getSql() {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is required to connect to Neon.");
  }

  return neon(env.databaseUrl);
}
