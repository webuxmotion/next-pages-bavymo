import { useEffect, useRef, useState } from "react";
import Burger from "../Burger/Burger";
import Link from "../Link/Link";
import styles from "./Header.module.scss";
import Logo from "@/icons/Logo";
import clsx from "clsx";
import { User, useAuth } from "@/context/AuthContext";

export default function Header() {
    const { user, logout } = useAuth();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

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

    const mobileNavProps = { navRef, mobileNavOpen, mobileNavHandler, setMobileNavOpen, user, logout };

    return (
        <header className={styles.container}>
            {getDesktopNav()}
            {getMobileNav(mobileNavProps)}
            <div className={styles.loginOrUserButtons}>
                <nav>
                    <ul>
                        {getLoginOrUserButtons({ user, logout })}
                    </ul>
                </nav>
            </div>
        </header >
    );
}

function getLoginOrUserButtons({ user, logout }: { user: User | null, logout: () => void }) {
    return (
        <>
            {user ? (
                <>
                    <li><Link href="/profile" activeClassName={styles.isActive}>Profile</Link></li>
                    <li><button onClick={logout}>Logout</button></li>
                </>
            ) : (
                <>
                    <li><Link href="/sign-up" activeClassName={styles.isActive}>Sign Up</Link></li>
                    <li><Link href="/sign-in" activeClassName={styles.isActive}>Sign In</Link></li>
                </>
            )}
        </>
    )
}

function getCommonLinks() {
    return (
        <>
            <li>
                <Link href="/two-in-a-room" activeClassName={styles.isActive}>Two in a room</Link>
            </li>
            <li>
                <Link href="/sponsors" activeClassName={styles.isActive}>Sponsors</Link>
            </li>
            <li>
                <Link href="/abouttt" activeClassName={styles.isActive}>About</Link>
            </li>
            <li>
                <Link href="/contacts" activeClassName={styles.isActive}>Contacts</Link>
            </li>
            <li>
                <Link href="/users" activeClassName={styles.isActive}>Users</Link>
            </li>
        </>
    )
}

function getDesktopNav() {
    return (
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
                    {getCommonLinks()}
                </ul>
            </nav>
        </div>
    )
}

function getMobileNav({
    navRef,
    mobileNavOpen,
    mobileNavHandler,
    setMobileNavOpen,
    user,
    logout
}: {
    navRef: React.RefObject<HTMLDivElement | null>,
    mobileNavOpen: boolean,
    mobileNavHandler: () => void,
    setMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>,
    user: User | null,
    logout: () => void
}) {
    return (
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
                    {getCommonLinks()}
                    <hr />
                    {getLoginOrUserButtons({ user, logout })}
                </ul>
            </nav>
        </div>
    )
}