"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSocket } from "./SocketContext";
import { useAudio } from "./AudioContext";
import { SOCKET_EVENTS } from "@/socket/events";

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
    localStream: MediaStream | null;
}

const CallContext = createContext<CallContextType>({
    incomingCall: null,
    outgoingCall: null,
    localStream: null,
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
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const initMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setLocalStream(stream);
            } catch (err) {
                console.error("Failed to access media devices:", err);
            }
        };

        initMedia();
    }, []);

    useEffect(() => {
        onEvent(SOCKET_EVENTS.INCOMING_CALL, (data: unknown) => {
            const callData = data as IncomingCallData;
            setIncomingCall(callData);

            play();
        });

        onEvent(SOCKET_EVENTS.CALL_ACCEPTED, () => {
            setCallActive(true);
            setOutgoingCall(null);
        });

        onEvent(SOCKET_EVENTS.CALL_REJECTED, () => {
            alert("Call was rejected.");
            setOutgoingCall(null);
        });

        onEvent(SOCKET_EVENTS.END_CALL, () => {
            setCallActive(false);
            setIncomingCall(null);
            stop();
        });
    }, [onEvent, play, stop]);

    const startCall = (targetCode: string, personalCode: string) => {
        socket?.emit(SOCKET_EVENTS.CALL, { targetCode, personalCode });
        setOutgoingCall(targetCode);
    };

    const acceptCall = () => {
        if (socket && incomingCall) {
            socket.emit(SOCKET_EVENTS.CALL_ACCEPTED, { from: incomingCall.fromSocketId });
            setIncomingCall(null);
            setCallActive(true);
            stopAudio();
        }
    };

    const rejectCall = () => {
        if (socket && incomingCall) {
            socket.emit(SOCKET_EVENTS.CALL_REJECTED, { from: incomingCall.fromSocketId });
            setIncomingCall(null);
            stopAudio();
        }
    };

    const endCall = () => {
        socket?.emit(SOCKET_EVENTS.END_CALL, outgoingCall);
        setCallActive(false);
        setOutgoingCall(null);
        stopAudio();
    };

    const stopAudio = () => {
        stop();
    };

    return (
        <CallContext.Provider
            value={{
                incomingCall,
                outgoingCall,
                callActive,
                startCall,
                localStream,
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