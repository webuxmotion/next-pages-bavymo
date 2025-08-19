import LogoBig from '@/icons/LogoBig';
import styles from './Video.module.scss';
import Copy from '@/icons/Copy';
import { useState } from 'react';

interface VideoProps {
    personalCode: string;
}

export default function Video({ personalCode }: VideoProps) {
    const [copied, setCopied] = useState(false);

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
                    
                </div>
            </div>
        </div>
    )
}