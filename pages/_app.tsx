import Header from "@/components/Header/Header";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";

import styles from './_app.module.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <main className={styles.main}>
        <section className={styles.content}>
          <Component {...pageProps} />
        </section>
        <section className={styles.sidebar}>
          
        </section>
      </main>
    </AuthProvider>
  );
}
