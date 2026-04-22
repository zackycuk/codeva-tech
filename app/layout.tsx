import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Codeva Tech | Solusi IT Premium & Rakit PC High-End",
  description: "Codeva Tech menawarkan jasa service laptop profesional, rakit PC high-end, dan rekomendasi perangkat keras berbasis data. Solusi IT tanpa kompromi.",
  keywords: "service laptop, perbaikan komputer, rakit pc, pc gaming, codeva tech, hardware",
  openGraph: {
    title: "Codeva Tech | Premium IT Solutions",
    description: "Solusi service laptop dan rakit PC premium dengan garansi terpercaya.",
    type: "website",
    locale: "id_ID",
    siteName: "Codeva Tech",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${spaceGrotesk.className} bg-background text-white antialiased selection:bg-primary/30 selection:text-primary-glow`}>
        {/* Background Pattern */}
        <div className="fixed inset-0 z-[-1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Pasang Navbar di sini supaya muncul di semua halaman */}
        <Navbar /> 
        
        {children}
      </body>
    </html>
  );
}