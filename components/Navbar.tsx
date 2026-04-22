"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Efek transparan saat di atas, solid saat discroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Jangan tampilkan Navbar di halaman Login atau Dashboard Admin
  if (pathname.startsWith("/dashboard") || pathname === "/login") return null;

  // 👇 DITAMBAHKAN DISINI: "Cek Servis" 👇
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Katalog", href: "/shop" },
    { name: "Laptop Finder", href: "/finder" },
    { name: "Cek Servis", href: "/track" }, // <--- INI BARU
    { name: "Service Info", href: "/#services" }, 
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${scrolled ? "bg-background/70 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-transparent py-5"}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold text-white tracking-wide transition-colors group-hover:text-primary">
              CodevaTech
            </span>
          </Link>

          {/* DESKTOP MENU (Otomatis Rapi) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`relative text-sm font-bold uppercase tracking-wider hover:text-white py-1 transition-colors ${pathname === link.href ? "text-white" : "text-gray-400"}`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(0,220,130,0.8)] rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ACTION BUTTON */}
          <div className="hidden md:flex items-center gap-4">
             <Link href="https://wa.me/6281234567890" target="_blank" className="px-6 py-2.5 rounded-full border border-primary/50 text-primary font-bold text-sm hover:bg-primary hover:text-background hover:shadow-[0_0_20px_rgba(0,220,130,0.4)] transition-all duration-300">
                Konsultasi
             </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-white"><X className="w-8 h-8" /></button>
            
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-bold hover:text-primary ${pathname === link.href ? "text-primary" : "text-white"}`}
              >
                {link.name}
              </Link>
            ))}

            <Link href="/dashboard" className="text-gray-500 text-sm mt-10">
                Login Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}