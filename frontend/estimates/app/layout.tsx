import { DM_Mono, Source_Sans_Pro } from "next/font/google";
import AuthContext from "./context/AuthContext";
import ThemeContext from "./context/ThemeContext";
import "./globals.css";
export const metadata = {
  title: "Estimates",
  description: "Create report KS-2",
};
/** suppressHydrationWarning - судя по всему это временное решение, проблема заключается в том что
    появляется предупреждение о том что классы стилей отличаются между сервером и клиентом*/
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-dmMono",
});
const SSPro = Source_Sans_Pro({
  subsets: ["cyrillic"],
  weight: "400",
  variable: "--font-sspro",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`bg-[#fbf0e4] dark:bg-slate-600 h-screen w-screen  flex flex-col ${dmMono.variable} ${SSPro.variable}`}
      >
        <ThemeContext>
          <AuthContext>{children}</AuthContext>
        </ThemeContext>
      </body>
    </html>
  );
}
// <AuthContext></AuthContext>
