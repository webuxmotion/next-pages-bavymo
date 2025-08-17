import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await getDb();

        // Try listing collections to test connection
        const collections = await db.listCollections().toArray();

        console.log("MongoDB connected successfully. Collections:", collections.map(c => c.name));

        res.status(200).json({
            success: true,
            message: "MongoDB connection is working!",
            collections: collections.map((c) => c.name),
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        res.status(500).json({ success: false, error: "Database connection failed" });
    }
}