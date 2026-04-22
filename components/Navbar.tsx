"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [consultForm, setConsultForm] = useState({
    name: "", address: "", laptopType: "", issue: ""
  });

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, address, laptopType, issue } = consultForm;
    if (!name || !laptopType || !issue) return alert("Harap isi bidang yang wajib!");
    
    const text = `Halo Codeva Tech, saya ingin konsultasi servis.\n\nNama: ${name}\nAlamat: ${address || '-'}\nTipe Laptop/PC: ${laptopType}\nKendala: ${issue}`;
    const url = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsConsultOpen(false);
    setConsultForm({ name: "", address: "", laptopType: "", issue: "" });
  };
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
             <button onClick={() => setIsConsultOpen(true)} className="px-6 py-2.5 rounded-full border border-primary/50 text-primary font-bold text-sm hover:bg-primary hover:text-background hover:shadow-[0_0_20px_rgba(0,220,130,0.4)] transition-all duration-300">
                Konsultasi
             </button>
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

            <button 
                onClick={() => { setIsOpen(false); setIsConsultOpen(true); }}
                className="mt-4 px-8 py-3 rounded-full bg-primary text-black font-bold text-xl"
            >
                Konsultasi
            </button>

            <Link href="/dashboard" className="text-gray-500 text-sm mt-10">
                Login Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      {/* FORM KONSULTASI MODAL */}
      <AnimatePresence>
        {isConsultOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
            >
              <button onClick={() => setIsConsultOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Mulai Konsultasi</h2>
                <p className="text-gray-400 text-sm mb-6">Isi form di bawah ini dan kami akan segera membalas Anda via WhatsApp untuk mendiskusikan masalah Anda.</p>
                
                <form onSubmit={handleConsultSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Nama Lengkap *</label>
                    <input required autoFocus type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mt-1 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Nama Anda"
                      value={consultForm.name} onChange={e => setConsultForm({...consultForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Tipe Laptop / PC *</label>
                    <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mt-1 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Contoh: Asus ROG / PC Rakitan"
                      value={consultForm.laptopType} onChange={e => setConsultForm({...consultForm, laptopType: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Alamat Penjemputan (Opsional)</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mt-1 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Alamat lengkap..."
                      value={consultForm.address} onChange={e => setConsultForm({...consultForm, address: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Kendala Utama *</label>
                    <textarea required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mt-1 outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24 resize-none transition-all" placeholder="Ceritakan masalahnya (e.g. mati total, blue screen, keyboard rusak)"
                      value={consultForm.issue} onChange={e => setConsultForm({...consultForm, issue: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="w-full px-6 py-3.5 rounded-xl bg-primary text-black font-bold hover:bg-primary-glow transition-all duration-300 shadow-[0_0_20px_rgba(0,220,130,0.3)] mt-4">
                    Kirim ke WhatsApp
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}