import Header from "@/components/header/Header";
import Breadcrumbs from "@/components/header/breadcrumbs/Breadcrumbs";
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
      <Breadcrumbs />
      <main className={` h-[80vh] font-dmMono px-1 relative flex-col`}>
        {children}
      </main>
    </>
  );
}
