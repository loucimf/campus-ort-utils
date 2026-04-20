import { getSql } from "../db/client.js";
import { User } from "../models/database.js";


export async function createUser(username: string, password: string) {
    const sql = getSql()
    const user = await sql`INSERT INTO users (username, password) VALUES (${username}, ${password})`
    return user
}