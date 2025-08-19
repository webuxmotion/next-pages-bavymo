// pages/404.tsx
import Link from "next/link";

export default function Custom404() {
    return (
        <div style={{ textAlign: "center", padding: "4rem" }}>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link href="/">
                <button style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
                    Go to Home
                </button>
            </Link>
        </div>
    );
}