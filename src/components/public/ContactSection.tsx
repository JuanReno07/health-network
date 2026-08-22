import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  MapPin,
  PhoneCall,
  Mail,
  Radio,
  Clock,
  Send,
  Building2,
  Shield,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { activeHospital } = useHospital();

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-medical-50 dark:bg-medical-950/60 border border-medical-200 dark:border-medical-800 text-medical-700 dark:text-medical-300 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Pusat Komunikasi & Koordinasi EMS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Hubungi & Kunjungi Kami
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Jalur komunikasi langsung IGD, frekuensi radio taktis medis, dan titik koordinat navigasi {activeHospital.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Column */}
          <div className="lg:col-span-6 space-y-4">
            {/* Emergency Hotline Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-xl shadow-rose-600/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/20">
                  Priority 911 Hotline
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping" />
              </div>
              <div>
                <div className="text-xs text-rose-100 uppercase tracking-wider font-semibold">
                  Triage Gawat Darurat & Helipad Air Ambulance
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                  {activeHospital.contact.emergencyPhone}
                </div>
              </div>
              <p className="text-xs text-rose-100/90 leading-relaxed">
                Tekan 911 di in-game radio atau telepon untuk memanggil regu paramedis terdekat. Waktu respon di bawah 3 menit.
              </p>
            </div>

            {/* General Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="p-2.5 rounded-xl bg-medical-500/10 text-medical-600 dark:text-medical-400 w-fit">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Layanan Informasi / CS</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {activeHospital.contact.phone}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit">
                  <Radio className="w-5 h-5" />
                </div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Frekuensi Radio Medis</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {activeHospital.contact.radioFrequency}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="p-2.5 rounded-xl bg-healthemerald-500/10 text-healthemerald-600 dark:text-healthemerald-400 w-fit">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Email Korespondensi</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {activeHospital.contact.email}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Saluran Komunikasi Medis</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {activeHospital.contact.discordServer || 'discord.gg/hospital'}
                </div>
              </div>
            </div>
          </div>

          {/* Location Map Preview Column */}
          <div className="lg:col-span-6">
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between shadow-xl space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-medical-500" />
                    <span>Lokasi Fisik Rumah Sakit</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">
                    GPS: {activeHospital.location.coordinates}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {activeHospital.location.address}, {activeHospital.location.district}
                </p>
              </div>

              {/* Map Preview Image Mock */}
              <div className="relative rounded-2xl overflow-hidden h-64 border border-slate-200 dark:border-slate-700 group">
                <img
                  src={
                    activeHospital.location.mapPreviewUrl ||
                    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80'
                  }
                  alt="Map Location"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white text-xs space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5 text-medical-300">
                      <Building2 className="w-3.5 h-3.5" /> {activeHospital.name}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Akses darurat jalur ambulans di sayap timur gedung utama.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-healthemerald-500" /> Pelayanan Gawat Darurat: 24 Jam
                </span>
                <span className="font-semibold text-medical-600 dark:text-medical-400">
                  Los Santos Medical Network
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
