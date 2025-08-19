import { useState } from 'react';
import Input from '@/components/Input/Input';
import Email from '@/icons/Email';
import Password from '@/icons/Password';
import Link from '@/components/Link/Link';
import Google from '@/icons/Google';
import styles from './index.module.scss';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        if (password !== repeatPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to register");
            } else {
                setSuccess("Account created! You can now sign in.");
                setEmail('');
                setPassword('');
                setRepeatPassword('');
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Create an account</h1>
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
                    className="mb-5"
                    label="Password"
                    placeholder="Password"
                    icon={<Password />}
                    value={password}
                    onChange={setPassword}
                />
                <Input
                    className="mb-10"
                    label="Repeat password"
                    placeholder="Repeat password"
                    type="password"
                    icon={<Password />}
                    value={repeatPassword}
                    onChange={setRepeatPassword}
                />

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <button className={styles.button} onClick={handleSubmit}>Sign Up</button>
                <p className="mt-5 mb-5">
                    Already have an account? <Link href='/sign-in'>Sign In</Link>
                </p>
                <p className="mb-4">
                    or
                </p>
                <button className={styles.buttonGoogle}>
                    <Google />
                    Sign Up with Google
                </button>
            </div>
        </div>
    )
}