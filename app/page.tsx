"use client";

import { motion } from "framer-motion";
import { ArrowRight, Laptop, Shield, Cpu, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import ProductShowcase from "@/components/ProductShowcase";
import ContactSection from "@/components/ContactSection";
import FloatingWA from "@/components/FloatingWA";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

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
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.span variants={itemVariants} className="px-5 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8 inline-flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(0,220,130,0.15)]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Codeva Tech Kini Hadir
            </motion.span>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
              Solusi IT Premium <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-300 to-primary animate-shine bg-[length:200%_auto]">
                Tanpa Kompromi.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Service komputer profesional dan rakit PC high-end dengan pemantauan progres perbaikan yang transparan.
              Kami menggabungkan keahlian teknis dengan performa puncak.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link href="/track" className="group px-8 py-4 rounded-full bg-primary text-background font-bold text-lg hover:bg-primary-glow hover:scale-105 transition-all duration-300 shadow-[0_0_25px_rgba(0,220,130,0.3)] flex items-center gap-2">
                Cek Status Servis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/dashboard" className="group px-8 py-4 rounded-full border border-white/20 text-white font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm flex items-center gap-2">
                Masuk Dashboard
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
            </motion.div>
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
            <ServiceCard icon={Search} title="Tracking Servis Real-time" desc="Pantau progres perbaikan secara transparan. Anda bisa mengecek status perangkat Anda kapan saja dari mana saja." />
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
    <div className="relative p-8 rounded-2xl bg-surface/50 border border-white/5 hover:border-primary/50 transition-all duration-500 group overflow-hidden hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(0,220,130,0.1)] backdrop-blur-md">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-500"></div>
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_rgba(0,220,130,0.3)] transition-all duration-300">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300 tracking-tight">{title}</h3>
        <p className="text-gray-400 leading-relaxed font-light">{desc}</p>
      </div>
    </div>
  )
}