import { DM_Mono, Source_Sans_Pro } from "next/font/google";
import AuthContext from "./providers/AuthProvider";
import ThemeContext from "./providers/ThemeProvider";
import "./globals.css";
import { StoreProvider } from "./providers/StoreProvider";
import PersistorContext from "./providers/PersistProvider";
import { Dancing_Script } from "next/font/google";
export const metadata = {
  title: "Estimates",
  description: "Create report KS-2",
};
/** suppressHydrationWarning - судя по всему это временное решение, проблема заключается в том что
    появляется предупреждение о том что классы стилей отличаются между сервером и клиентом*/
export const dmMono = DM_Mono({
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
    <html lang="ru" className={` ${dmMono.variable} ${SSPro.variable}`}>
      <body
        className={`bg-[#fbf0e4] dark:bg-slate-600 h-screen w-screen  flex flex-col font-dmMono`}
      >
        <StoreProvider>
          <PersistorContext>
            <ThemeContext>
              <main>
                <AuthContext>{children}</AuthContext>
              </main>
            </ThemeContext>
          </PersistorContext>
        </StoreProvider>
      </body>
    </html>
  );
}
// <AuthContext></AuthContext>
