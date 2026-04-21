import { getSql } from "../db/client.js";
import { User } from "../models/database.js";

interface UserRow {
  id: number;
  username: string;
  fullname: string | null;
  password: string;
  grade: number | null;
  grade_letter: string | null;
  major_id: number | null;
}

interface UpdateUserProfileInput {
  username: string;
  fullname: string;
  grade: number;
  gradeLetter: string;
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    fullname: row.fullname ?? undefined,
    password: row.password,
    grade: row.grade ?? undefined,
    gradeLetter: row.grade_letter ?? undefined,
    majorId: row.major_id,
  };
}

export async function createUser(username: string, password: string) {
  const sql = getSql();
  const user = await sql`
    INSERT INTO users (username, password)
    VALUES (${username}, ${password})
    RETURNING id, username, fullname, password, grade, grade_letter, major_id
  `;
  const typedRows = user as UserRow[];
  return typedRows[0] ? mapUser(typedRows[0]) : null;
}

export async function getUser(username: string): Promise<User | null> {
  const sql = getSql();

  const result = await sql`
    SELECT id, username, fullname, password, grade, grade_letter, major_id
    FROM users
    WHERE username = ${username}
    LIMIT 1
  ` as UserRow[];

  return result[0] ? mapUser(result[0]) : null;
}

export async function updateUserProfileByUsername(input: UpdateUserProfileInput): Promise<User | null> {
  const sql = getSql();

  const result = await sql`
    UPDATE users
    SET
      fullname = ${input.fullname},
      grade = ${input.grade},
      grade_letter = ${input.gradeLetter}
    WHERE username = ${input.username}
    RETURNING id, username, fullname, password, grade, grade_letter, major_id
  ` as UserRow[];

  return result[0] ? mapUser(result[0]) : null;
}
