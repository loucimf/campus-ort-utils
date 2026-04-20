import { getSql } from "../db/client.js";
import { User } from "../models/database.js";


export async function createUser(username: string, password: string) {
    const sql = getSql()
    const user = await sql`INSERT INTO users (username, password) VALUES (${username}, ${password})`
    return user
}

export async function getUser(username: string): Promise<User | null> {
  const sql = getSql();

  const result = await sql`
    SELECT 
      id,
      username,
      password,
      grade,
      "gradeLetter",
      "majorId"
    FROM users
    WHERE username = ${username}
    LIMIT 1
  ` as User[];

  return result[0] ?? null;
}