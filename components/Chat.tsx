"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function Chat() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io({
            path: "/api/socket",
        });

        socketRef.current.on("connect", () => {
            console.log("Connected to server:", socketRef.current?.id);
        });

        socketRef.current.on("message", (msg: string) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (!input) return;
        socketRef.current?.emit("message", input); // send to server
        setInput("");
    };

    return (
        <div className="p-4">
            <div className="mb-2 border p-2 h-40 overflow-y-auto">
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border p-1"
            />
            <button
                onClick={sendMessage}
                className="ml-2 p-1 bg-blue-500 text-white rounded"
            >
                Send
            </button>
        </div>
    );
}