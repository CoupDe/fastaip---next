import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className="hover:scale-150:text-slate-400  text-slate-800">Darova</h1>
    </main>
  );
}
