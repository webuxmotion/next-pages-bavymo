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

// ✅ Run on server before rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
  const personalCode = context.req.cookies.personalCode;

  if (!personalCode) {
    return {
      redirect: {
        destination: "/api/personal-code",
        permanent: false,
      },
    };
  }

  return {
    props: { personalCode },
  };
};