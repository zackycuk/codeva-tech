"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import wajib
import { motion } from "framer-motion";
import { Cpu, Menu } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname(); // Cek kita lagi di halaman mana

  // LOGIKA PENTING: Jika sedang di halaman dashboard, jangan tampilkan Navbar ini
  if (pathname.startsWith("/dashboard")) {
    return null; 
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,220,130,0.5)]">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-white">
              Codeva Tech
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-primary hover:shadow-primary/50 transition-all duration-300">Home</Link>
            <Link href="/#services" className="hover:text-primary transition-colors">Services</Link>
            <Link href="/finder" className="hover:text-primary transition-colors">Laptop Finder</Link>
            <Link href="/#products" className="hover:text-primary transition-colors">Shop</Link>
          </div>

          <div className="flex items-center gap-4">
             <button className="hidden md:block px-5 py-2 text-sm font-semibold text-background bg-primary hover:bg-primary-glow rounded-full transition-all shadow-[0_0_20px_rgba(0,220,130,0.4)]">
              Konsultasi
            </button>
            <Menu className="w-6 h-6 text-white md:hidden cursor-pointer" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}