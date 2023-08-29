import { DM_Mono, Source_Sans_3, Overpass } from "next/font/google";
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
const overpass = Overpass({
  subsets: ["cyrillic"],
  weight: "500",
  variable: "--font-overpass",
});
const SSPro = Source_Sans_3({
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
    <html
      lang="ru"
      className={` ${dmMono.variable} ${SSPro.variable} ${overpass.variable}`}
    >
      <body className={` bg-[#fbf0e4] font-overpass dark:bg-slate-600`}>
        <StoreProvider>
          <PersistorContext>
            <ThemeContext>
              <main className="flex h-full w-full flex-col ">
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
