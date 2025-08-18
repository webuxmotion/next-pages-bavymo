import Header from "@/components/Header/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import styles from './_app.module.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.content}>
          <Component {...pageProps} />
        </section>
        <section className={styles.sidebar}>
          
        </section>
      </main>
    </>
  );
}
