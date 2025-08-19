import { useState } from 'react';
import { useRouter } from "next/router";
import Input from '@/components/Input/Input';
import Email from '@/icons/Email';
import Password from '@/icons/Password';
import Link from '@/components/Link/Link';
import Google from '@/icons/Google';
import styles from './index.module.scss';
import { useAuth } from '@/context/AuthContext';

export default function Page() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    const handleLogin = async () => {
        setError('');
        setSuccess('');

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
            } else {
                setSuccess("Logged in successfully!");
                login(data.token);
                // redirect if needed
                router.push("/");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Sign In</h1>
                <Input
                    className="mt-2 mb-5"
                    label="Email"
                    placeholder="Email"
                    type="email"
                    icon={<Email />}
                    value={email}
                    onChange={setEmail}
                />
                <Input
                    className="mb-3"
                    label="Password"
                    placeholder="Password"
                    icon={<Password />}
                    value={password}
                    onChange={setPassword}
                />

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <p className='!text-right mb-5 pr-3'>
                    <Link href='/forgot-password'>Forgot Password</Link>
                </p>
                <button className={styles.button} onClick={handleLogin}>Sign In</button>
                <p className="mt-5 mb-5">
                    Don’t have an account? <Link href='/sign-up'>Sign Up</Link>
                </p>
                <p className="mb-4">
                    or
                </p>
                <button className={styles.buttonGoogle}>
                    <Google />
                    Sign In with Google
                </button>
            </div>
        </div>
    )
}