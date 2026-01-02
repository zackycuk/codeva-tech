"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Search, Laptop, DollarSign, Briefcase, Gamepad2, PenTool, Frown } from "lucide-react";
import Link from "next/link";

export default function FinderPage() {
  // State untuk Input User
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(15000000); // Default 15 Juta
  const [usage, setUsage] = useState("");
  
  // State untuk Hasil
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // LOGIKA PENCARIAN
  const handleSearch = async () => {
    setLoading(true);
    setStep(3); 

    // Simulasi mikir "AI"
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Query ke Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'Laptop')
      .lte('price', budget) // Harga <= Budget
      .gt('stock', 0)       
      .order('price', { ascending: false }) 
      .limit(3);            

    if (!error) {
      setResults(data || []);
    }
    setHasSearched(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-24 pb-12 bg-black text-white overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        
        {/* HEADER */}
        <div className="text-center mb-12">
            <span className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                Smart Recommendation System
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cari Laptop Ideal Anda</h1>
            <p className="text-gray-400">Jawab 2 pertanyaan simpel, algoritma kami akan mencarikan stok terbaik untuk Anda.</p>
        </div>

        {/* --- STEP 1: PILIH PENGGUNAAN --- */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-surface border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Laptop className="text-primary"/> Untuk apa laptop digunakan?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UsageCard icon={Briefcase} label="Kerja / Kuliah" desc="Office, Zoom, Browsing" onClick={() => { setUsage("Work"); setStep(2); }} />
                <UsageCard icon={Gamepad2} label="Gaming Berat" desc="AAA Games, Streaming" onClick={() => { setUsage("Gaming"); setStep(2); }} />
                <UsageCard icon={PenTool} label="Desain / Editing" desc="Adobe, Blender, Coding" onClick={() => { setUsage("Design"); setStep(2); }} />
            </div>
          </motion.div>
        )}

        {/* --- STEP 2: TENTUKAN BUDGET --- */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-surface border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold mb-8 flex items-center justify-center gap-2"><DollarSign className="text-primary"/> Berapa budget maksimal Anda?</h2>
            
            <div className="mb-8">
                <div className="text-4xl font-bold text-primary mb-2">Rp {budget.toLocaleString("id-ID")}</div>
                <p className="text-sm text-gray-500">Geser untuk atur budget</p>
            </div>

            {/* PERBAIKAN DI SINI: min="0" supaya bisa geser sampai mentok kiri */}
            <input 
                type="range" 
                min="0"             
                max="50000000" 
                step="500000" 
                value={budget} 
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary mb-8"
            />

            <div className="flex gap-4 justify-center">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition">Kembali</button>
                <button onClick={handleSearch} className="px-8 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary-glow shadow-[0_0_20px_rgba(0,220,130,0.4)] transition flex items-center gap-2">
                    Analisis & Cari <Search className="w-4 h-4"/>
                </button>
            </div>
          </motion.div>
        )}

        {/* --- STEP 3: HASIL PENCARIAN --- */}
        {step === 3 && (
            <div className="space-y-6">
                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-xl font-bold animate-pulse">Mencocokkan Spesifikasi...</h3>
                    </div>
                )}

                {/* Hasil Ditemukan */}
                {!loading && hasSearched && results.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Rekomendasi Terbaik ({results.length})</h2>
                            <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white underline">Ulangi Pencarian</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {results.map((item, idx) => (
                                <div key={item.id} className="relative bg-surface border border-white/10 p-6 rounded-2xl hover:border-primary/50 transition-all group">
                                    {idx === 0 && <div className="absolute -top-3 -right-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">⭐ Best Match</div>}
                                    
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-white/5 rounded-xl"><Laptop className="w-8 h-8 text-gray-300"/></div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 uppercase font-bold">Harga</div>
                                            <div className="text-xl font-bold text-primary">Rp {item.price.toLocaleString("id-ID")}</div>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                                    <p className="text-sm text-gray-400 mb-4">Cocok untuk kebutuhan {usage} dengan budget di bawah {(budget/1000000).toFixed(0)} Juta.</p>
                                    
                                    <Link href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20${item.name}%20hasil%20rekomendasi%20web`} target="_blank" className="block w-full py-3 bg-white/10 hover:bg-primary hover:text-black text-center rounded-xl font-bold transition-colors">
                                        Pesan Sekarang
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Tidak Ada Hasil (Stok Kosong) */}
                {!loading && hasSearched && results.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-surface border border-white/10 rounded-2xl">
                        <Frown className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold text-white mb-2">Maaf, Stok Kosong</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-6">Tidak ada laptop di database kami yang sesuai dengan budget Rp {budget.toLocaleString("id-ID")}. Coba naikkan budget Anda.</p>
                        <button onClick={() => setStep(2)} className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary-glow">Atur Ulang Budget</button>
                    </motion.div>
                )}
            </div>
        )}

      </div>
    </main>
  );
}

// Komponen Kartu Pilihan (Step 1)
function UsageCard({ icon: Icon, label, desc, onClick }: any) {
    return (
        <button onClick={onClick} className="text-left p-6 rounded-xl border border-white/10 bg-black/20 hover:bg-primary/10 hover:border-primary/50 transition-all group">
            <Icon className="w-8 h-8 text-gray-400 group-hover:text-primary mb-4 transition-colors"/>
            <h3 className="text-lg font-bold text-white mb-1">{label}</h3>
            <p className="text-sm text-gray-500 group-hover:text-gray-300">{desc}</p>
        </button>
    )
}