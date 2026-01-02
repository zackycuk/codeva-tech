"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Laptop, Cpu, Mouse, ImageOff } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductShowcase() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').gt('stock', 0).order('created_at', { ascending: false }).limit(8);
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const getFallbackIcon = (category: string) => {
    if (category === "Laptop") return <Laptop className="w-12 h-12 text-gray-600" />;
    return <Cpu className="w-12 h-12 text-gray-600" />;
  };

  if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Sedang memuat produk...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((item, index) => (
        <motion.div 
            key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}
            className="group bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-xl"
        >
            {/* BAGIAN GAMBAR - Cek apakah ada image_url */}
            <div className="h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
                {item.image_url ? (
                    <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                ) : (
                    // Fallback kalau admin malas upload foto
                    <div className="flex flex-col items-center gap-2 opacity-50">
                        {getFallbackIcon(item.category)}
                        <span className="text-xs text-gray-500">No Image</span>
                    </div>
                )}
                
                {/* Badge Stok */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">
                    Sisa: {item.stock}
                </div>
            </div>

            <div className="p-5">
                <div className="text-xs font-bold text-gray-500 mb-1 uppercase">{item.category}</div>
                <h3 className="font-bold text-white text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                <div className="flex justify-between items-end">
                    <div className="text-primary font-bold text-xl">Rp {item.price.toLocaleString("id-ID")}</div>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-primary hover:text-black transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
      ))}
    </div>
  );
}