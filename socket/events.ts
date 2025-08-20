export const SOCKET_EVENTS = {
    INCOMING_CALL: "incoming-call",
    CALL_ACCEPTED: "call-accepted",
    CALL_REJECTED: "call-rejected",
    END_CALL: "end-call",
    CALL: "call",
    REGISTER: "register",
    ICE_CANDIDATE: "ice_candidate"
} as const;

// Optional: Type for event names
export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];