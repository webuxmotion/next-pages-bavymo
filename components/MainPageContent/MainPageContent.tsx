import { useSocket } from "@/context/SocketContext";
import styles from './MainPageContent.module.scss';

interface MainPageProps {
    personalCode: string;
}

export default function MainPageContent({ personalCode }: MainPageProps) {
    const { socket } = useSocket();

    if (!socket) return <p>Connecting to socket...</p>;

    return (
        <main className={styles.main}>
            <section className={styles.content}>
                <p>Code: {personalCode}</p>
                <p>socketId: {socket.id}</p>
            </section>
            <section className={styles.sidebar}>
                sidebar
            </section>
        </main>
    );
}