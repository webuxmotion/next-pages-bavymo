import LogoBig from '@/icons/LogoBig';
import styles from './Video.module.scss';
import Copy from '@/icons/Copy';
import { useEffect, useRef, useState } from 'react';
import { useCall } from '@/context/CallContext';

interface VideoProps {
    personalCode: string;
}

export default function Video({ personalCode }: VideoProps) {
    const [copied, setCopied] = useState(false);
    const { localStream, remoteStream } = useCall();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(personalCode);
            setCopied(true);

            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.spacer} />
            <div className={styles.content}>
                <div className={styles.personalCode}>
                    <span>Your code:</span>
                    <span>{personalCode}</span>
                    <button onClick={handleCopy} title="Copy to clipboard">
                        <Copy />
                    </button>
                    {copied && <span className={styles.copied}>Copied!</span>}
                </div>
                <div className={styles.logoBig}>
                    <LogoBig />
                </div>
                <div className={styles.localVideo}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted   // prevent echo
                    />
                    <span>You</span>
                </div>
                <div className={styles.remoteVideo}>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                    />
                </div>
            </div>
        </div>
    )
}