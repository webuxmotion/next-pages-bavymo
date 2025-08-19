"use client";

import { createContext, useContext, useRef, useEffect, ReactNode } from "react";

export interface AudioContextType {
    play: () => void;
    stop: () => void;
    unlocked: boolean;
}

const AudioContext = createContext<AudioContextType>({
    play: () => { },
    stop: () => { },
    unlocked: false,
});

export function AudioProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const unlockedRef = useRef(false);

    useEffect(() => {
        audioRef.current = new Audio("/ringtones/samsung_bubble.mp3");
        audioRef.current.loop = true;
        audioRef.current.preload = "auto";

        const unlockAudio = () => {
            if (audioRef.current) {
                audioRef.current.muted = true;
                audioRef.current.play().then(() => {
                    setTimeout(() => {
                        audioRef.current!.pause();
                        audioRef.current!.currentTime = 0;
                        audioRef.current!.muted = false;
                        unlockedRef.current = true;
                    }, 30);
                }).catch(() => {
                    unlockedRef.current = true;
                });
            }

            window.removeEventListener("touchstart", unlockAudio);
            window.removeEventListener("click", unlockAudio);
        };

        window.addEventListener("touchstart", unlockAudio);
        window.addEventListener("click", unlockAudio);

        return () => {
            window.removeEventListener("touchstart", unlockAudio);
            window.removeEventListener("click", unlockAudio);
        };
    }, []);

    const play = () => {
        if (unlockedRef.current && audioRef.current) {
            audioRef.current.play().catch(() => { });
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return (
        <AudioContext.Provider value={{ play, stop, unlocked: unlockedRef.current }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    return useContext(AudioContext);
}