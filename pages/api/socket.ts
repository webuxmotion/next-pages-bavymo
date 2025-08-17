// pages/api/socket.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

// Extend Next.js API response to include socket with io
interface NextApiResponseWithSocket extends NextApiResponse {
    socket: any & { server: { io?: Server } };
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
    if (!res.socket.server.io) {
        console.log("* First use, starting Socket.IO server");

        const io = new Server(res.socket.server, {
            path: "/api/socket", // important: same as route
            cors: { origin: "*" }, // ⚠️ adjust for production
        });

        io.on("connection", (socket) => {
            console.log("New client connected:", socket.id);

            socket.on("message", (msg: string) => {
                console.log("Received:", msg);
                io.emit("message", msg); // broadcast to all clients
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
    } else {
        console.log("Socket.IO server already running");
    }

    res.end(); // ✅ must end response
}