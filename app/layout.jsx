import "./globals.css";
import Navbar from "@/components/Navbar";
// Add a nice font
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "CINEPHILES",
  description: "Next Gen Streaming",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.className}>
      <body className="bg-[#0a0a0a] text-white">
        <Navbar />
        {/* Removed 'pt-20' so Hero Banner touches top of screen */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
