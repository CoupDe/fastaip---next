import { DM_Mono } from "next/font/google";
import AuthContext from "./AuthContext";
import "./globals.css";

export const metadata = {
  title: "Estimates",
  description: "Create report KS-2",
};
const dmMono = DM_Mono({ subsets: ["latin"], weight: "500" });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={dmMono.className}>
      <body className="bg-gray-500 h-screen w-screen">
        <AuthContext>{children}</AuthContext>
      </body>
    </html>
  );
}
// <AuthContext></AuthContext>
