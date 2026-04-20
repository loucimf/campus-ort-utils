import type { VercelRequest, VercelResponse } from "../src/http/vercel.js";
import { handleOptions } from "../src/http/cors.js";
import { json, methodNotAllowed } from "../src/http/responses.js";

export default function handler(request: VercelRequest, response: VercelResponse) {
    if (handleOptions(request, response)) {
        return;
    }

    if (request.method !== "GET") {
        methodNotAllowed(response, ["GET", "OPTIONS"]);
        return;
    }

    json(response, 200, {
        ok: true,
        service: "ort-manager-backend",
    });
}
