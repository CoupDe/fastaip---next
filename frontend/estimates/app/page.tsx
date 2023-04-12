"use client";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <main>
      <h1 className="text-center">I am main</h1>

      <h1>{status}</h1>
    </main>
  );
}
