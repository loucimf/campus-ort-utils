

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (handleOptions(request, response)) {
        return;
    }

    try {
        if (request.method === "GET") {
            const tasks = await getAllSubjects();

            json(response, 200, {
                ok: true,
                tasks,
            });
            return;
        }
        methodNotAllowed(response, ["GET", "PATCH", "DELETE", "OPTIONS"]);
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