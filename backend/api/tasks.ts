import type { VercelRequest, VercelResponse } from "../src/http/vercel.js";
import { handleOptions } from "../src/http/cors.js";
import { internalError, json, methodNotAllowed } from "../src/http/responses.js";
import { deleteUserTask, getUserTasks, updateUserTaskStatus } from "../src/repositories/tasks.js";
import type { TaskStatus } from "../src/models/database.js";

const taskStatuses = new Set<TaskStatus>(["Pending", "Completed", "Overdue"]);

function getRequiredId(value: string | string[] | undefined, name: string) {
    const rawValue = Array.isArray(value) ? value[0] : value;
    const id = Number(rawValue);

    if (!rawValue || !Number.isInteger(id) || id <= 0) {
        throw new Error(`${name} must be a positive integer.`);
    }

    return id;
}

function getStatus(value: unknown) {
    if (typeof value !== "string" || !taskStatuses.has(value as TaskStatus)) {
        throw new Error("status must be Pending, Completed, or Overdue.");
    }

    return value as TaskStatus;
}

function getBody(body: unknown) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return {};
    }

    return body as Record<string, unknown>;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (handleOptions(request, response)) {
        return;
    }

    try {
        if (request.method === "GET") {
            const userId = getRequiredId(request.query.userId, "userId");
            const tasks = await getUserTasks(userId);

            json(response, 200, {
                ok: true,
                tasks,
            });
            return;
        }

        if (request.method === "PATCH") {
            const body = getBody(request.body);
            const userTaskId = getRequiredId(body.userTaskId as string | string[] | undefined, "userTaskId");
            const status = getStatus(body.status);
            const task = await updateUserTaskStatus(userTaskId, status);

            if (!task) {
                json(response, 404, {
                    ok: false,
                    error: "Task not found",
                });
                return;
            }

            json(response, 200, {
                ok: true,
                task,
            });
            return;
        }

        if (request.method === "DELETE") {
            const userTaskId = getRequiredId(request.query.userTaskId, "userTaskId");
            const deletedTask = await deleteUserTask(userTaskId);

            if (!deletedTask) {
                json(response, 404, {
                    ok: false,
                    error: "Task not found",
                });
                return;
            }

            json(response, 200, {
                ok: true,
                deletedTask,
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
