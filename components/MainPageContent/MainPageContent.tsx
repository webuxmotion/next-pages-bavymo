import { useSocket } from "@/context/SocketContext";
import styles from './MainPageContent.module.scss';
import { useEffect } from "react";
import CallForm from "../CallForm/CallForm";
import IncomingCallModal from "../IncomingCallModal/IncomingCallModal";
import OutgoingCallModal from "../OutgoingCallModal/OutgoingCallModal";
import { SOCKET_EVENTS } from "@/socket/events";

interface MainPageProps {
    personalCode: string;
}

export default function MainPageContent({ personalCode }: MainPageProps) {
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.emit(SOCKET_EVENTS.REGISTER, personalCode);
    }, [socket, personalCode]);

    if (!socket) return <p>Connecting to socket...</p>;

    return (
        <main className={styles.main}>
            <section className={styles.content}>
                <CallForm personalCode={personalCode} />
                <p>personalCode: {personalCode}</p>
                <p>socketId: {socket.id}</p>
            </section>
            <section className={styles.sidebar}>
                sidebar
            </section>

            <IncomingCallModal />
            <OutgoingCallModal />
        </main>
    );
}