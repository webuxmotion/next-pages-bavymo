"use client";

import { useCall } from "@/context/CallContext";

export default function IncomingCallModal() {
    const { incomingCall, acceptCall, rejectCall } = useCall();


    if (!incomingCall) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4">📞 Incoming call from {incomingCall.fromCode}</p>
                <div className="flex gap-4">
                    <button
                        onClick={acceptCall}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Accept
                    </button>
                    <button
                        onClick={rejectCall}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}