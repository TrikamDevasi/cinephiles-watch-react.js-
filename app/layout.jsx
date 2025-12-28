import "./globals.css";
import Navbar from "@/components/Navbar";
import { Outfit } from "next/font/google";

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
    <html lang="en" className={outfit.className} data-theme="dark">
      <body>
        <Navbar />
        <main
          style={{
            paddingTop: "80px", // space for fixed navbar
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
