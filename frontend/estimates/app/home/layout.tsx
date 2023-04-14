import Header from "@/components/header/Header";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Programm",
};
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children} </main>
    </>
  );
}
