import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <--- IMPORT NAVBAR

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Codeva Tech | Solusi Laptop & PC",
  description: "Jasa service laptop, rakit PC, dan jual beli hardware terpercaya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-black text-white`}>
        {/* Pasang Navbar di sini supaya muncul di semua halaman */}
        <Navbar /> 
        
        {children}
      </body>
    </html>
  );
}