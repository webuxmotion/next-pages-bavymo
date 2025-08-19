import { Server } from "socket.io";
import { getDb } from "@/lib/mongodb";
import { SOCKET_EVENTS } from "./events";

export default async function serverListeners({ io }: { io: Server }) {
    const db = await getDb();
    const connections = db.collection("connections");

    // 🟢 Remove old listeners so changes apply after hot reload
    io.removeAllListeners("connection");

    io.on("connection", (socket) => {
        socket.on(SOCKET_EVENTS.REGISTER, async (personalCode: string) => {
            await connections.updateOne(
                { personalCode },
                { $set: { socketId: socket.id } },
                { upsert: true }
            );
        });

        socket.on(SOCKET_EVENTS.CALL, async (data) => {
            const { targetCode, personalCode } = data;

            try {
                // Find the target user's socketId in MongoDB
                const target = await connections.findOne({ personalCode: targetCode.toUpperCase() });

                if (target?.socketId) {
                    socket.to(target.socketId).emit(SOCKET_EVENTS.INCOMING_CALL, {
                        fromCode: personalCode,
                        fromSocketId: socket.id
                    });

                } else {
                    console.log(`Target with code ${targetCode} not found`);
                }
            } catch (err) {
                console.error("Error finding target connection:", err);
            }
        });

        socket.on(SOCKET_EVENTS.CALL_ACCEPTED, (data) => {
            socket.to(data.from).emit(SOCKET_EVENTS.CALL_ACCEPTED);
        });

        socket.on(SOCKET_EVENTS.CALL_REJECTED, (data) => {
            socket.to(data.from).emit(SOCKET_EVENTS.CALL_REJECTED);
        });

        socket.on(SOCKET_EVENTS.END_CALL, async (outgoingPersonalCode) => {
            try {
                // Find the target user's socketId in MongoDB
                const target = await connections.findOne({ personalCode: outgoingPersonalCode.toUpperCase() });

                if (target?.socketId) {
                    socket.to(target.socketId).emit(SOCKET_EVENTS.END_CALL);
                } else {
                    console.log(`Target with code ${outgoingPersonalCode} not found`);
                }
            } catch (err) {
                console.error("Error finding target connection:", err);
            }
        });

        socket.on("disconnect", async () => {
            await connections.deleteOne({ socketId: socket.id });
        });
    });
}