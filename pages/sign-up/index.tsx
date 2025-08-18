import { useState } from 'react';
import clsx from "clsx";
import Input from '@/components/Input/Input';
import Email from '@/icons/Email';
import Password from '@/icons/Password';
import Link from '@/components/Link/Link';
import Google from '@/icons/Google';
import styles from './index.module.scss';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                    icon={<Password />}
                    value={password}
                    onChange={setPassword}
                />
                <button className={styles.button}>Sign Up</button>
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