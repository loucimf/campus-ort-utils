import type { VercelRequest, VercelResponse } from "./vercel.js";
import { applyCors } from "./cors.js";

export function json(request: VercelRequest, response: VercelResponse, status: number, body: unknown) {
  applyCors(request, response);
  response.status(status).json(body);
}

export function methodNotAllowed(request: VercelRequest, response: VercelResponse, allowedMethods: string[]) {
  response.setHeader("Allow", allowedMethods.join(", "));
  json(request, response, 405, {
    ok: false,
    error: "Method not allowed",
  });
}

export function internalError(request: VercelRequest, response: VercelResponse, error: unknown) {
  console.error(error);
  json(request, response, 500, {
    ok: false,
    error: "Internal server error",
  });
}
