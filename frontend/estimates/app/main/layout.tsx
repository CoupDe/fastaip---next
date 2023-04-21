import Header from "@/components/header/Header";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Programm",
};
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <main className="mt-2 h-full">{children} </main>
    </>
  );
}
