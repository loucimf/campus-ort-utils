import type { VercelRequest, VercelResponse } from "./vercel.js";
import { env } from "../config/env.js";

function resolveAllowedOrigin(request: VercelRequest) {
  const requestOrigin = request.headers?.origin;

  if (typeof requestOrigin === "string" && env.frontendOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return env.frontendOrigins[0] ?? "http://127.0.0.1:5173";
}

export function applyCors(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Origin", resolveAllowedOrigin(request));
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.setHeader("Vary", "Origin");
}

export function handleOptions(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "OPTIONS") {
    return false;
  }

  applyCors(request, response);
  response.status(204).end();
  return true;
}
