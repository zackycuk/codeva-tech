"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Cpu, MapPin, Phone, Mail } from "lucide-react";

export default function PrintInvoicePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil Data Servis berdasarkan ID
    const fetchData = async () => {
      if (!id) return;
      const { data: service } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();
      
      setData(service);
      setLoading(false);

      // 2. Otomatis Trigger Print saat data sudah siap (Tunggu 1 detik biar render kelar)
      if (service) {
        setTimeout(() => {
          window.print();
        }, 1000);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center p-10 text-black">Menyiapkan Nota...</div>;
  if (!data) return <div className="text-center p-10 text-red-500">Data tidak ditemukan!</div>;

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      {/* KOTAK KERTAS (Area ini yang akan tercetak) */}
      <div className="max-w-2xl mx-auto border border-gray-300 p-8 shadow-none print:border-none print:p-0">
        
        {/* HEADER / KOP SURAT */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-black text-white p-1 rounded">
                    <Cpu size={24} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">CODEVA TECH</h1>
            </div>
            <p className="text-sm text-gray-600 max-w-[250px]">
              Jalan Margonda Raya No. 123, Depok, Jawa Barat (Dekat Gunadarma).
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs font-bold text-gray-800">
                <span className="flex items-center gap-1"><Phone size={12}/> 0812-3456-7890</span>
                <span className="flex items-center gap-1"><Mail size={12}/> admin@codeva.tech</span>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest">INVOICE</h2>
            <p className="text-lg font-mono font-bold mt-1">#SRV-{data.id}</p>
            <p className="text-sm text-gray-500 mt-1">
              Tanggal: {new Date(data.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* INFO PELANGGAN */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Ditujukan Kepada:</h3>
            <p className="font-bold text-lg">{data.customer_name}</p>
            <p className="text-sm text-gray-600">{data.phone}</p>
            <p className="text-sm text-gray-600 mt-1">{data.address || "-"}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Status Servis:</h3>
            <span className="inline-block px-3 py-1 bg-black text-white text-sm font-bold rounded">
                {data.status}
            </span>
          </div>
        </div>

        {/* TABEL RINCIAN */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 text-sm font-bold uppercase border-b border-gray-300">Deskripsi Barang / Jasa</th>
              <th className="p-3 text-sm font-bold uppercase border-b border-gray-300 text-right">Biaya</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-gray-200">
                <p className="font-bold">{data.device_name}</p>
                <p className="text-sm text-gray-600 mt-1">Keluhan: {data.issue}</p>
                <p className="text-xs text-gray-400 mt-2 italic">*Garansi servis 1 minggu untuk kerusakan yang sama.</p>
              </td>
              <td className="p-4 border-b border-gray-200 text-right font-mono font-bold text-lg align-top">
                Rp {data.price.toLocaleString("id-ID")}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="p-4 text-right font-bold uppercase text-gray-600">Total Pembayaran</td>
              <td className="p-4 text-right font-bold text-2xl bg-gray-50 text-black">
                 Rp {data.price.toLocaleString("id-ID")}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* FOOTER / TANDA TANGAN */}
        <div className="flex justify-between items-end mt-12 pt-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-16">Penerima (Customer)</p>
            <div className="w-40 border-b border-gray-400"></div>
            <p className="text-xs text-gray-400 mt-2">( {data.customer_name} )</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-16">Hormat Kami,</p>
            <div className="w-40 border-b border-gray-400"></div>
            <p className="text-xs text-gray-400 mt-2">( Codeva Tech Admin )</p>
          </div>
        </div>

        {/* HANYA MUNCUL DI LAYAR (Tombol Print Manual) */}
        <div className="mt-10 text-center print:hidden">
            <button onClick={() => window.print()} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition font-bold">
                Cetak Nota
            </button>
            <p className="text-xs text-gray-400 mt-4">Tips: Di menu print, pilih "Save as PDF" jika ingin dikirim lewat WA.</p>
        </div>

      </div>
    </div>
  );
}