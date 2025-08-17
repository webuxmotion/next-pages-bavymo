// lib/personalCode.ts
import { getDb } from "./mongodb";

// Generate a random 4-letter code
export function generateCode(length = 4) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Save the code in MongoDB
export async function saveCodeToDb(code: string) {
    const db = await getDb();
    await db.collection("personalCodes").insertOne({
        value: code,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}