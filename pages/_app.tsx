import Header from "@/components/Header/Header";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import { AudioProvider } from "@/context/AudioContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AudioProvider>
        <Header />
        <Component {...pageProps} />
      </AudioProvider>
    </AuthProvider>
  );
}
