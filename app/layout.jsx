import "./globals.css";
import Navbar from "@/components/Navbar"; // Your existing Navbar.jsx

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />  {/* Your React search + AI navbar */}
        <div className="pt-20"> {/* Spacer */}
          {children}
        </div>
      </body>
    </html>
  );
}
