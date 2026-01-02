"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Box, Wrench, LogOut, Cpu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- CEK KEAMANAN (SATPAM) ---
  useEffect(() => {
    // Cek apakah user punya "tiket" login
    const isAdmin = localStorage.getItem("isAdmin");
    
    if (!isAdmin) {
      // Kalau tidak ada tiket, tendang ke login
      router.push("/login");
    } else {
      // Kalau ada, izinkan masuk
      setIsAuthorized(true);
    }
  }, [router]);

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); // Robek tiketnya
    router.push("/login");
  };

  // Tampilkan layar kosong dulu sebelum yakin user boleh masuk (biar tidak kedip)
  if (!isAuthorized) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-mono animate-pulse">Memeriksa Otoritas...</div>;
  }

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Inventory Stok", icon: Box, href: "/dashboard/inventory" },
    { name: "Service Queue", icon: Wrench, href: "/dashboard/service" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-white font-sans">
      
      {/* SIDEBAR KIRI */}
      <aside className="w-64 border-r border-white/10 bg-surface hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Cpu className="w-8 h-8 text-primary mr-3" />
          <div>
            <div className="text-lg font-bold tracking-wider leading-none">Codeva</div>
            <div className="text-xs text-primary font-mono mt-1">ADMIN SYSTEM</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,220,130,0.15)]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "group-hover:text-primary transition-colors"}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Logout System</span>
          </button>
        </div>
      </aside>

      {/* KONTEN KANAN */}
      <main className="flex-1 overflow-y-auto bg-black/50">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-surface/50 backdrop-blur-md sticky top-0 z-30">
          <h2 className="text-gray-400 text-sm hidden md:block">Session ID: <span className="font-mono text-primary">SECURE-{Math.floor(Math.random()*9999)}</span></h2>
          <div className="flex items-center gap-3 ml-auto">
             <div className="text-right hidden sm:block">
                <div className="text-white font-bold text-sm">Admin Zacky</div>
                <div className="text-primary text-[10px] uppercase tracking-wider">Super User</div>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-white">
                    Z
                </div>
             </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}