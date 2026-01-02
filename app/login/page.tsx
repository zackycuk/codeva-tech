"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Cpu, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cek kalau udah login, langsung lempar ke dashboard (gak usah login lagi)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("codeva_admin_session");
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Wajib biar gak reload
    setError("");
    setLoading(true);

    // --- 🔐 LOGIKA RAHASIA (SATPAM) ---
    // Di sini kita set username & password manual dulu biar aman & cepat.
    // Nanti kalau mau canggih bisa connect ke Supabase Auth.
    
    const EMAIL_RAHASIA = "admin@codeva.tech";
    const PASSWORD_RAHASIA = "admin123";

    // Cek Kecocokan
    if (email === EMAIL_RAHASIA && password === PASSWORD_RAHASIA) {
        // ✅ BERHASIL
        // Kita kasih "Stempel" di browser biar bisa akses halaman lain
        localStorage.setItem("codeva_admin_session", "true");
        
        // Kasih jeda dikit biar ada efek loading keren
        setTimeout(() => {
            router.push("/dashboard"); 
        }, 1000);
    } else {
        // ❌ GAGAL
        setError("Email atau Password salah! Jangan ngasal ya.");
        setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black z-0"></div>
      
      <div className="bg-surface border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 backdrop-blur-md">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary animate-pulse">
                <Cpu className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-400 text-sm">Masuk untuk mengelola Codeva Tech</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Alert Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2 animate-bounce">
                    <AlertTriangle className="w-4 h-4" /> {error}
                </div>
            )}

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Akses</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="admin@codeva.tech"
                />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary-glow hover:shadow-[0_0_20px_rgba(0,220,130,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Masuk Dashboard <ArrowRight className="w-4 h-4" /></>}
            </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
                Lupa password? Hubungi Developer (Zacky).
            </p>
        </div>
      </div>
    </main>
  );
}