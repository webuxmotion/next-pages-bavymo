import type { NextApiRequest, NextApiResponse } from "next";
import { generateCode } from "@/lib/personalCode";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const code = generateCode();

        // set cookie (5s lifetime)
        res.setHeader("Set-Cookie", `personalCode=${code}; Path=/; Max-Age=1; HttpOnly; SameSite=Strict`);

        // redirect
        const url = process.env.NEXT_PUBLIC_BASE_URL!;
        res.writeHead(302, { Location: url });
        res.end();
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}