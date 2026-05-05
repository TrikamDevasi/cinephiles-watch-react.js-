import "./globals.css";
import Navbar from "@/components/Navbar";
import { Outfit } from "next/font/google";
import ThemeWrapper from "@/components/ThemeWrapper";
import { RegionProvider } from "@/context/RegionContext";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Cinephiles Watch",
  description: "A modern movie discovery experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.className} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var s = localStorage.getItem('cinephiles-theme');
                var t = s ? JSON.parse(s).state.theme : 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            `,
          }}
        />
      </head>
      <body>
        <ThemeWrapper>
          <RegionProvider>
            <Navbar />
            <main
              style={{
                paddingTop: "80px", // space for fixed navbar
                minHeight: "100vh",
              }}
            >
              {children}
            </main>
          </RegionProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
