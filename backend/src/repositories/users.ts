import { getSql } from "../db/client.js";
import { User } from "../models/database.js";

export async function createUser(username: string, password: string) {
  const sql = getSql();
  const user = await sql`
    INSERT INTO users (username, password)
    VALUES (${username}, ${password})
    RETURNING id, username, password
  `;
  return user[0] ?? null;
}

export async function getUser(username: string): Promise<User | null> {
  const sql = getSql();

  const result = await sql`
    SELECT id, username, password
    FROM users
    WHERE username = ${username}
    LIMIT 1
  ` as User[];

  return result[0] ?? null;
}