"use client";
import { useEffect, useState } from "react";
import { Plus, Wrench, CheckCircle, Clock, Save, X, Printer, Thermometer, Loader2, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

// --- HARGA & OPSI (Tetap di sini sebagai acuan) ---
const SERVICE_FEE = 150000;
const PASTE_OPTIONS = [
  { name: "Arctic MX-6 (Standard)", price: 0 },
  { name: "Thermal Grizzly Kryonaut", price: 150000 },
  { name: "Honeywell PTM7950", price: 250000 },
];
const PAD_OPTIONS = [
  { name: "Standard Pads", price: 0 },
  { name: "Gelid GP-Ultimate", price: 125000 },
  { name: "K5 Pro Viscous", price: 100000 },
];

export default function ServicePage() {
  // State Data
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null); // Untuk pop-up nota

  // State Form Input
  const [formData, setFormData] = useState({
    customer: "",
    wa: "",
    unit: "",
    paste: PASTE_OPTIONS[0], // Default pilihan pertama
    pad: PAD_OPTIONS[0],     // Default pilihan pertama
    cleaning: false
  });

  // Hitung Total Otomatis saat user pilih-pilih
  const currentTotal = SERVICE_FEE + formData.paste.price + formData.pad.price + (formData.cleaning ? 50000 : 0);

  // --- 1. AMBIL DATA DARI DATABASE (READ) ---
  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setServices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // --- 2. SIMPAN DATA BARU (CREATE) ---
  const handleSaveService = async () => {
    if (!formData.customer || !formData.unit) {
      alert("Nama Pelanggan dan Unit Laptop wajib diisi!");
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from('services').insert([{
      customer_name: formData.customer,
      whatsapp: formData.wa,
      unit_model: formData.unit,
      thermal_paste: formData.paste.name, // Simpan namanya saja
      thermal_pad: formData.pad.name,     // Simpan namanya saja
      is_deep_clean: formData.cleaning,
      total_price: currentTotal,
      status: "Antrian"
    }]);

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      setIsModalOpen(false);
      fetchServices(); // Refresh tabel
      // Reset Form
      setFormData({ customer: "", wa: "", unit: "", paste: PASTE_OPTIONS[0], pad: PAD_OPTIONS[0], cleaning: false });
    }
    setIsSaving(false);
  };

  // --- 3. UPDATE STATUS (Ganti jadi Selesai/Diambil) ---
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    await supabase.from('services').update({ status: newStatus }).eq('id', id);
    fetchServices();
  };

  return (
    <div className="space-y-6 relative min-h-screen pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Wrench className="text-primary" /> Service Queue
            </h1>
            <p className="text-gray-400">Input servis, kalkulasi biaya, dan cetak nota.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-primary-glow shadow-[0_0_20px_rgba(0,220,130,0.3)] transition flex items-center gap-2">
            <Plus className="w-5 h-5" /> Input Servis Baru
        </button>
      </div>

      {/* TABEL SERVICE */}
      <div className="rounded-xl border border-white/10 bg-surface overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-white uppercase font-bold text-xs">
                <tr>
                    <th className="px-6 py-4">ID & Tanggal</th>
                    <th className="px-6 py-4">Pelanggan</th>
                    <th className="px-6 py-4">Unit & Specs</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {loading ? <tr><td colSpan={6} className="text-center py-8">Memuat data antrian...</td></tr> : 
                 services.map((srv) => (
                    <tr key={srv.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-mono text-primary font-bold">#SRV-{srv.id}</div>
                            <div className="text-xs text-gray-500">{new Date(srv.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-white">
                            {srv.customer_name}
                            <div className="text-xs font-normal text-gray-500">{srv.whatsapp}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-white mb-1">{srv.unit_model}</div>
                            <div className="flex flex-wrap gap-1 text-[10px]">
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{srv.thermal_paste}</span>
                                {srv.is_deep_clean && <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">+Deep Clean</span>}
                            </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-white">Rp {srv.total_price.toLocaleString("id-ID")}</td>
                        <td className="px-6 py-4">
                            {/* Dropdown kecil ganti status */}
                            <select 
                                value={srv.status} 
                                onChange={(e) => handleUpdateStatus(srv.id, e.target.value)}
                                className={`bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer ${
                                    srv.status === "Selesai" ? "text-primary" : 
                                    srv.status === "Diambil" ? "text-gray-500" : "text-yellow-400"
                                }`}
                            >
                                <option className="bg-surface text-gray-400" value="Antrian">Antrian</option>
                                <option className="bg-surface text-primary" value="Selesai">✅ Selesai</option>
                                <option className="bg-surface text-gray-400" value="Diambil">📦 Diambil</option>
                            </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button 
                                onClick={() => setInvoiceData(srv)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-bold"
                            >
                                <Printer className="w-3 h-3" /> Nota
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
         {!loading && services.length === 0 && <div className="p-8 text-center text-gray-500">Belum ada servis masuk.</div>}
      </div>

      {/* --- MODAL INPUT SERVIS --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} 
                className="bg-surface border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold text-white">Input Servis Baru</h2>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Nama Pelanggan" value={formData.customer} onChange={(e:any) => setFormData({...formData, customer: e.target.value})} />
                    <InputGroup label="No. WhatsApp" placeholder="08..." value={formData.wa} onChange={(e:any) => setFormData({...formData, wa: e.target.value})} />
                </div>
                <InputGroup label="Unit Laptop / PC" placeholder="Contoh: Asus ROG Strix G15" value={formData.unit} onChange={(e:any) => setFormData({...formData, unit: e.target.value})} />

                {/* PILIHAN TEKNIS */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-4">
                    <h3 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2"><Thermometer className="w-4 h-4"/> Spesifikasi Thermal</h3>
                    
                    {/* Pilih Pasta */}
                    <div className="grid gap-2">
                        <label className="text-xs text-gray-400">Thermal Paste</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {PASTE_OPTIONS.map((opt) => (
                                <div key={opt.name} onClick={() => setFormData({...formData, paste: opt})} 
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${formData.paste.name === opt.name ? "border-primary bg-primary/10" : "border-white/10 hover:bg-white/5"}`}>
                                    <div className="text-xs font-bold text-white">{opt.name}</div>
                                    <div className="text-[10px] text-primary">{opt.price === 0 ? "Free" : `+Rp ${opt.price/1000}rb`}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pilih Pad & Cleaning */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                        <span className="text-sm text-gray-300">Deep Cleaning (Kipas & Heatsink)</span>
                        <input type="checkbox" className="accent-primary w-5 h-5" checked={formData.cleaning} onChange={(e) => setFormData({...formData, cleaning: e.target.checked})} />
                    </div>
                </div>
              </div>

              {/* FOOTER TOTAL HARGA */}
              <div className="px-6 py-4 bg-black/50 border-t border-white/10 flex justify-between items-center">
                <div>
                    <div className="text-xs text-gray-400">Total Estimasi Biaya</div>
                    <div className="text-2xl font-bold text-primary">Rp {currentTotal.toLocaleString("id-ID")}</div>
                </div>
                <button onClick={handleSaveService} disabled={isSaving} className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary-glow transition disabled:opacity-50 flex items-center gap-2">
                   {isSaving && <Loader2 className="w-4 h-4 animate-spin"/>} Proses Servis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL INVOICE (STRUK) --- */}
      <AnimatePresence>
        {invoiceData && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white text-black w-full max-w-sm shadow-2xl overflow-hidden relative">
                
                <div className="p-8 font-mono text-sm leading-relaxed relative print-area">
                    <div className="text-center mb-6 border-b-2 border-dashed border-black/20 pb-4">
                        <div className="font-bold text-2xl mb-1">CODEVA TECH</div>
                        <div className="text-xs text-gray-600">Specialist Laptop & PC Builder</div>
                        <div className="text-xs mt-2 font-bold">{new Date(invoiceData.created_at).toLocaleDateString()}</div>
                    </div>

                    <div className="mb-4 text-xs">
                        <div className="flex justify-between"><span>No. Order:</span> <span className="font-bold">#SRV-{invoiceData.id}</span></div>
                        <div className="flex justify-between"><span>Customer:</span> <span className="font-bold">{invoiceData.customer_name}</span></div>
                    </div>

                    <table className="w-full mb-4 text-xs">
                        <tbody>
                            <tr><td className="py-1">Jasa Service</td><td className="text-right">150.000</td></tr>
                            <tr><td className="py-1">{invoiceData.thermal_paste}</td><td className="text-right">-</td></tr>
                            {invoiceData.is_deep_clean && <tr><td className="py-1">Deep Cleaning</td><td className="text-right">50.000</td></tr>}
                        </tbody>
                    </table>

                    <div className="border-t-2 border-black border-dashed pt-2 mb-8">
                        <div className="flex justify-between text-lg font-bold">
                            <span>TOTAL</span>
                            <span>Rp {invoiceData.total_price.toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-500"><p>Garansi 7 Hari</p></div>
                </div>

                <div className="bg-gray-100 p-4 flex gap-2">
                    <button onClick={() => setInvoiceData(null)} className="flex-1 py-2 rounded border border-gray-300 font-bold">Tutup</button>
                    <button onClick={() => window.print()} className="flex-1 py-2 rounded bg-black text-white font-bold flex justify-center items-center gap-2"><Printer className="w-4 h-4"/> Print</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
            <input type="text" value={value} onChange={onChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" placeholder={placeholder} />
        </div>
    )
}