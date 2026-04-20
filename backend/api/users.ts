import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../src/db/client.js";
import { getUser } from "../src/repositories/users.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sql = getSql();

    // Accept both "username" and "user" (from your extension)
    const username = req.body.username ?? req.body.user;
    const password = req.body.password;
    const existingUser = await getUser(username)

    if (existingUser != null) {
      return res.status(400).json({
        error: "user already exists.",
      });
    }

    if (
      typeof username !== "string" ||
      username.trim() === "" ||
      typeof password !== "string" ||
      password.trim() === ""
    ) {
      return res.status(400).json({
        error: "username/user and password must be valid strings",
      });
    }

    // Neon uses tagged template queries (safe by default)
    const result = await sql`
      INSERT INTO book_records ("username", "password")
      VALUES (${username.trim()}, ${password})
      RETURNING 
        id,
        "username" AS username,
        "password" AS "password"
    `;

    return res.status(201).json({
      message: "User created successfully",
      user: result[0],
    });
  } catch (error) {
    console.error("Error inserting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}