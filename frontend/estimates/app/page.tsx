"use client";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkIcon from "@mui/icons-material/Link";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import VK_Logo from "../public/VK_Logo.svg";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <main>
      <h1>{status}</h1>
    </main>
  );
}
