import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: NetSocket & {
        server: HTTPServer & { io?: IOServer };
    };
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    if (!res.socket.server.io) {
        console.log("* First use, starting Socket.IO server");

        const io = new IOServer(res.socket.server as unknown as HTTPServer, {
            path: "/api/socket", // must match client
            cors: { origin: "*" }, // adjust for prod
        });

        io.on("connection", (socket) => {
            console.log("New client connected:", socket.id);

            socket.on("message", (msg: string) => {
                console.log("Received:", msg);
                io.emit("message", msg);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
    } else {
        console.log("Socket.IO server already running");
    }

    res.end();
}