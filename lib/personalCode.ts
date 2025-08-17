// lib/personalCode.ts
import { getDb } from "./mongodb";
import { generateWord } from "./utils/generateWord";

// Generate a random 4-letter code
export function generateCode() {
    return generateWord();
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