"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Laptop, DollarSign, Briefcase, Gamepad2, PenTool, Code, ArrowRight, RefreshCcw, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function FinderPage() {
  const [step, setStep] = useState(1);
  const [usage, setUsage] = useState(""); // office, gaming, design, coding
  const [budget, setBudget] = useState(10000000); // Default 10 Juta
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Opsi Kebutuhan
  const usages = [
    { id: "office", label: "Kuliah / Ngetik", icon: Briefcase, desc: "Ringan, baterai awet, Microsoft Office." },
    { id: "design", label: "Desain & Editing", icon: PenTool, desc: "Layar akurat, kuat render video ringan." },
    { id: "gaming", label: "Gaming Berat", icon: Gamepad2, desc: "Performa maksimal, pendingin bagus." },
    { id: "coding", label: "Programming", icon: Code, desc: "RAM besar, multitasking lancar." },
  ];

  // --- LOGIKA PENCARI "DETEKTIF" ---
  const findLaptops = async () => {
    setLoading(true);
    
    // 1. Ambil SEMUA produk laptop
    const { data: allLaptops } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'Laptop') // Pastikan cuma ambil laptop
      .gt('stock', 0); // Yang ready aja

    if (!allLaptops) {
        setResults([]);
        setLoading(false);
        setStep(3);
        return;
    }

    // 2. FILTER PINTAR (Di sini otaknya!)
    const filtered = allLaptops.filter((laptop) => {
        const price = laptop.price;
        const name = laptop.name.toLowerCase();

        // Syarat 1: Masuk Budget User?
        // (Kita kasih toleransi lebih mahal dikit 10% buat rekomendasi)
        if (price > budget * 1.1) return false; 

        // Syarat 2: Cocok sama Usage?
        if (usage === 'office') {
            // Office ga butuh yang mahal-mahal banget, prioritas harga murah
            return true; 
        }
        
        if (usage === 'gaming' || usage === 'design') {
            // Harus mahal (indikasi spek tinggi) ATAU punya nama gaming
            const isGamingLaptop = name.includes("tuf") || name.includes("rog") || name.includes("legion") || name.includes("nitro") || name.includes("rtx") || name.includes("gtx") || name.includes("gaming");
            const isExpensive = price > 7000000; // Asumsi di atas 7jt udah lumayan
            return isGamingLaptop || isExpensive;
        }

        if (usage === 'coding') {
            // Coding butuh yang mid-range, jangan yang terlalu kentang
            return price > 4000000; 
        }

        return true;
    });

    // Urutkan: Yang mendekati budget user ditaruh paling atas
    filtered.sort((a, b) => b.price - a.price);

    setResults(filtered);
    setTimeout(() => {
        setLoading(false);
        setStep(3);
    }, 1000); // Gimmick loading biar berasa mikir
  };

  const resetFinder = () => {
    setStep(1);
    setUsage("");
    setResults([]);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Laptop Finder AI</h1>
            <p className="text-gray-400">Jawab 2 pertanyaan, kami carikan jodoh laptop untukmu.</p>
        </div>

        {/* --- STEP 1: PILIH KEBUTUHAN --- */}
        {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="text-xl font-bold text-center">Mau dipakai buat apa?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {usages.map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => { setUsage(item.id); setStep(2); }}
                            className="flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-surface hover:border-primary hover:bg-white/5 transition-all group text-left"
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-lg text-white group-hover:text-primary transition-colors">{item.label}</div>
                                <div className="text-sm text-gray-400">{item.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>
        )}

        {/* --- STEP 2: BUDGET --- */}
        {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-lg mx-auto text-center">
                <h2 className="text-xl font-bold">Berapa budget maksimalmu?</h2>
                
                <div className="py-8">
                    <div className="text-4xl font-bold text-primary font-mono mb-6">
                        Rp {budget.toLocaleString("id-ID")}
                    </div>
                    <input 
                        type="range" 
                        min="3000000" 
                        max="30000000" 
                        step="500000"
                        value={budget}
                        onChange={(e) => setBudget(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-glow"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                        <span>3 Juta</span>
                        <span>30 Juta++</span>
                    </div>
                </div>

                <button 
                    onClick={findLaptops}
                    className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary-glow shadow-[0_0_20px_rgba(0,220,130,0.4)] transition flex items-center justify-center gap-2"
                >
                    <Search className="w-5 h-5" /> Cari Sekarang
                </button>
                <button onClick={() => setStep(1)} className="text-gray-500 text-sm hover:text-white">Kembali</button>
            </motion.div>
        )}

        {/* --- STEP 3: LOADING --- */}
        {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <RefreshCcw className="w-10 h-10 text-primary animate-spin" />
                <p className="text-gray-400 animate-pulse">Sedang menganalisa spek...</p>
            </div>
        )}

        {/* --- STEP 4: HASIL --- */}
        {step === 3 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Rekomendasi Kami ({results.length})</h2>
                    <button onClick={resetFinder} className="text-sm text-primary hover:underline flex items-center gap-1">
                        <RefreshCcw className="w-3 h-3" /> Ulangi
                    </button>
                </div>

                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {results.map((item, idx) => (
                            <div key={item.id} className="bg-surface border border-white/10 rounded-2xl p-4 flex gap-4 hover:border-primary/50 transition-all group">
                                <div className="w-24 h-24 bg-black rounded-lg overflow-hidden flex-shrink-0">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600"><Laptop /></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                    <div className="text-primary font-bold font-mono">Rp {item.price.toLocaleString("id-ID")}</div>
                                    <div className="mt-3 flex items-center gap-2">
                                        <Link href={`/shop/${item.id}`} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">
                                            Lihat Detail
                                        </Link>
                                        <Link href={`https://wa.me/6281234567890?text=Halo,%20saya%20mau%20${item.name}`} target="_blank" className="text-xs bg-primary/20 text-primary hover:bg-primary hover:text-black px-3 py-1.5 rounded-lg transition font-bold">
                                            Beli
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-gray-400 mb-4">Waduh, belum ada laptop yang pas sama kriteria ini.</p>
                        <button onClick={() => setStep(2)} className="text-primary font-bold hover:underline">Coba naikkan budget dikit?</button>
                    </div>
                )}
            </motion.div>
        )}

      </div>
    </main>
  );
}