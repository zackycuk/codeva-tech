"use client";
import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Package, RefreshCw, X, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import { motion, AnimatePresence } from "framer-motion";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State Form (+ File Gambar)
  const [formData, setFormData] = useState({ name: "", category: "Laptop", price: "", stock: "" });
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // --- READ DATA ---
  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- HANDLE PILIH FILE ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  // --- CREATE DATA + UPLOAD IMAGE ---
  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Lengkapi data wajib!");
      return;
    }
    setIsSaving(true);
    let finalImageUrl = null;

    // 1. UPLOAD FOTO (Jika ada)
    if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
        const { error: uploadError } = await supabase.storage.from('products').upload(fileName, imageFile);

        if (uploadError) {
            alert("Gagal upload gambar: " + uploadError.message);
            setIsSaving(false);
            return;
        }

        const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
    }

    // 2. SIMPAN DATA
    const { error } = await supabase.from('products').insert([{
        name: formData.name,
        category: formData.category,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        status: parseInt(formData.stock) > 0 ? "Ready" : "Habis",
        image_url: finalImageUrl
    }]);

    if (!error) {
      setIsModalOpen(false);
      fetchProducts();
      setFormData({ name: "", category: "Laptop", price: "", stock: "" });
      setImageFile(null);
      setPreviewUrl(null);
    } else {
        alert("Gagal simpan data: " + error.message);
    }
    setIsSaving(false);
  };

  // --- DELETE DATA ---
  const handleDelete = async (id: number) => {
    if(!confirm("Hapus barang ini?")) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Style Input (Kita simpan di variabel biar rapi dan pasti jalan)
  const inputClass = "w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all";

  return (
    <div className="space-y-6 relative min-h-screen pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                Inventory Real-Time 
                {loading && <RefreshCw className="w-5 h-5 animate-spin text-primary"/>}
            </h1>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary-glow flex items-center gap-2 shadow-[0_0_15px_rgba(0,220,130,0.4)]">
            <Plus className="w-5 h-5" /> Tambah Barang
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-surface p-4 rounded-xl border border-white/10 relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
            type="text" 
            placeholder="Cari barang..." 
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-primary transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-white/10 bg-surface overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-white uppercase font-bold text-xs">
                <tr><th className="p-4">Produk</th><th className="p-4">Harga</th><th className="p-4">Stok</th><th className="p-4 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {filteredProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium text-white flex items-center gap-3">
                            {/* Thumbnail Foto */}
                            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {item.image_url ? (
                                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Package className="w-5 h-5 text-gray-600"/>
                                )}
                            </div>
                            <div>
                                <div className="font-bold">{item.name}</div>
                                <div className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded inline-block mt-1">{item.category}</div>
                            </div>
                        </td>
                        <td className="p-4 text-primary font-bold font-mono">Rp {item.price.toLocaleString("id-ID")}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.stock > 0 ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
                                {item.stock} Unit
                            </span>
                        </td>
                        <td className="p-4 text-right">
                            <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded transition">
                                <Trash2 className="w-4 h-4"/>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* --- MODAL FORM --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }} 
                className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Header Modal */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold text-white">Tambah Barang Baru</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition"><X className="w-5 h-5" /></button>
              </div>

              {/* Body Modal */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* Area Upload Foto */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Foto Produk</label>
                    <div className="relative group">
                        <label className="w-full h-48 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all overflow-hidden bg-black/30">
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm font-bold">Klik untuk ganti foto</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                                    </div>
                                    <span className="text-sm text-gray-400 font-medium">Klik untuk upload foto</span>
                                    <span className="text-[10px] text-gray-600 mt-1">JPG, PNG, WEBP (Max 2MB)</span>
                                </>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nama Barang</label>
                    <input autoFocus type="text" className={inputClass} placeholder="Contoh: Asus ROG Strix G15" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Kategori</label>
                    <select className={inputClass} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value="Laptop" className="bg-black text-white">Laptop & PC</option>
                        <option value="Hardware" className="bg-black text-white">Hardware (RAM/SSD)</option>
                        <option value="Aksesoris" className="bg-black text-white">Aksesoris (Mouse/Keyboard)</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Harga (Rp)</label>
                        <input type="number" className={inputClass} placeholder="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Stok Awal</label>
                        <input type="number" className={inputClass} placeholder="0" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                    </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white font-medium transition">Batal</button>
                <button onClick={handleSaveProduct} disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold hover:bg-primary-glow shadow-[0_0_20px_rgba(0,220,130,0.2)] flex items-center gap-2 disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
                    Simpan Produk
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}