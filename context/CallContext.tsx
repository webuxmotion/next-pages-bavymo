"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { useSocket } from "./SocketContext";

interface IncomingCallData {
    fromCode: string;
    fromSocketId: string;
}

interface CallContextType {
    incomingCall: IncomingCallData | null;
    outgoingCall: string | null;
    callActive: boolean;
    startCall: (targetCode: string, personalCode: string) => void;
    acceptCall: () => void;
    rejectCall: () => void;
    endCall: () => void;
}

const CallContext = createContext<CallContextType>({
    incomingCall: null,
    outgoingCall: null,
    callActive: false,
    startCall: () => { },
    acceptCall: () => { },
    rejectCall: () => { },
    endCall: () => { },
});

export function CallProvider({ children }: { children: ReactNode }) {
    const { socket, onEvent } = useSocket();

    const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
    const [outgoingCall, setOutgoingCall] = useState<string | null>(null);
    const [callActive, setCallActive] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // inside CallProvider
    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        onEvent("incoming-call", (data: unknown) => {
            const callData = data as IncomingCallData;
            setIncomingCall(callData);

            // create audio only once
            if (!audioRef.current) {
                audioRef.current = new Audio("/ringtones/beauty_n_beast_open.mp3");
                audioRef.current.loop = true;
            }

            audioRef.current.play().catch(() => { });
        });

        onEvent("call-accepted", () => {
            setCallActive(true);
            setOutgoingCall(null);
        });

        onEvent("call-rejected", () => {
            alert("Call was rejected.");
            setOutgoingCall(null);
        });

        onEvent("end-call", () => {
            setCallActive(false);
        });
    }, [onEvent]);

    const startCall = (targetCode: string, personalCode: string) => {
        socket?.emit("call", { targetCode, personalCode });
        setOutgoingCall(targetCode);
    };

    const acceptCall = () => {
        if (socket && incomingCall) {
            socket.emit("accept-call", { from: incomingCall.fromSocketId });
            setIncomingCall(null);
            setCallActive(true);

            stopAudio();
        }
    };

    const rejectCall = () => {
        if (socket && incomingCall) {
            socket.emit("reject-call", { from: incomingCall.fromSocketId });
            setIncomingCall(null);

            stopAudio();
        }
    };

    const endCall = () => {
        socket?.emit("end-call");
        setCallActive(false);
        setOutgoingCall(null);
        stopAudio();
    };

    return (
        <CallContext.Provider
            value={{
                incomingCall,
                outgoingCall,
                callActive,
                startCall,
                acceptCall,
                rejectCall,
                endCall,
            }}
        >
            {children}
        </CallContext.Provider>
    );
}

export function useCall() {
    return useContext(CallContext);
}