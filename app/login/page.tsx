"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Cpu, ArrowRight, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // --- PASSWORD RAHASIA (Hardcoded sederhana dulu) ---
    // Nanti bisa kita upgrade pakai Supabase Auth kalau mau lebih canggih
    const SECRET_PIN = "admin123"; 

    if (password === SECRET_PIN) {
      // Simpan "Tiket Masuk" di browser
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("loginTime", new Date().toISOString());
      
      // Redirect ke Dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      setError("AKSES DITOLAK: Password salah!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Matrix Effect (Simulasi) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] animate-pulse"></div>

      <div className="relative w-full max-w-md bg-surface border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Restricted Area</h1>
            <p className="text-gray-500 text-sm mt-2">Hanya personel Codeva Tech yang diizinkan masuk.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Security PIN</label>
                <input 
                    type="password" 
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-center tracking-[0.5em] font-mono text-xl placeholder:tracking-normal"
                    placeholder="••••••"
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-bold justify-center bg-red-500/10 p-2 rounded-lg border border-red-500/20 animate-shake">
                    <AlertTriangle className="w-4 h-4" /> {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-black font-bold py-3.5 rounded-xl hover:bg-primary-glow transition-all shadow-[0_0_20px_rgba(0,220,130,0.3)] flex items-center justify-center gap-2 group"
            >
                {loading ? "Memverifikasi..." : (
                    <>
                        Masuk Sistem <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>

        <div className="mt-8 text-center">
             <p className="text-xs text-gray-600 font-mono">IP: {Math.random().toString(36).substring(7).toUpperCase()} DETECTED</p>
        </div>
      </div>
    </div>
  );
}