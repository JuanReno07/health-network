import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Activity,
  Calendar,
  PhoneCall,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Building2,
  Users,
  Radio,
  HeartPulse,
  Award
} from 'lucide-react';

interface HeroSectionProps {
  onNavigateToBooking: () => void;
  onNavigateToServices: () => void;
  onNavigateToAbout: () => void;
  onOpenTracker: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateToBooking,
  onNavigateToServices,
  onNavigateToAbout,
  onOpenTracker
}) => {
  const { activeHospital, activeHospitalId } = useHospital();

  const isNusawardenna = activeHospitalId === 'nusawardenna';

  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-20 md:pt-14 md:pb-28">
      {/* Background Decorative Gradients & Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-medical-500/15 dark:bg-medical-600/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-24 right-10 w-[450px] h-[450px] bg-healthemerald-500/15 dark:bg-healthemerald-600/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Status & Accreditation Sub-bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-10 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medical-50 dark:bg-medical-950/60 border border-medical-200/80 dark:border-medical-800/80 text-medical-700 dark:text-medical-300 text-xs font-semibold shadow-sm">
            <img
              src="/logo/logo-kota.png"
              alt="ASE STATE"
              className="w-4 h-4 object-contain rounded-full shrink-0"
            />
            <span>Pusat Pelayanan Medis Resmi &bull; ASE STATE Department of Health</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 text-xs font-medium shadow-sm">
              <span className="text-slate-400">Kapasitas IGD:</span>
              <span className="flex items-center gap-1.5 font-bold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeHospital.status === 'OPEN'
                      ? 'bg-healthemerald-500 animate-pulse'
                      : activeHospital.status === 'BUSY'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
                <span className="text-slate-900 dark:text-white">{activeHospital.status}</span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-healthemerald-50 dark:bg-healthemerald-950/60 border border-healthemerald-200/80 dark:border-healthemerald-800/80 text-healthemerald-700 dark:text-healthemerald-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-healthemerald-500" />
              <span>Respon {activeHospital.stats.emergencyResponseTime}</span>
            </div>
          </div>
        </div>

        {/* Hero Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copywriting & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              {isNusawardenna ? (
                <>
                  Pusat Trauma & <br />
                  <span className="text-gradient-medical">Layanan Medis Darurat Terpadu</span>
                </>
              ) : (
                <>
                  Precision Healthcare & <br />
                  <span className="text-gradient-emerald">Advanced Surgical Institute</span>
                </>
              )}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
              {activeHospital.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onNavigateToBooking}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-medical-600 via-medical-500 to-healthemerald-600 hover:from-medical-500 hover:to-healthemerald-500 shadow-xl shadow-medical-500/25 hover:shadow-glow-blue transition-all flex items-center gap-2 group"
              >
                <Calendar className="w-4 h-4" />
                <span>Buat Janji Dokter</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onNavigateToServices}
                className="px-5 py-3.5 rounded-2xl font-semibold text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-navy-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-medical-500" />
                <span>Lihat Layanan Medis</span>
              </button>

              <button
                onClick={onNavigateToAbout}
                className="px-4 py-3.5 rounded-2xl font-semibold text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                Tentang Rumah Sakit
              </button>
            </div>

            {/* Fast Emergency Dispatch Bar */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Emergency Dispatch Call
                  </div>
                  <div className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                    {activeHospital.contact.emergencyPhone}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    EMS Radio Frequency
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {activeHospital.contact.radioFrequency}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hospital Card & Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Main Visual Card */}
              <div className="glass-card rounded-3xl p-3 shadow-2xl relative overflow-hidden group border border-slate-200/80 dark:border-slate-800/80">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
                  <img
                    src={
                      isNusawardenna
                        ? 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80'
                        : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={activeHospital.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                  {/* Floating Top Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isNusawardenna ? 'Trauma Center Level 1' : 'Robotic Surgery Suite'}</span>
                    </span>

                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-healthemerald-500/90 text-white backdrop-blur-md">
                      24/7 Standby
                    </span>
                  </div>

                  {/* Bottom Information in Card */}
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <div className="text-white">
                      <span className="text-[10px] font-bold text-medical-300 uppercase tracking-widest block">
                        San Andreas Department of Health
                      </span>
                      <h3 className="text-lg font-bold font-display leading-tight">
                        {activeHospital.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                        {activeHospital.location.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15 text-center text-white">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-1.5">
                        <div className="text-xs font-extrabold text-medical-300">
                          {activeHospital.stats.patientsServed}+
                        </div>
                        <div className="text-[9px] text-slate-300">Pasien Terlayani</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-1.5">
                        <div className="text-xs font-extrabold text-healthemerald-300">
                          {activeHospital.stats.staffCount}+
                        </div>
                        <div className="text-[9px] text-slate-300">Tenaga Medis</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-1.5">
                        <div className="text-xs font-extrabold text-amber-300">
                          {activeHospital.stats.emergencyResponseTime}
                        </div>
                        <div className="text-[9px] text-slate-300">Waktu Respon</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
