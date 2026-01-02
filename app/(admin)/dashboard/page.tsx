"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DollarSign, Laptop, Wrench, Users, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [recentServices, setRecentServices] = useState<any[]>([]);
  const [stats, setStats] = useState({
    revenue: 0,
    activeServices: 0,
    totalCustomers: 0,
    totalUnits: 0
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // 1. Ambil Data Servis (Terbaru 5 biji)
      const { data: services } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Ambil Data Produk (Untuk hitung unit inventory)
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (services) {
        // --- HITUNG STATISTIK OTOMATIS ---
        
        // a. Total Pendapatan (Dari servis yang statusnya 'Done')
        const totalRevenue = services
          .filter(s => s.status === 'Done')
          .reduce((sum, item) => sum + (item.price || 0), 0);

        // b. Servis Aktif (Yang belum selesai)
        const activeCount = services.filter(s => s.status !== 'Done' && s.status !== 'Cancel').length;

        // c. Total Pelanggan Unik (Hitung nama yang beda-beda)
        const uniqueCustomers = new Set(services.map(s => s.customer_name)).size;

        setStats({
          revenue: totalRevenue,
          activeServices: activeCount,
          totalCustomers: uniqueCustomers,
          totalUnits: productCount || 0
        });

        // Ambil 5 data terakhir buat tabel
        setRecentServices(services.slice(0, 5));
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // Format Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  };

  // Helper Warna Status
  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Done': return 'text-green-400 bg-green-500/10 border-green-500/20';
        case 'Repairing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        case 'Waiting Part': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        case 'Cancel': return 'text-red-400 bg-red-500/10 border-red-500/20';
        default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 animate-pulse">
            <Loader2 className="w-10 h-10 mb-4 animate-spin text-primary" />
            <p>Sedang menghitung omzet...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* JUDUL */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Pantau performa toko Codeva Tech secara real-time.</p>
      </div>

      {/* KARTU STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue (Servis)" value={formatRupiah(stats.revenue)} icon={DollarSign} color="text-green-400" />
        <StatCard title="Servis Sedang Jalan" value={`${stats.activeServices} Unit`} icon={Wrench} color="text-blue-400" />
        <StatCard title="Total Pelanggan" value={`${stats.totalCustomers} Orang`} icon={Users} color="text-purple-400" />
        <StatCard title="Stok Barang Toko" value={`${stats.totalUnits} Item`} icon={Laptop} color="text-yellow-400" />
      </div>

      {/* TABEL SERVIS TERBARU */}
      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Servis Masuk Terbaru</h3>
            <Link href="/dashboard/service" className="text-xs text-primary hover:underline flex items-center gap-1">
                Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-gray-400 font-bold uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Pelanggan</th>
                        <th className="px-6 py-4">Unit / Device</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Biaya</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                    {recentServices.length > 0 ? (
                        recentServices.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{item.customer_name}</td>
                                <td className="px-6 py-4">{item.device_name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-white">
                                    {formatRupiah(item.price)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                Belum ada data servis masuk.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

// Komponen Kecil untuk Kartu
function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-surface border border-white/10 p-6 rounded-2xl hover:border-white/20 transition group">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className="text-gray-400 text-sm mb-1">{title}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    )
}