"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, ArrowLeft, CheckCircle, Shield, Truck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error("Error:", error);
      else setProduct(data);
      
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary animate-pulse">Memuat data produk...</div>;
  
  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-gray-500">Produk tidak ditemukan.</div>;

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        
        {/* Tombol Kembali */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* KIRI: FOTO BESAR */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="aspect-square bg-[#111] border border-white/10 rounded-3xl overflow-hidden relative group">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-600">No Image Available</div>
                    )}
                    
                    {/* Badge Stok */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span className="text-xs font-bold text-white">{product.stock > 0 ? `Stok: ${product.stock}` : "Habis"}</span>
                    </div>
                </div>
            </motion.div>

            {/* KANAN: DETAIL INFO */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-2">
                    <span className="text-primary text-sm font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                        {product.category || 'Laptop'}
                    </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>
                
                <div className="text-4xl font-bold text-white mb-8 font-mono">
                    Rp {product.price?.toLocaleString("id-ID")}
                </div>

                {/* --- BAGIAN DESKRIPSI (VERSI FINAL DENGAN DATABASE SPECS) --- */}
                <div className="bg-[#111] border border-white/10 p-6 rounded-xl mb-8">
                    <h3 className="text-lg font-bold text-white mb-3 border-b border-white/10 pb-2">
                        Spesifikasi & Detail
                    </h3>
                    
                    {/* Tampilkan data 'specs' dari database */}
                    {/* whitespace-pre-line membuat tombol Enter saat input admin terbaca sebagai baris baru */}
                    <p className="text-gray-400 whitespace-pre-line leading-relaxed text-sm">
                        {product.specs || "Belum ada deskripsi spesifik untuk produk ini."}
                    </p>

                    {/* Info Tambahan Pemanis */}
                    <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Lulus QC Ketat</div>
                        <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Free Install App</div>
                        <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Garansi 7 Hari</div>
                        <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Siap Pakai</div>
                    </div>
                </div>
                {/* ------------------------------------------- */}

                {/* Tombol Aksi */}
                <div className="flex gap-4">
                    <Link 
                        href={`https://wa.me/6281234567890?text=Halo%20Codeva,%20saya%20mau%20order%20${product.name}`}
                        target="_blank"
                        className="flex-1 bg-primary text-black font-bold py-4 rounded-xl hover:bg-green-400 shadow-[0_0_20px_rgba(0,220,130,0.4)] transition flex items-center justify-center gap-2 text-lg"
                    >
                        <ShoppingCart className="w-5 h-5" /> Beli Sekarang
                    </Link>
                </div>

                {/* Footer Kecil */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-gray-600" />
                        <div className="text-xs text-gray-400">
                            <div className="font-bold text-white">Garansi Aman</div>
                            Jaminan uang kembali
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Truck className="w-8 h-8 text-gray-600" />
                        <div className="text-xs text-gray-400">
                            <div className="font-bold text-white">Pengiriman Cepat</div>
                            Packing kayu tersedia
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
      </div>
    </main>
  );
}