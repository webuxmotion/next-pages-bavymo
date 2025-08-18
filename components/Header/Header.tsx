import { useEffect, useRef, useState } from "react";
import Burger from "../Burger/Burger";
import Link from "../Link/Link";
import styles from "./Header.module.scss";
import Logo from "@/icons/Logo";
import clsx from "clsx";

export default function Header() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const navRef = useRef<HTMLDivElement | null>(null);

    const mobileNavHandler = () => {
        setMobileNavOpen(!mobileNavOpen);
    }

    // 🔹 Close menu on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setMobileNavOpen(false);
            }
        }

        if (mobileNavOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mobileNavOpen]);

    return (
        <header className={styles.container}>
            <div className={styles.desktopNav}>
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
            <div ref={navRef} className={clsx(styles.mobileNav, { [styles.isMobileNavActive]: mobileNavOpen })}>
                <Burger isActive={mobileNavOpen} onClick={mobileNavHandler} />
                <div className={styles.mobileLogoWrapper} onClick={() => setMobileNavOpen(false)}>
                    <Link href="/" className={styles.logo} activeClassName={styles.isActive}>
                        <Logo />
                    </Link>
                </div>
                <nav onClick={() => setMobileNavOpen(false)}>
                    <ul>
                        <li>
                            <Link href="/" activeClassName={styles.isActive}>Main</Link>
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
                        <hr />
                        <li>
                            <Link href="/sign-up" activeClassName={styles.isActive}>Sign Up</Link>
                        </li>
                        <li>
                            <Link href="/sign-in" activeClassName={styles.isActive}>Sign In</Link>
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