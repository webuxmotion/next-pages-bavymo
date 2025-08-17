import Link from "next/link";
import Chat from "@/components/Chat";
import { GetServerSideProps } from "next";

type HomeProps = {
  personalCode?: string;
};

export default function Home({ personalCode }: HomeProps) {
  if (!personalCode) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>No personal code found. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="h-screen border-2 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">NEXTJS BAVYMO</h1>
      <div>Your personal code: {personalCode}</div>
      <Chat />
      <Link
        href="/api/users"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        View Users API
      </Link>
    </div>
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
      `personalCode=${personalCode}; Path=/; Max-Age=3; HttpOnly; SameSite=Strict`
    );
    console.log("Generated new personalCode:", personalCode);
  } else {
    console.log("Using existing personalCode:", personalCode);
  }

  return {
    props: { personalCode },
  };
};