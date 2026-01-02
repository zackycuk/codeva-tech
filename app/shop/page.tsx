"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, ShoppingCart, Filter, Laptop, Cpu, Mouse, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Ambil SEMUA data produk yang ready stock
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .gt('stock', 0) // Hanya yang stok ada
        .order('created_at', { ascending: false });
      
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Logika Filter (Category + Search)
  const filteredProducts = products.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen pt-24 pb-12 bg-black text-white">
      <div className="container mx-auto px-4">
        
        {/* HEADER & FILTER BAR */}
        <div className="mb-10 space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">Katalog Produk</h1>
                <p className="text-gray-400">Temukan hardware impian Anda di sini.</p>
            </div>

            {/* Controls Container */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface border border-white/10 p-4 rounded-2xl sticky top-20 z-30 backdrop-blur-md bg-black/80">
                
                {/* Kategori Buttons */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
                    <FilterButton label="Semua" active={selectedCategory === "All"} onClick={() => setSelectedCategory("All")} icon={SlidersHorizontal} />
                    <FilterButton label="Laptop" active={selectedCategory === "Laptop"} onClick={() => setSelectedCategory("Laptop")} icon={Laptop} />
                    <FilterButton label="Hardware" active={selectedCategory === "Hardware"} onClick={() => setSelectedCategory("Hardware")} icon={Cpu} />
                    <FilterButton label="Aksesoris" active={selectedCategory === "Aksesoris"} onClick={() => setSelectedCategory("Aksesoris")} icon={Mouse} />
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Cari produk..." 
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
            <div className="text-center py-20 animate-pulse text-gray-500">Memuat katalog...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((item, index) => (
                        <ProductCard key={item.id} item={item} index={index} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-2xl text-gray-500">
                        Produk tidak ditemukan. Coba kata kunci lain.
                    </div>
                )}
            </div>
        )}
      </div>
    </main>
  );
}

// --- KOMPONEN KECIL (HELPER) ---

function FilterButton({ label, active, onClick, icon: Icon }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                active 
                ? "bg-primary text-black shadow-[0_0_15px_rgba(0,220,130,0.4)]" 
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
            <Icon className="w-4 h-4" /> {label}
        </button>
    )
}

function ProductCard({ item, index }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col"
        >
            {/* AREA GAMBAR (Bisa Diklik -> Ke Detail) */}
            <Link href={`/shop/${item.id}`} className="block h-48 bg-black/50 relative overflow-hidden flex items-center justify-center cursor-pointer">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="flex flex-col items-center gap-2 opacity-30">
                        <Laptop className="w-12 h-12" />
                        <span className="text-[10px]">No Image</span>
                    </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-gray-300 border border-white/10">
                    {item.category}
                </div>
            </Link>

            {/* Info Area */}
            <div className="p-5 flex-1 flex flex-col">
                <Link href={`/shop/${item.id}`}>
                    <h3 className="font-bold text-white text-lg mb-1 leading-tight line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                        {item.name}
                    </h3>
                </Link>
                <div className="mt-auto pt-4 flex justify-between items-center">
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold">Harga</div>
                        <div className="text-primary font-bold text-lg">Rp {item.price.toLocaleString("id-ID")}</div>
                    </div>
                    {/* Tombol Beli Langsung */}
                    <Link 
                        href={`https://wa.me/6281234567890?text=Halo%20Codeva,%20saya%20tertarik%20beli%20${item.name}`}
                        target="_blank"
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-primary hover:text-black transition-colors"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}