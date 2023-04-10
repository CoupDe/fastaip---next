'use client'
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import Login from "./login/page";
import Test from "./Test";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <main>
      <h1 className="text-center">I am main</h1>
      <Test />
      <h1>{status}</h1>
    </main>
  );
}
