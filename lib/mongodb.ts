// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
    throw new Error("Please add MONGODB_URI to your .env.local");
}
if (!process.env.MONGODB_DB) {
    throw new Error("Please add MONGODB_DB to your .env.local");
}

if (process.env.NODE_ENV === "development") {
    // @ts-expect-error: some description
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        // @ts-expect-error: some description
        global._mongoClientPromise = client.connect();
    }
    // @ts-expect-error: some description
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// 👇 reusable function to get DB
export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB);
}

export default clientPromise;