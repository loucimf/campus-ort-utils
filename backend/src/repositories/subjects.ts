import { getSql } from "../db/client.js";

export async function getAllSubjects() {
    const sql = getSql()
    const rows = sql`
        select * from school_subjects
    `
}
