"use client";
import { motion } from "framer-motion";
import { DollarSign, Laptop, Users, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Pantau performa toko Codeva Tech secara real-time.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value="Rp 128.5 Jt" change="+12.5%" icon={DollarSign} delay={0.1} />
        <StatsCard title="Service Aktif" value="14 Unit" change="+2 Unit" icon={Laptop} delay={0.2} />
        <StatsCard title="Pelanggan Baru" value="320" change="+18%" icon={Users} delay={0.3} />
        <StatsCard title="Conversion Rate" value="2.4%" change="+4.1%" icon={TrendingUp} delay={0.4} />
      </div>

      {/* Recent Orders Table (Contoh Data) */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-surface overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-lg">Servis Masuk Terbaru</h3>
            <button className="text-primary text-sm hover:underline">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 text-white uppercase font-bold text-xs">
                    <tr>
                        <th className="px-6 py-4">ID Servis</th>
                        <th className="px-6 py-4">Pelanggan</th>
                        <th className="px-6 py-4">Unit</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Biaya</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    <TableRow id="#SRV-001" user="Budi Santoso" unit="Asus ROG Strix" status="Checking" price="Rp -" />
                    <TableRow id="#SRV-002" user="Siti Aminah" unit="MacBook Air M1" status="Repairing" price="Rp 2.500.000" />
                    <TableRow id="#SRV-003" user="Joko Anwar" unit="Lenovo Legion" status="Done" price="Rp 150.000" />
                    <TableRow id="#SRV-004" user="Rina Nose" unit="Acer Swift" status="Waiting Part" price="Rp 850.000" />
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}

// --- KOMPONEN KECIL ---

function StatsCard({ title, value, change, icon: Icon, delay }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="p-6 rounded-2xl bg-surface border border-white/10 hover:border-primary/50 transition-colors group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{change}</span>
            </div>
            <h4 className="text-gray-400 text-sm mb-1">{title}</h4>
            <div className="text-2xl font-bold text-white">{value}</div>
        </motion.div>
    )
}

function TableRow({ id, user, unit, status, price }: any) {
    // Warna badge status
    let statusColor = "bg-gray-500/10 text-gray-400";
    if (status === "Done") statusColor = "bg-primary/10 text-primary";
    if (status === "Repairing") statusColor = "bg-blue-500/10 text-blue-400";
    if (status === "Waiting Part") statusColor = "bg-orange-500/10 text-orange-400";

    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 font-medium text-white">{id}</td>
            <td className="px-6 py-4">{user}</td>
            <td className="px-6 py-4">{unit}</td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>{status}</span>
            </td>
            <td className="px-6 py-4 text-white">{price}</td>
        </tr>
    )
}