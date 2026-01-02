"use client";
import { MapPin, Phone, Mail, Instagram, Clock } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* BAGIAN KIRI: INFO KONTAK */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Kunjungi Markas Kami</h2>
              <p className="text-gray-400 text-lg">
                Ingin konsultasi rakit PC atau servis langsung? Datang ke workshop kami atau hubungi via WhatsApp.
              </p>
            </div>

            <div className="space-y-6">
              {/* Alamat */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Workshop Depok</h4>
                  <p className="text-gray-400">Jl. Margonda Raya No. 450, Pondok Cina,<br />Kecamatan Beji, Kota Depok, Jawa Barat 16424</p>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Jam Operasional</h4>
                  <p className="text-gray-400">Senin - Sabtu: 10.00 - 20.00 WIB<br />Minggu: Dengan Janji Temu</p>
                </div>
              </div>

              {/* Kontak */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Hubungi Kami</h4>
                  <p className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
                    +62 812-3456-7890 (WhatsApp)
                  </p>
                  <p className="text-gray-400">support@codeva.tech</p>
                </div>
              </div>
            </div>

            {/* Tombol Sosmed */}
            <div className="flex gap-4 pt-4">
              <SocialButton icon={Instagram} href="#" />
              <SocialButton icon={Mail} href="#" />
              <SocialButton icon={MapPin} href="https://maps.google.com" />
            </div>
          </div>

          {/* BAGIAN KANAN: GOOGLE MAPS EMBED */}
          <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
            {/* Overlay saat hover */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none"></div>
            
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.236618991823!2d106.83060637499161!3d-6.363403993626707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec10609a3653%3A0x6b83f0f3531120f0!2sMargonda%20Raya!5e0!3m2!1sen!2sid!4v1709650000000!5m2!1sen!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}

function SocialButton({ icon: Icon, href }: any) {
  return (
    <a href={href} target="_blank" className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:scale-110 transition-all">
      <Icon className="w-5 h-5" />
    </a>
  )
}