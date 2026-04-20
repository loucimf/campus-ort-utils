import type { VercelRequest, VercelResponse } from "../../src/http/vercel.js";
import { getSql } from "../../src/db/client.js";
import { handleOptions } from "../../src/http/cors.js";
import { internalError, json, methodNotAllowed } from "../../src/http/responses.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (handleOptions(request, response)) {
    return;
  }

  if (request.method !== "GET") {
    methodNotAllowed(response, ["GET", "OPTIONS"]);
    return;
  }

  try {
    const sql = getSql();
    const rows = await sql`select now() as now`;
    const typedRows = rows as { now: string }[];

    json(response, 200, {
      ok: true,
      now: typedRows[0]?.now,
    });
  } catch (error) {
    internalError(response, error);
  }
}
