



import type { TaskStatus, UserTaskWithDetails } from "@src/models/database";

export class SchoolSubjectServices {
    private apiBaseUrl: string;

    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async getAllSubjects(userId: string): Promise<SchoolSubject[]> {
        const response = await fetch(`${this.apiBaseUrl}/subjects`);

        if (!response.ok) {
            throw new Error(`Failed to fetch SchoolSubject: ${response.statusText}`);
        }

        const data = await response.json() as {
            ok: boolean;
            subjects?: SchoolSubject[];
            error?: string;
        };

        if (!data.ok || !data.tasks) {
            throw new Error(data.error ?? "Failed to fetch SchoolSubject");
        }

        return data.tasks;
    }
}
