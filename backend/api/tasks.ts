import type { VercelRequest, VercelResponse } from "../src/http/vercel.js";
import { handleOptions } from "../src/http/cors.js";
import { internalError, json, methodNotAllowed } from "../src/http/responses.js";
import { createUserTask, deleteUserTask, getUserTasks, updateUserTaskStatus } from "../src/repositories/tasks.js";
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

function getRequiredText(value: unknown, name: string) {
    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`${name} is required.`);
    }

    return value.trim();
}

function getOptionalText(value: unknown) {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value !== "string") {
        throw new Error("description must be text.");
    }

    const text = value.trim();
    return text || null;
}

function getRequiredDate(value: unknown, name: string) {
    const date = getRequiredText(value, name);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00.000Z`))) {
        throw new Error(`${name} must be a valid date in YYYY-MM-DD format.`);
    }

    return date;
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

    console.log("api/tasks: HANDLING TASKS REQUEST")


    try {
        if (request.method === "GET") {
            const userId = getRequiredId(request.query.userId, "userId");
            const tasks = await getUserTasks(userId);
            
            json(request, response, 200, {
                ok: true,
                tasks,
            });
            return;
        }

        if (request.method === "POST") {
            const body = getBody(request.body);
            const task = await createUserTask({
                userId: getRequiredId(body.userId as string | string[] | undefined, "userId"),
                subjectId: getRequiredId(body.subjectId as string | string[] | undefined, "subjectId"),
                title: getRequiredText(body.title, "title"),
                description: getOptionalText(body.description),
                deliverDate: getRequiredDate(body.deliverDate, "deliverDate"),
            });

            json(request, response, 201, {
                ok: true,
                task,
            });
            return;
        }

        if (request.method === "PATCH") {
            const body = getBody(request.body);
            const userTaskId = getRequiredId(body.userTaskId as string | string[] | undefined, "userTaskId");
            const status = getStatus(body.status);
            const task = await updateUserTaskStatus(userTaskId, status);

            if (!task) {
                json(request, response, 404, {
                    ok: false,
                    error: "Task not found",
                });
                return;
            }

            json(request, response, 200, {
                ok: true,
                task,
            });
            return;
        }

        if (request.method === "DELETE") {
            const userTaskId = getRequiredId(request.query.userTaskId, "userTaskId");
            const deletedTask = await deleteUserTask(userTaskId);

            if (!deletedTask) {
                json(request, response, 404, {
                    ok: false,
                    error: "Task not found",
                });
                return;
            }

            json(request, response, 200, {
                ok: true,
                deletedTask,
            });
            return;
        }

        methodNotAllowed(request, response, ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]);
    } catch (error) {
        if (
            error instanceof Error
            && (error.message.includes("must be") || error.message.includes("is required"))
        ) {
            json(request, response, 400, {
                ok: false,
                error: error.message,
            });
            return;
        }

        internalError(request, response, error);
    }
}
