"use client";

import { useCall } from "@/context/CallContext";

export default function OutgoingCallModal() {
    const { outgoingCall, endCall } = useCall();

    if (!outgoingCall) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4">📞 Calling {outgoingCall}...</p>
                <div className="flex gap-4">
                    <button
                        onClick={endCall}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Cancel Call
                    </button>
                </div>
            </div>
        </div>
    );
}