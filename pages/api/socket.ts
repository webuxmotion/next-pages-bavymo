import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import serverListeners from "@/socket/serverListeners";

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
            path: "/api/socket",
            cors: { origin: "*" },
        });
        res.socket.server.io = io;
    } else {
        console.log("Socket.IO server already running");
    }

    serverListeners({ io: res.socket.server.io });

    res.end();
}