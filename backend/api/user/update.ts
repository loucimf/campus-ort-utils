import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../../src/db/client.js";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    console.log("api/logged-data: HANDLING REQUEST");
    console.log("api/logged-data: method =", req.method);
    console.log("api/logged-data: body =", req.body);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const sql = getSql();

        const method = req.body.method;
        const url = req.body.url;
        const status = req.body.status;
        const responseText = req.body.responseText ?? null;

        console.log("api/logged-data: parsed =", {
            method,
            url,
            status,
            responseText
        });

        if (
            typeof method !== "string" ||
            method.trim() === "" ||
            typeof url !== "string" ||
            url.trim() === ""
        ) {
            return res.status(400).json({
                error: "method and url must be valid strings"
            });
        }

    //     const result = await sql`
    //   INSERT INTO logged_data_records (method, url, status, response_text)
    //   VALUES (${method.trim()}, ${url.trim()}, ${status}, ${responseText})
    //   RETURNING id, method, url, status, response_text, created_at
    // `;

        // console.log("api/logged-data: CREATED RECORD", result[0]);

        // return res.status(201).json({
        //     message: "Logged data response saved successfully",
        //     record: result[0]
        // });
        return res.status(200).json({
            message: "nothing yet"
        })
    } catch (error) {
        console.error("api/logged-data: ERROR =", error);

        return res.status(500).json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : String(error)
        });
    }
}