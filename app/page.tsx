"use client";

import { motion } from "framer-motion";
import { ArrowRight, Laptop, Shield, Cpu } from "lucide-react";
import Link from "next/link";
import ProductShowcase from "@/components/ProductShowcase"; 
import ContactSection from "@/components/ContactSection"; // <-- Import Baru
import FloatingWA from "@/components/FloatingWA";       // <-- Import Baru

export default function Home() {
  return (
    <main className="min-h-screen pt-20 overflow-x-hidden relative">
      
      {/* FLOATING WA BUTTON (Akan muncul di pojok kanan bawah) */}
      <FloatingWA />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 inline-block backdrop-blur-md">
              Codeva Tech 2.0 Kini Hadir
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
              Solusi IT Premium <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary animate-shine bg-[length:200%_auto]">
                Tanpa Kompromi.
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Service komputer profesional, rakit PC high-end, dan rekomendasi laptop berbasis data. 
              Kami menggabungkan keahlian teknis dengan estetika.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/finder" className="group px-8 py-4 rounded-full bg-primary text-black font-bold text-lg hover:bg-primary-glow hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,220,130,0.4)] flex items-center gap-2">
                    Cari Laptop Ideal 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/dashboard" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm">
                    Masuk Dashboard
                </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- NEW ARRIVALS --- */}
      <section id="products" className="py-24 relative bg-gradient-to-b from-transparent to-surface/20">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">New Arrivals</h2>
                <p className="text-gray-400 max-w-xl mx-auto">
                  Upgrade setup Anda dengan hardware pilihan terbaik yang tersedia di inventory kami.
                </p>
            </div>
            <ProductShowcase />
            <div className="text-center mt-12">
                <Link href="/shop" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-glow transition-colors text-sm uppercase tracking-widest hover:underline decoration-primary underline-offset-4">
                    Lihat Semua Produk <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-24 bg-surface/30 border-y border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Layanan Codeva Tech</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Kami tidak hanya memperbaiki perangkat, kami mengembalikan produktivitas Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ServiceCard icon={Cpu} title="Service Hardware" desc="Spesialis perbaikan mati total, reballing chipset, ganti LCD, baterai, dan keyboard dengan sparepart original bergaransi." />
                <ServiceCard icon={Laptop} title="Laptop Finder" desc="Bingung pilih laptop? Algoritma cerdas kami mencocokkan spesifikasi teknis dengan budget dan kebutuhan software Anda." />
                <ServiceCard icon={Shield} title="Garansi Premium" desc="Setiap unit dan jasa servis dilindungi garansi toko hingga 1 tahun. Dukungan after-sales prioritas via WhatsApp." />
            </div>
        </div>
      </section>

      {/* --- KONTAK & LOKASI (BARU!) --- */}
      <ContactSection />

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/10 text-center bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-xl text-white">Codeva Tech</span>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Codeva Tech Indonesia. Built with Next.js & Supabase.
          </p>
        </div>
      </footer>
    </main>
  );
}

function ServiceCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="p-8 rounded-2xl bg-surface border border-white/10 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <Icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
        </div>
    )
}