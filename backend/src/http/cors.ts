import type { VercelRequest, VercelResponse } from "./vercel.js";
import { env } from "../config/env.js";

export function applyCors(response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Origin", env.frontendOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export function handleOptions(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "OPTIONS") {
    return false;
  }

  applyCors(response);
  response.status(204).end();
  return true;
}
