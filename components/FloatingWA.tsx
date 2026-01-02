"use client";
import { MessageCircle } from "lucide-react";

export default function FloatingWA() {
  return (
    <a 
      href="https://wa.me/6281234567890?text=Halo%20Admin%20Codeva,%20saya%20mau%20tanya%20stok%20laptop..."
      target="_blank"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 group"
    >
      {/* Teks Bubble (Muncul pas hover) */}
      <span className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 hidden md:block">
        Chat Admin Sekarang
      </span>

      {/* Tombol Bulat */}
      <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.8)] transition-all duration-300 animate-bounce-slow">
        <MessageCircle className="w-8 h-8 text-white fill-current" />
      </div>
    </a>
  );
}