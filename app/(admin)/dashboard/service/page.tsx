"use client";
import { useEffect, useState } from "react";
import { Plus, Wrench, Save, X, Search, Trash2, Edit, MapPin, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function ServicePage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // FORM DATA (Lengkap dengan Address)
  const [formData, setFormData] = useState({
    customer_name: "",
    device_name: "",
    issue: "",
    phone: "",
    address: "", // <-- KOLOM BARU
    price: "0",
    status: "Pending"
  });

  // --- 1. AMBIL DATA (READ) ---
  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetch:", error);
    else setServices(data || []);
    
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  // --- 2. TAMBAH DATA (CREATE) ---
  const handleSaveService = async () => {
    if (!formData.customer_name || !formData.device_name) {
        alert("Nama Pelanggan & Barang wajib diisi!");
        return;
    }
    setIsSaving(true);

    // Kirim data ke Supabase (termasuk alamat)
    const { error } = await supabase.from('services').insert([{
        customer_name: formData.customer_name,
        device_name: formData.device_name,
        issue: formData.issue,
        phone: formData.phone,
        address: formData.address, // <-- SIMPAN ALAMAT
        price: parseInt(formData.price),
        status: "Pending"
    }]);

    if (!error) {
        setIsModalOpen(false);
        // Reset form jadi kosong lagi
        setFormData({ customer_name: "", device_name: "", issue: "", phone: "", address: "", price: "0", status: "Pending" });
        fetchServices(); // Refresh data
    } else {
        alert("Gagal simpan: " + error.message);
    }
    setIsSaving(false);
  };

  // --- 3. UBAH STATUS & HARGA ---
  const updateStatus = async (id: number, newStatus: string) => {
    await supabase.from('services').update({ status: newStatus }).eq('id', id);
    fetchServices();
  };

  const updatePrice = async (id: number, currentPrice: number) => {
    const newPrice = prompt("Masukkan biaya servis baru:", currentPrice.toString());
    if (newPrice !== null) {
        await supabase.from('services').update({ price: parseInt(newPrice) }).eq('id', id);
        fetchServices();
    }
  };

  // --- 4. HAPUS DATA ---
  const handleDelete = async (id: number) => {
    if (confirm("Yakin mau hapus data servis ini?")) {
        await supabase.from('services').delete().eq('id', id);
        fetchServices();
    }
  };

  // Filter Pencarian & Warna Status
  const filteredServices = services.filter(s => 
    s.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.device_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Done': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Repairing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'Waiting Part': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'Cancel': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                Service Masuk 
                <span className="text-sm bg-white/10 px-2 py-1 rounded-full text-gray-400">{services.length} Unit</span>
            </h1>
            <p className="text-gray-400 text-sm">Kelola antrian perbaikan teknisi.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary-glow shadow-[0_0_15px_rgba(0,220,130,0.4)] flex items-center gap-2">
            <Plus className="w-5 h-5" /> Servis Baru
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-surface p-4 rounded-xl border border-white/10 relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
            type="text" 
            placeholder="Cari nama pelanggan atau tipe laptop..." 
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-primary transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* DAFTAR SERVIS */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? <div className="text-center py-10 text-gray-500 animate-pulse">Memuat data servis...</div> : 
         filteredServices.map((item) => (
            <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all group"
            >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* INFO UTAMA (KIRI) */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{item.customer_name}</h3>
                            <span className="text-xs text-gray-500 font-mono bg-black/30 px-2 py-0.5 rounded">#{item.id}</span>
                        </div>
                        
                        {/* Info Kontak & Alamat (Disini Munculnya) */}
                        <div className="text-sm text-gray-400 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-primary" /> {item.phone || "-"}
                            </div>
                            {item.address && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" /> 
                                    <span className="leading-tight text-gray-500">{item.address}</span>
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-white/5 my-2 w-full"></div>

                        <div className="text-primary font-medium flex items-center gap-2">
                            <Wrench className="w-4 h-4" /> {item.device_name}
                        </div>
                        <p className="text-sm text-gray-400">Keluhan: <span className="text-white italic">"{item.issue}"</span></p>
                    </div>

                    {/* STATUS & AKSI (KANAN) */}
                    <div className="flex flex-col items-start md:items-end gap-3 min-w-[200px]">
                        
                        {/* Dropdown Status */}
                        <select 
                            value={item.status}
                            onChange={(e) => updateStatus(item.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border appearance-none cursor-pointer outline-none ${getStatusColor(item.status)}`}
                        >
                            <option value="Pending">Checking</option>
                            <option value="Repairing">Sedang Dikerjakan</option>
                            <option value="Waiting Part">Menunggu Sparepart</option>
                            <option value="Done">Selesai / Bisa Diambil</option>
                            <option value="Cancel">Batal</option>
                        </select>

                        {/* Edit Harga */}
                        <div onClick={() => updatePrice(item.id, item.price)} className="text-xl font-bold font-mono text-white cursor-pointer hover:text-primary flex items-center gap-2">
                           Rp {item.price.toLocaleString("id-ID")}
                           <Edit className="w-3 h-3 opacity-50" />
                        </div>

                        {/* Tombol WA & Hapus */}
                        <div className="flex items-center gap-2 mt-auto">
                            <button onClick={() => window.open(`https://wa.me/${item.phone}?text=Halo ${item.customer_name}, update status servis ${item.device_name}: ${item.status}`, '_blank')} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition">
                                <span className="text-xs font-bold">WA</span>
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        ))}
        
        {!loading && services.length === 0 && (
             <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                <p className="text-gray-500">Belum ada data servis.</p>
            </div>
        )}
      </div>

      {/* --- MODAL FORM INPUT (Lengkap dengan Alamat) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex justify-between">
                <h2 className="text-xl font-bold text-white">Input Servis Baru</h2>
                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-white"/></button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nama Pelanggan</label>
                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mt-1 outline-none focus:border-primary" placeholder="Nama..."
                            value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">No. WhatsApp</label>
                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mt-1 outline-none focus:border-primary" placeholder="62..."
                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                </div>

                {/* INPUT ALAMAT */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Alamat Lengkap</label>
                    <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mt-1 outline-none focus:border-primary h-20 resize-none" placeholder="Jalan, No. Rumah, Kota..."
                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                </div>
                
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Unit / Device</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mt-1 outline-none focus:border-primary" placeholder="Contoh: Macbook Air M1"
                        value={formData.device_name} onChange={e => setFormData({...formData, device_name: e.target.value})} />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Keluhan / Kerusakan</label>
                    <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mt-1 outline-none focus:border-primary h-24 resize-none" placeholder="Detail kerusakan..."
                        value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})}></textarea>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Estimasi Biaya (Rp)</label>
                    <input type="number" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mt-1 outline-none focus:border-primary"
                        value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/5">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-xl text-gray-400 hover:text-white">Batal</button>
                <button onClick={handleSaveService} disabled={isSaving} className="px-6 py-2 bg-primary text-black font-bold rounded-xl hover:bg-primary-glow flex items-center gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
