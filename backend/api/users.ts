import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../src/db/client.js";
import { getUser } from "../src/repositories/users.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  console.log("api/users: HANDLING USER REQUEST");
  console.log("api/users: method =", req.method);
  console.log("api/users: body =", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sql = getSql();

    const username = req.body.username ?? req.body.user;
    const password = req.body.password;

    console.log("api/users: parsed =", { username, password });

    if (
      typeof username !== "string" ||
      username.trim() === "" ||
      typeof password !== "string" ||
      password.trim() === ""
    ) {
      console.log("api/users: FAILED, INVALID DATA");
      return res.status(400).json({
        error: "username/user and password must be valid strings"
      });
    }

    const existingUser = await getUser(username.trim());

    console.log("api/users: existingUser =", existingUser);

    if (existingUser != null) {
      console.log("api/users: FAILED, USER ALREADY EXISTS");
      return res.status(400).json({
        error: "user already exists."
      });
    }

    const result = await sql`
      INSERT INTO users (username, password)
      VALUES (${username.trim()}, ${password.trim()})
      RETURNING id, username, password
    `;

    console.log("api/users: CREATED USER", result[0]);

    return res.status(201).json({
      message: "User created successfully",
      user: result[0]
    });
  } catch (error) {
    console.error("api/users: ERROR =", error);

    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}