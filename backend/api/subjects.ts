
import type { VercelRequest, VercelResponse } from "../src/http/vercel.js";
import { handleOptions } from "../src/http/cors.js";
import { internalError, json, methodNotAllowed } from "../src/http/responses.js";
import { getAllSubjects } from "../src/repositories/subjects.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (handleOptions(request, response)) {
        return;
    }

    try {
        if (request.method === "GET") {
            const subjects = await getAllSubjects();

            json(response, 200, {
                ok: true,
                subjects,
            });
            return;
        }
        methodNotAllowed(response, ["GET", "OPTIONS"]);
    } catch (error) {
        if (error instanceof Error && error.message.includes("must be")) {
            json(response, 400, {
                ok: false,
                error: error.message,
            });
            return;
        }

        internalError(response, error);
    }
}
