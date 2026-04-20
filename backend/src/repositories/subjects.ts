import { getSql } from "../db/client.js";
import type { SchoolSubject } from "../models/database.js";

interface SchoolSubjectRow {
    id: number;
    name: string;
    code: string;
}

function mapSchoolSubject(row: SchoolSubjectRow): SchoolSubject {
    return {
        id: row.id,
        name: row.name,
        code: row.code,
    };
}

export async function getAllSubjects() {
    const sql = getSql();
    const rows = await sql`
        select id, name, code
        from school_subjects
        order by name asc
    `;

    return (rows as SchoolSubjectRow[]).map(mapSchoolSubject);
}
