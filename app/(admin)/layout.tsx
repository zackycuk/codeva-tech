"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Box, Wrench, LogOut, Cpu } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🔐 KUNCI RAHASIA: Harus SAMA PERSIS dengan yang di halaman Login
    const session = localStorage.getItem("codeva_admin_session");

    if (!session) {
      // Kalau gak ada tiket, tendang balik ke login
      router.push("/login");
    } else {
      // Kalau ada, izinkan masuk
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    // Hapus tiket biar bisa keluar
    localStorage.removeItem("codeva_admin_session");
    router.push("/login");
  };

  // Tampilan saat loading (Biar gak blank hitam doang)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-primary font-mono animate-pulse">Memeriksa Otoritas...</div>
      </div>
    );
  }

  // --- TAMPILAN DASHBOARD (SIDEBAR + KONTEN) ---
  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      
      {/* SIDEBAR KIRI (Tetap diam) */}
      <aside className="w-64 border-r border-white/10 bg-surface hidden md:flex flex-col fixed h-full z-20">
        {/* Logo Admin */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-wide">Admin<span className="text-primary">Panel</span></span>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-4 space-y-2">
            <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" active={pathname === "/dashboard"} />
            <NavItem href="/dashboard/inventory" icon={Box} label="Inventory" active={pathname === "/dashboard/inventory"} />
            <NavItem href="/dashboard/service" icon={Wrench} label="Service Masuk" active={pathname === "/dashboard/service"} />
        </nav>

        {/* Tombol Logout */}
        <div className="p-4 border-t border-white/10">
            <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold"
            >
                <LogOut className="w-5 h-5" /> Keluar
            </button>
        </div>
      </aside>

      {/* AREA KONTEN KANAN (Berubah-ubah) */}
      <main className="flex-1 md:ml-64 p-8 relative">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[100px] -z-10 pointer-events-none"></div>
        
        {children}
      </main>
    </div>
  );
}

// Komponen Kecil untuk Tombol Menu
function NavItem({ href, icon: Icon, label, active }: any) {
    return (
        <Link 
            href={href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                active 
                ? "bg-primary text-black shadow-[0_0_15px_rgba(0,220,130,0.4)] font-bold" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </Link>
    )
}