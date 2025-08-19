import { GetServerSideProps } from "next";
import MainPageContent from "@/components/MainPageContent/MainPageContent";
import { SocketProvider } from "@/context/SocketContext";
import { CallProvider } from "@/context/CallContext";

type HomeProps = {
  personalCode?: string;
};

export default function Home({ personalCode }: HomeProps) {
  return (
    <SocketProvider>
      <CallProvider>
        <MainPageContent personalCode={personalCode ?? ""} />
      </CallProvider>
    </SocketProvider>
  );
}

// ✅ Fully server-side
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let personalCode = req.cookies.personalCode;

  // If no cookie exists, generate a new code
  if (!personalCode) {
    const { generateCode } = await import("@/lib/personalCode");
    personalCode = generateCode();

    // Set the cookie on the server
    res.setHeader(
      "Set-Cookie",
      `personalCode=${personalCode}; Path=/; Max-Age=600; HttpOnly; SameSite=Strict`
    );
    console.log("Generated new personalCode:", personalCode);
  } else {
    console.log("Using existing personalCode:", personalCode);
  }

  return {
    props: { personalCode },
  };
};