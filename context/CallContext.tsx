"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSocket } from "./SocketContext";
import { useAudio } from "./AudioContext";
import { SOCKET_EVENTS } from "@/socket/events";

interface IncomingCallData {
    fromCode: string;
    fromSocketId: string;
    sdp?: RTCSessionDescriptionInit;
}

interface CallContextType {
    incomingCall: IncomingCallData | null;
    outgoingCall: string | null;
    callActive: boolean;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    peerConnection: RTCPeerConnection | null;
    startCall: (targetCode: string, personalCode: string) => void;
    acceptCall: () => void;
    rejectCall: () => void;
    endCall: () => void;
}

const CallContext = createContext<CallContextType>({
    incomingCall: null,
    outgoingCall: null,
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    callActive: false,
    startCall: () => { },
    acceptCall: () => { },
    rejectCall: () => { },
    endCall: () => { },
});

const iceServers = [
    {
        urls: 'stun:stun.l.google.com:19302'
    },
    {
        urls: 'stun:stun1.l.google.com:19302'
    },
    {
        urls: 'stun:stun2.l.google.com:19302'
    },
    {
        urls: 'stun:stun3.l.google.com:19302'
    },
    {
        urls: 'stun:stun4.l.google.com:19302'
    },
    {
        urls: [
            'stun:185.233.47.117:3478',
            'turn:185.233.47.117:3478?transport=udp',
            'turn:185.233.47.117:3478?transport=tcp'
        ],
        username: 'webrtcuser',
        credential: 'strongpassword'
    }
];

export function CallProvider({ children }: { children: ReactNode }) {
    const { socket, onEvent } = useSocket();
    const { play, stop } = useAudio();

    const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
    const [outgoingCall, setOutgoingCall] = useState<string | null>(null);
    const [callActive, setCallActive] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

    // Initialize local media
    useEffect(() => {
        const initMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
            } catch (err) {
                console.error("Failed to access media devices:", err);
            }
        };
        initMedia();
    }, []);

    // Helper to create a new PeerConnection
    const createPeerConnection = (targetSocketId: string) => {
        const pc = new RTCPeerConnection({ iceServers });

        // Add local tracks
        localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));

        // Handle remote tracks
        pc.ontrack = event => {
            setRemoteStream(event.streams[0]);
        };

        // ICE candidates
        pc.onicecandidate = event => {
            if (event.candidate) {
                socket?.emit(SOCKET_EVENTS.ICE_CANDIDATE, {
                    to: targetSocketId,
                    candidate: event.candidate,
                });
            }
        };

        setPeerConnection(pc);
        return pc;
    };

    // Socket event handlers
    useEffect(() => {
        onEvent(SOCKET_EVENTS.INCOMING_CALL, (data: unknown) => {
            const callData = data as IncomingCallData;
            setIncomingCall(callData);
            play();
        });

        onEvent(SOCKET_EVENTS.CALL_ACCEPTED, async (data: unknown) => {
            // Caller receives answer
            const { sdp } = data as { sdp: RTCSessionDescriptionInit };
            if (peerConnection && sdp) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
            }
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
            setRemoteStream(null);
            peerConnection?.close();
            setPeerConnection(null);
            stop();
        });

        onEvent(SOCKET_EVENTS.ICE_CANDIDATE, async (data: unknown) => {
            const { candidate } = data as { candidate: RTCIceCandidateInit };
            if (peerConnection && candidate) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });
    }, [onEvent, play, stop, peerConnection]);

    // Start a call (caller)
    const startCall = async (targetCode: string, personalCode: string) => {
        setOutgoingCall(targetCode);

        const pc = createPeerConnection(targetCode);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket?.emit(SOCKET_EVENTS.CALL, {
            targetCode,
            personalCode,
            sdp: offer,
        });
    };

    // Accept incoming call (callee)
    const acceptCall = async () => {
        if (!incomingCall) return;

        const pc = createPeerConnection(incomingCall.fromSocketId);

        // First, set remote description with caller's offer
        if (incomingCall.sdp) {
            await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.sdp));
        }

        // Create and set local answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket?.emit(SOCKET_EVENTS.CALL_ACCEPTED, {
            from: incomingCall.fromSocketId,
            sdp: answer,
        });

        setCallActive(true);
        setIncomingCall(null);
        stop();
    };

    const rejectCall = () => {
        if (socket && incomingCall) {
            socket.emit(SOCKET_EVENTS.CALL_REJECTED, { from: incomingCall.fromSocketId });
            setIncomingCall(null);
            stop();
        }
    };

    const endCall = () => {
        socket?.emit(SOCKET_EVENTS.END_CALL, outgoingCall);
        setCallActive(false);
        setOutgoingCall(null);
        setRemoteStream(null);
        peerConnection?.close();
        setPeerConnection(null);
        stop();
    };

    return (
        <CallContext.Provider
            value={{
                incomingCall,
                outgoingCall,
                callActive,
                localStream,
                remoteStream,
                peerConnection,
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