import styles from "./Burger.module.scss";

interface BurgerProps {
    isActive?: boolean;
    onClick?: () => void;
}

export default function Burger({ isActive = false, onClick }: BurgerProps) {
    const handleClick = () => {
        if (onClick) onClick();
    };

    return (
        <button
            className={`${styles.burger} ${isActive ? styles.active : ""}`}
            onClick={handleClick}
            aria-label="Menu"
        >
            <span className={styles.line}></span>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
        </button>
    );
}