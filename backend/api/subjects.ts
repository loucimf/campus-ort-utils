
import type { VercelRequest, VercelResponse } from "../src/http/vercel.js";
import { handleOptions } from "../src/http/cors.js";
import { internalError, json, methodNotAllowed } from "../src/http/responses.js";
import { getAllSubjects } from "../src/repositories/subjects.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (handleOptions(request, response)) {
        return;
    }
    
    console.log("api/subjects: HANDLING SUBJECT REQUEST")

    try {
        if (request.method === "GET") {
            const subjects = await getAllSubjects();

            json(request, response, 200, {
                ok: true,
                subjects,
            });
            return;
        }
        methodNotAllowed(request, response, ["GET", "OPTIONS"]);
    } catch (error) {
        if (error instanceof Error && error.message.includes("must be")) {
            json(request, response, 400, {
                ok: false,
                error: error.message,
            });
            return;
        }

        internalError(request, response, error);
    }
}
