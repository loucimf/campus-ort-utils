import type { VercelResponse } from "./vercel.js";
import { applyCors } from "./cors.js";

export function json(response: VercelResponse, status: number, body: unknown) {
  applyCors(response);
  response.status(status).json(body);
}

export function methodNotAllowed(response: VercelResponse, allowedMethods: string[]) {
  response.setHeader("Allow", allowedMethods.join(", "));
  json(response, 405, {
    ok: false,
    error: "Method not allowed",
  });
}

export function internalError(response: VercelResponse, error: unknown) {
  console.error(error);
  json(response, 500, {
    ok: false,
    error: "Internal server error",
  });
}
