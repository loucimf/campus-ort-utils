import { getSql } from "../db/client.js";
import { User } from "../models/database.js";

interface UserRow {
  id: number;
  username: string;
  full_name: string | null;
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

interface UpdateUserProfileResult {
  status: "updated" | "skipped" | "not_found";
  user: User | null;
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    fullname: row.full_name ?? undefined,
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
    RETURNING id, username, full_name, password, grade, grade_letter, major_id
  `;
  const typedRows = user as UserRow[];
  return typedRows[0] ? mapUser(typedRows[0]) : null;
}

export async function getUser(username: string): Promise<User | null> {
  const sql = getSql();

  const result = await sql`
    SELECT id, username, full_name, password, grade, grade_letter, major_id
    FROM users
    WHERE username = ${username}
    LIMIT 1
  ` as UserRow[];

  return result[0] ? mapUser(result[0]) : null;
}

export async function updateUserProfileByUsername(input: UpdateUserProfileInput): Promise<UpdateUserProfileResult> {
  const sql = getSql();

  const existingUserRows = await sql`
    SELECT id, username, full_name, password, grade, grade_letter, major_id
    FROM users
    WHERE username = ${input.username}
    LIMIT 1
  ` as UserRow[];

  const existingUser = existingUserRows[0];

  if (!existingUser) {
    return {
      status: "not_found",
      user: null,
    };
  }

  if (existingUser.full_name !== null) {
    return {
      status: "skipped",
      user: mapUser(existingUser),
    };
  }

  const result = await sql`
    UPDATE users
    SET
      full_name = ${input.fullname},
      grade = ${input.grade},
      grade_letter = ${input.gradeLetter}
    WHERE username = ${input.username}
      AND full_name IS NULL
    RETURNING id, username, full_name, password, grade, grade_letter, major_id
  ` as UserRow[];

  return {
    status: "updated",
    user: result[0] ? mapUser(result[0]) : null,
  };
}
