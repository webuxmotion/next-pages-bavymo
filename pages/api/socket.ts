import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import { getDb } from "@/lib/mongodb";

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: NetSocket & {
        server: HTTPServer & { io?: IOServer };
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    if (!res.socket.server.io) {
        console.log("* First use, starting Socket.IO server");

        const io = new IOServer(res.socket.server as unknown as HTTPServer, {
            path: "/api/socket", // must match client
            cors: { origin: "*" }, // adjust for prod
        });

        const db = await getDb();
        const connections = db.collection("connections");

        io.on("connection", (socket) => {
            socket.on("register", async (personalCode: string) => {
                await connections.updateOne(
                    { personalCode },
                    { $set: { socketId: socket.id } },
                    { upsert: true }
                );
                console.log("Saved connection:", personalCode, socket.id);
            });

            socket.on("call", async (data) => {
                const { targetCode, personalCode } = data;

                try {
                    // Find the target user's socketId in MongoDB
                    const target = await connections.findOne({ personalCode: targetCode });

                    if (target?.socketId) {
                        // Emit "incoming-call" to the target socket
                        io.to(target.socketId).emit("incoming-call", {
                            fromCode: personalCode,
                            fromSocketId: socket.id
                        });

                        console.log(`Call sent from ${personalCode} to ${targetCode}`);
                    } else {
                        console.log(`Target with code ${targetCode} not found`);
                    }
                } catch (err) {
                    console.error("Error finding target connection:", err);
                }
            });

            socket.on("disconnect", async () => {
                await connections.deleteOne({ socketId: socket.id });
                console.log("Client disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
    } else {
        console.log("Socket.IO server already running");
    }

    res.end();
}