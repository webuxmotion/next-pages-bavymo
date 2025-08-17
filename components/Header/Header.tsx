import Link from "../Link/Link";
import styles from "./Header.module.scss";
import Logo from "@/icons/Logo";

export default function Header() {
    return (
        <header className={styles.container}>
            <div>
                <nav>
                    <ul>
                        <li>
                            <div className={styles.logoWithNavItem}>
                                <Link href="/" className={styles.logo} activeClassName={styles.isActive}>
                                    <Logo />
                                </Link>
                                <Link href="/" activeClassName={styles.isActive}>Video chat</Link>
                            </div>
                        </li>
                        <li>
                            <Link href="/two-in-a-room" activeClassName={styles.isActive}>Two in a room</Link>
                        </li>
                        <li>
                            <Link href="/sponsors" activeClassName={styles.isActive}>Sponsors</Link>
                        </li>
                        <li>
                            <Link href="/about" activeClassName={styles.isActive}>About</Link>
                        </li>
                        <li>
                            <Link href="/contacts" activeClassName={styles.isActive}>Contacts</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link href="/sign-up" activeClassName={styles.isActive}>Sign Up</Link>
                        </li>
                        <li>
                            <Link href="/sign-in" activeClassName={styles.isActive}>Sign In</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header >
    );
}