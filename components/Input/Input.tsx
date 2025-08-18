import { useId, ReactNode } from 'react';
import clsx from "clsx";
import styles from './Input.module.scss';

interface InputProps {
    label?: string;
    placeholder?: string;
    type?: string;
    icon?: ReactNode;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function Input({
    label,
    placeholder,
    type = "text",
    icon,
    value,
    onChange,
    className = ''
}: InputProps) {
    const id = useId(); // generate a unique id for accessibility

    return (
        <div
            className={clsx(
                styles.wrapper,
                className
            )}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            <div className={styles.inputContainer}>
                {icon && <span className={styles.icon}>{icon}</span>}
                <input
                    id={id}
                    className={styles.input}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}