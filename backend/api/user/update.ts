import type { VercelRequest, VercelResponse } from "@vercel/node";
import { updateUserProfileByUsername } from "../../src/repositories/users.js";

interface LoggedDataPayload {
  nombre?: unknown;
  nombreJerarquia?: unknown;
}

function getRequiredText(value: unknown, name: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name} is required.`);
  }

  return value.trim();
}

function parseLoggedDataResponse(responseText: string): LoggedDataPayload {
  let parsed: unknown;

  try {
    parsed = JSON.parse(responseText);
  } catch (_error) {
    throw new Error("responseText must be valid JSON.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("responseText must contain an object.");
  }

  return parsed as LoggedDataPayload;
}

function normalizeFullname(nombre: unknown) {
  if (typeof nombre !== "string" || !nombre.trim()) {
    throw new Error("responseText.nombre must be a non-empty string.");
  }

  const fullname = nombre
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!fullname) {
    throw new Error("responseText.nombre could not be parsed.");
  }

  return fullname;
}

function parseGradeData(nombreJerarquia: unknown) {
  if (typeof nombreJerarquia !== "string" || !nombreJerarquia.trim()) {
    throw new Error("responseText.nombreJerarquia must be a non-empty string.");
  }

  const tokens = nombreJerarquia.trim().split(/\s+/).filter(Boolean);
  const lastToken = tokens[tokens.length - 1];

  if (!lastToken) {
    throw new Error("responseText.nombreJerarquia could not be parsed.");
  }

  const match = lastToken.match(/(\d+)([A-Za-z]+)$/);

  if (!match) {
    throw new Error("responseText.nombreJerarquia must end with grade digits and letters.");
  }

  const grade = Number(match[1]);
  const gradeLetter = match[2].toUpperCase();

  if (!Number.isInteger(grade) || grade <= 0) {
    throw new Error("responseText.nombreJerarquia contains an invalid grade.");
  }

  return {
    grade,
    gradeLetter,
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  console.log("api/logged-data: HANDLING REQUEST");
  console.log("api/logged-data: method =", req.method);
  console.log("api/logged-data: body =", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const username = getRequiredText(req.body.username, "username");
    const method = getRequiredText(req.body.method, "method");
    const url = getRequiredText(req.body.url, "url");
    const responseText = getRequiredText(req.body.responseText, "responseText");
    const status = req.body.status;

    console.log("api/logged-data: parsed =", {
      username,
      method,
      url,
      status,
      responseText,
    });

    const loggedData = parseLoggedDataResponse(responseText);
    const fullname = normalizeFullname(loggedData.nombre);
    const { grade, gradeLetter } = parseGradeData(loggedData.nombreJerarquia);

    const updateResult = await updateUserProfileByUsername({
      username,
      fullname,
      grade,
      gradeLetter,
    });

    if (updateResult.status === "not_found" || !updateResult.user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    if (updateResult.status === "skipped") {
      return res.status(200).json({
        message: "User already has profile data. Update skipped.",
        user: updateResult.user,
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updateResult.user,
    });
  } catch (error) {
    console.error("api/logged-data: ERROR =", error);

    if (error instanceof Error && (error.message.includes("required") || error.message.includes("responseText"))) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
