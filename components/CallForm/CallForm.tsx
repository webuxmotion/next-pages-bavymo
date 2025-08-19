import { useState } from "react";
import Input from "../Input/Input";
import styles from './CallForm.module.scss';
import { useCall } from "@/context/CallContext";

interface CallFormProps {
    personalCode: string;
}

export default function CallForm({ personalCode }: CallFormProps) {
    const [code, setCode] = useState('');
    const { startCall } = useCall();

    const handleCall = () => {
        if (!code) {
            console.log("Enter friend's code first");
            return;
        }

        console.log("Starting call to:", code);
        startCall(code, personalCode);
    }

    return (
        <div className={styles.wrapper}>
            <Input
                className=""
                label="Friend's code"
                placeholder="Paste friend's code here"
                value={code}
                onChange={setCode}
            />
            <button className={styles.button} onClick={handleCall}>Video Call</button>
        </div>
    )
}