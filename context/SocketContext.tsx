"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

type EventHandler = (data: unknown) => void;

interface SocketContextType {
  socket: Socket | null;
  onEvent: (event: string, handler: EventHandler) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onEvent: () => { },
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null); // track ready socket
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Record<string, EventHandler[]>>({});

  useEffect(() => {
    const s = io("/", { path: "/api/socket" });
    socketRef.current = s;

    s.on("connect", () => {
      setSocket(s);
    });

    const events = ["incoming-call", "call-accepted", "call-rejected", "end-call"];
    events.forEach((event) => {
      s.on(event, (data) => {
        const handlers = listenersRef.current[event];

        if (handlers) {
          handlers.forEach((cb) => cb(data));
        }
      });
    });

    s.on("disconnect", () => console.log("Socket disconnected"));

    return () => {
      s.disconnect();
    };
  }, []);

  const onEvent = useCallback((event: string, handler: EventHandler) => {
    if (!listenersRef.current[event]) listenersRef.current[event] = [];
    listenersRef.current[event].push(handler);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onEvent }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}