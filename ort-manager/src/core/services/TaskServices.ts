import type { TaskStatus, UserTaskWithDetails } from "@src/models/database";

export interface CreateTaskInput {
    userId: number;
    subjectId: number;
    title: string;
    description: string | null;
    deliverDate: string;
}

export class TaskService {
    private apiBaseUrl: string;

    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async getTasks(userId: string): Promise<UserTaskWithDetails[]> {
        const response = await fetch(`${this.apiBaseUrl}/tasks?userId=${encodeURIComponent(userId)}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }

        const data = await response.json() as {
            ok: boolean;
            tasks?: UserTaskWithDetails[];
            error?: string;
        };

        if (!data.ok || !data.tasks) {
            throw new Error(data.error ?? "Failed to fetch tasks");
        }

        return data.tasks;
    }

    async updateTaskStatus(userTaskId: number, status: TaskStatus) {
        const response = await fetch(`${this.apiBaseUrl}/tasks`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userTaskId, status }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update task: ${response.statusText}`);
        }

        return response.json();
    }

    async createTask(task: CreateTaskInput): Promise<UserTaskWithDetails> {
        const response = await fetch(`${this.apiBaseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });

        if (!response.ok) {
            throw new Error(`Failed to create task: ${response.statusText}`);
        }

        const data = await response.json() as {
            ok: boolean;
            task?: UserTaskWithDetails;
            error?: string;
        };

        if (!data.ok || !data.task) {
            throw new Error(data.error ?? "Failed to create task");
        }

        return data.task;
    }
}
