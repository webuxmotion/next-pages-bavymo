"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSocket } from "./SocketContext";
import { useAudio } from "./AudioContext";

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
    const { play, stop } = useAudio();

    const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
    const [outgoingCall, setOutgoingCall] = useState<string | null>(null);
    const [callActive, setCallActive] = useState(false);

    const stopAudio = () => {
        stop();
    };

    useEffect(() => {
        onEvent("incoming-call", (data: unknown) => {
            const callData = data as IncomingCallData;
            setIncomingCall(callData);

            play();
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
            setIncomingCall(null);
            stop();
        });
    }, [onEvent, play, stop]);

    const startCall = (targetCode: string, personalCode: string) => {
        socket?.emit("call", { targetCode, personalCode });
        setOutgoingCall(targetCode);
    };

    const acceptCall = () => {
        if (socket && incomingCall) {
            socket.emit("call-accepted", { from: incomingCall.fromSocketId });
            setIncomingCall(null);
            setCallActive(true);
            stopAudio();
        }
    };

    const rejectCall = () => {
        if (socket && incomingCall) {
            socket.emit("call-rejected", { from: incomingCall.fromSocketId });
            setIncomingCall(null);
            stopAudio();
        }
    };

    const endCall = () => {
        socket?.emit("end-call", outgoingCall);
        console.log('outgoingCall', outgoingCall);
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