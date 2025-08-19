import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import type { User } from "@/context/AuthContext";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }

    try {
        // 🔹 Verify token
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as User;

        // 🔹 Connect to DB
        const db = await getDb();
        const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();

        res.status(200).json({
            success: true,
            user: decoded,  // info about current logged-in user
            users          // list of all users
        });
    } catch (err) {
        console.error("JWT verification failed:", err);
        res.status(401).json({ error: "Invalid or expired token" });
    }
}