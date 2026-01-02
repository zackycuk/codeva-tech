"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Smartphone, Wrench, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setLoading(true);
    setHasSearched(false);
    setResults([]);

    // Cari servis berdasarkan No HP
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .ilike('phone', `%${phone}%`) // Pakai ilike biar fleksibel
      .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
    } else {
        setResults(data || []);
    }
    
    setHasSearched(true);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'Done': 
            return <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 text-xs font-bold"><CheckCircle size={14}/> Selesai / Bisa Diambil</span>;
        case 'Repairing': 
            return <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 text-xs font-bold"><Wrench size={14}/> Sedang Dikerjakan</span>;
        case 'Waiting Part': 
            return <span className="flex items-center gap-1 text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-xs font-bold"><Clock size={14}/> Menunggu Sparepart</span>;
        case 'Cancel': 
            return <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 text-xs font-bold"><XCircle size={14}/> Dibatalkan</span>;
        default: 
            return <span className="flex items-center gap-1 text-gray-400 bg-gray-500/10 px-3 py-1 rounded-full border border-gray-500/20 text-xs font-bold"><AlertCircle size={14}/> Pengecekan / Antri</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-10 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                Cek Status Servis
            </h1>
            <p className="text-gray-400 text-sm">Masukan nomor WhatsApp yang terdaftar untuk melacak perbaikan Anda.</p>
        </div>

        {/* SEARCH BOX */}
        <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-xl opacity-20 group-hover:opacity-40 transition blur"></div>
            <div className="relative flex bg-black rounded-xl border border-white/10 overflow-hidden">
                <div className="pl-4 py-4 text-gray-500">
                    <Smartphone className="w-5 h-5" />
                </div>
                <input 
                    type="text" 
                    className="flex-1 bg-transparent text-white p-4 outline-none placeholder:text-gray-600 font-mono"
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button type="submit" disabled={loading} className="px-6 bg-white/5 hover:bg-white/10 text-primary font-bold transition flex items-center justify-center min-w-[80px]">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
            </div>
        </form>

        {/* HASIL PENCARIAN */}
        <div className="space-y-4">
            {hasSearched && results.length === 0 && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-500">Data tidak ditemukan untuk nomor tersebut.</p>
                    <p className="text-xs text-gray-600 mt-1">Pastikan nomor WA sesuai saat pendaftaran.</p>
                </motion.div>
            )}

            {results.map((item, index) => (
                <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface border border-white/10 p-6 rounded-2xl hover:border-primary/50 transition-colors group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-lg text-white">{item.device_name}</h3>
                            <p className="text-sm text-gray-500">ID: #SRV-{item.id}</p>
                        </div>
                        {getStatusBadge(item.status)}
                    </div>

                    <div className="space-y-3 border-t border-white/5 pt-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Keluhan</p>
                            <p className="text-sm text-gray-300">{item.issue}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Estimasi Biaya</p>
                                <p className="text-lg font-mono text-primary font-bold">
                                    {item.price ? `Rp ${item.price.toLocaleString('id-ID')}` : 'Rp -'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tanggal Masuk</p>
                                <p className="text-sm text-white">
                                    {new Date(item.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* BACK BUTTON */}
        <div className="text-center pt-8">
            <Link href="/" className="text-sm text-gray-500 hover:text-white flex items-center justify-center gap-2">
                 Kembali ke Beranda
            </Link>
        </div>

      </div>
    </div>
  );
}