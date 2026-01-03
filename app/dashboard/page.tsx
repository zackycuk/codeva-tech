"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Wrench, Package, TrendingUp, 
  Plus, Trash2, LogOut, X, Edit, Save 
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("service"); 
  
  // DATA
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, totalService: 0, totalUnit: 0 });

  // MODALS
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // STATE UNTUK EDIT
  const [editingProduct, setEditingProduct] = useState<any>(null); // Kalau null berarti mode TAMBAH

  // FORM DATA
  const [serviceForm, setServiceForm] = useState({ 
    customer_name: "", phone: "", device_name: "", issue: "", price: 0, status: "Checking" 
  });
  
  const [productForm, setProductForm] = useState({ 
    name: "", 
    price: 0, 
    specs: "", 
    image_url: "", 
    stock: 1, 
    category: "Laptop" 
  });

  // 1. CEK LOGIN & AMBIL DATA
  useEffect(() => {
    const init = async () => {
        const session = localStorage.getItem("codeva_admin_session");
        if (!session) {
            router.push("/login");
            return;
        }
        await fetchData();
    };
    init();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Ambil Data Services
    const { data: sData } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (sData) setServices(sData);

    // Ambil Data Products
    const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (pData) setProducts(pData);

    // Hitung Statistik
    const totalRev = (sData || []).reduce((acc, curr) => acc + (curr.status === 'Done' ? (curr.price || 0) : 0), 0);
    setStats({
        revenue: totalRev,
        totalService: (sData || []).length,
        totalUnit: (pData || []).length
    });

    setLoading(false);
  };

  // --- LOGIC SERVICE ---
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('services').insert([serviceForm]);
    if (!error) {
        setIsServiceModalOpen(false);
        setServiceForm({ customer_name: "", phone: "", device_name: "", issue: "", price: 0, status: "Checking" });
        fetchData();
    }
  };

  const updateServiceStatus = async (id: number, newStatus: string) => {
    await supabase.from('services').update({ status: newStatus }).eq('id', id);
    fetchData();
  };

  const deleteService = async (id: number) => {
    if (confirm("Hapus data servis ini?")) {
        await supabase.from('services').delete().eq('id', id);
        fetchData();
    }
  };

  // --- LOGIC INVENTORY (TAMBAH & EDIT) ---
  
  // 1. Fungsi Buka Modal untuk Edit
  const openEditModal = (product: any) => {
    setEditingProduct(product); // Simpan data produk yang mau diedit
    setProductForm({
        name: product.name,
        price: product.price,
        specs: product.specs || "",
        image_url: product.image_url || "",
        stock: product.stock,
        category: product.category || "Laptop"
    });
    setIsProductModalOpen(true);
  };

  // 2. Fungsi Buka Modal untuk Tambah Baru
  const openAddModal = () => {
    setEditingProduct(null); // Reset mode jadi tambah baru
    setProductForm({ name: "", price: 0, specs: "", image_url: "", stock: 1, category: "Laptop" });
    setIsProductModalOpen(true);
  };

  // 3. Fungsi Submit (Bisa Simpan Baru / Update)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
        // --- LOGIC UPDATE (EDIT) ---
        const { error } = await supabase
            .from('products')
            .update(productForm) // Update data baru
            .eq('id', editingProduct.id); // Berdasarkan ID lama

        if (!error) {
            setIsProductModalOpen(false);
            setEditingProduct(null);
            fetchData();
        } else {
            alert("Gagal update produk!");
        }

    } else {
        // --- LOGIC INSERT (TAMBAH BARU) ---
        const { error } = await supabase.from('products').insert([productForm]);
        if (!error) {
            setIsProductModalOpen(false);
            setProductForm({ name: "", price: 0, specs: "", image_url: "", stock: 1, category: "Laptop" });
            fetchData();
        } else {
            alert("Gagal simpan produk!");
        }
    }
  };

  const deleteProduct = async (id: number) => {
    if (confirm("Hapus produk ini dari katalog?")) {
        await supabase.from('products').delete().eq('id', id);
        fetchData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("codeva_admin_session");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans">
      
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <LayoutDashboard className="text-primary" /> Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm">Welcome back, Founder Codeva Tech.</p>
        </div>
        <button onClick={handleLogout} className="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm font-bold transition">
            Keluar
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-[#111] border border-white/10 p-5 rounded-xl flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-lg text-green-500"><TrendingUp size={24} /></div>
            <div>
                <p className="text-gray-500 text-xs uppercase font-bold">Total Revenue (Servis)</p>
                <h3 className="text-2xl font-bold text-white">Rp {stats.revenue.toLocaleString('id-ID')}</h3>
            </div>
        </div>
        <div className="bg-[#111] border border-white/10 p-5 rounded-xl flex items-center gap-4">
            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-500"><Wrench size={24} /></div>
            <div>
                <p className="text-gray-500 text-xs uppercase font-bold">Total Servis Masuk</p>
                <h3 className="text-2xl font-bold text-white">{stats.totalService} Unit</h3>
            </div>
        </div>
        <div className="bg-[#111] border border-white/10 p-5 rounded-xl flex items-center gap-4">
            <div className="bg-purple-500/20 p-3 rounded-lg text-purple-500"><Package size={24} /></div>
            <div>
                <p className="text-gray-500 text-xs uppercase font-bold">Stok Laptop (Katalog)</p>
                <h3 className="text-2xl font-bold text-white">{stats.totalUnit} Unit</h3>
            </div>
        </div>
      </div>

      {/* TABS SWITCHER */}
      <div className="flex gap-4 border-b border-white/10 mb-6">
        <button 
            onClick={() => setActiveTab("service")}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'service' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
        >
            <Wrench size={16} /> Service Center
        </button>
        <button 
            onClick={() => setActiveTab("inventory")}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'inventory' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
        >
            <Package size={16} /> Inventory Gudang
        </button>
      </div>

      {/* CONTENT AREA */}
      
      {/* === TAB 1: SERVICE CENTER === */}
      {activeTab === 'service' && (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Antrian Servis</h2>
                <button onClick={() => setIsServiceModalOpen(true)} className="bg-primary text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-400">
                    <Plus size={16} /> Input Servis
                </button>
            </div>
            
            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs font-mono">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Pelanggan</th>
                            <th className="p-4">Device / Isu</th>
                            <th className="p-4">Biaya</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {services.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5">
                                <td className="p-4 text-gray-500">#{item.id}</td>
                                <td className="p-4 font-bold">{item.customer_name}<br/><span className="text-xs text-gray-500 font-normal">{item.phone}</span></td>
                                <td className="p-4">{item.device_name}<br/><span className="text-xs text-gray-500">{item.issue}</span></td>
                                <td className="p-4 font-mono text-primary">Rp {item.price?.toLocaleString()}</td>
                                <td className="p-4">
                                    <select 
                                        value={item.status} 
                                        onChange={(e) => updateServiceStatus(item.id, e.target.value)}
                                        className={`bg-black border border-white/20 rounded px-2 py-1 text-xs outline-none ${item.status === 'Done' ? 'text-green-500 border-green-500' : 'text-white'}`}
                                    >
                                        <option value="Checking">Checking</option>
                                        <option value="Repairing">Repairing</option>
                                        <option value="Waiting Part">Waiting Part</option>
                                        <option value="Done">Done (Selesai)</option>
                                        <option value="Cancel">Cancel</option>
                                    </select>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => deleteService(item.id)} className="text-red-500 hover:text-white"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {services.length === 0 && <p className="p-8 text-center text-gray-500">Belum ada data servis.</p>}
            </div>
        </div>
      )}

      {/* === TAB 2: INVENTORY === */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Stok Laptop & Part</h2>
                {/* BUTTON TAMBAH: Panggil fungsi openAddModal */}
                <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-500">
                    <Plus size={16} /> Tambah Produk
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {products.map((item) => (
                    <div key={item.id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden group hover:border-blue-500/50 transition relative">
                        {/* TOMBOL EDIT & HAPUS (MUNCUL SAAT HOVER) */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition z-10">
                            <button onClick={() => openEditModal(item)} className="bg-blue-500 p-1.5 rounded text-white hover:bg-blue-400 shadow-lg">
                                <Edit size={14} />
                            </button>
                            <button onClick={() => deleteProduct(item.id)} className="bg-red-500 p-1.5 rounded text-white hover:bg-red-400 shadow-lg">
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <div className="h-32 bg-white/5 relative">
                            {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600"><Package size={32}/></div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-white truncate">{item.name}</h3>
                            <p className="text-primary font-mono text-sm mt-1">Rp {item.price?.toLocaleString()}</p>
                            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                                <span>Stok: {item.stock || 1}</span>
                                <span className="uppercase border border-white/10 px-2 py-0.5 rounded">{item.category || 'Laptop'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {products.length === 0 && <p className="p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">Belum ada produk di katalog.</p>}
        </div>
      )}


      {/* --- MODALS --- */}
      
      {/* MODAL SERVICE */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-md space-y-4 relative">
                <button onClick={() => setIsServiceModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
                <h2 className="text-xl font-bold">Input Servis Baru</h2>
                <input placeholder="Nama Pelanggan" className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white" 
                    onChange={(e) => setServiceForm({...serviceForm, customer_name: e.target.value})} />
                <input placeholder="No WA" className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white" 
                    onChange={(e) => setServiceForm({...serviceForm, phone: e.target.value})} />
                <input placeholder="Device" className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white" 
                    onChange={(e) => setServiceForm({...serviceForm, device_name: e.target.value})} />
                <textarea placeholder="Keluhan" className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white h-20"
                    onChange={(e) => setServiceForm({...serviceForm, issue: e.target.value})}></textarea>
                <input type="number" placeholder="Estimasi Biaya" className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white" 
                    onChange={(e) => setServiceForm({...serviceForm, price: parseInt(e.target.value)})} />
                <button onClick={handleServiceSubmit} className="w-full bg-primary text-black py-3 rounded-lg font-bold">Simpan</button>
            </div>
        </div>
      )}

      {/* MODAL PRODUCT (BISA UNTUK EDIT & TAMBAH) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-md space-y-4 relative">
                <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
                
                {/* JUDUL DINAMIS */}
                <h2 className="text-xl font-bold text-blue-500">
                    {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                </h2>
                
                {/* Input Nama */}
                <input placeholder="Nama Produk" className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-blue-500" 
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})} />

                {/* Menu Kategori */}
                <select 
                    className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-lg text-white outline-none focus:border-blue-500 appearance-none"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                >
                    <option value="Laptop">Laptop</option>
                    <option value="Aksesoris"> Aksesoris</option>
                    <option value="Sparepart"> Sparepart / Hardware</option>
                    <option value="PC Rakitan"> PC Rakitan</option>
                </select>
                
                {/* Input Deskripsi/Specs (YANG KEMARIN KITA TAMBAH) */}
                <textarea 
                    placeholder="Deskripsi / Spesifikasi Lengkap (Boleh Enter)" 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-blue-500 h-24" 
                    value={productForm.specs}
                    onChange={(e) => setProductForm({...productForm, specs: e.target.value})} 
                ></textarea>

                {/* Input Harga */}
                <input type="number" placeholder="Harga Jual" className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-blue-500" 
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({...productForm, price: parseInt(e.target.value)})} />

                {/* Input Gambar */}
                <input placeholder="Link Gambar (URL)" className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-blue-500" 
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({...productForm, image_url: e.target.value})} />

                {/* Input Stok */}
                <input type="number" placeholder="Stok Awal" className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-blue-500" 
                    value={productForm.stock || ''}
                    onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value)})} />
                
                {/* Tombol Simpan Dinamis */}
                <button onClick={handleProductSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-500 transition flex items-center justify-center gap-2">
                    <Save size={18} /> {editingProduct ? "Update Produk" : "Simpan Produk"}
                </button>
            </div>
        </div>
      )}

    </div>
  );
}