import type { NextApiRequest, NextApiResponse } from "next";
import { generateCode } from "@/lib/personalCode";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("=== /api/personal-code called ===");
    console.log("Request method:", req.method);

    if (req.method !== "GET") {
        console.log("Method not allowed, returning 405");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const code = generateCode();
    console.log("Generated personal code:", code);

    // Prepare redirect and cookie
    const url = process.env.NEXT_PUBLIC_BASE_URL || "/";
    console.log("Redirecting to:", url);

    res.setHeader(
        "Set-Cookie",
        `personalCode=${code}; Path=/; Max-Age=5; HttpOnly; SameSite=Strict`
    );
    console.log("Cookie set for personalCode");

    // Send redirect
    res.writeHead(302, { Location: url });
    res.end();

    // ✅ all logs happen before end
}