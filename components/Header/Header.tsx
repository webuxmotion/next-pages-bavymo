import styles from "./Header.module.scss";

export default function Header() {
    return (
        <header className={styles.container}>
            <h1 className={styles.title}>Updated!</h1>
            <p>Using SCSS variables, nesting, and modules.</p>
        </header>
    );
}