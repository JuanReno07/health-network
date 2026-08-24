import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Building2,
  Award,
  Target,
  Compass,
  Users,
  ShieldCheck,
  Quote,
  BadgeCheck,
  MapPin
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { activeHospital } = useHospital();
  const [activeTab, setActiveTab] = useState<'profile' | 'vision' | 'structure'>('profile');

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-navy-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm backdrop-blur-sm">
            <Building2 className={`w-3.5 h-3.5 ${activeHospital.id === 'nusawardenna' ? 'text-medical-500' : 'text-healthemerald-500'}`} />
            <span>Profil &amp; Integritas Medis</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Tentang {activeHospital.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Membangun standar tertinggi dalam pertolongan darurat, penelitian kedokteran, dan pelayanan pasien terpadu di San Andreas.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-slate-800 text-medical-600 dark:text-medical-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sejarah & Gambaran Umum
            </button>
            <button
              onClick={() => setActiveTab('vision')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'vision'
                  ? 'bg-white dark:bg-slate-800 text-medical-600 dark:text-medical-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Visi & Misi
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'structure'
                  ? 'bg-white dark:bg-slate-800 text-medical-600 dark:text-medical-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Struktur Organisasi
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-medical-500" />
                  <span>Sejarah Perjalanan Medis</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeHospital.history}
                </p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Wilayah Layanan</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeHospital.location.district}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Koordinat Geografis</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeHospital.location.coordinates}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Director Spotlight */}
            <div className="lg:col-span-5">
              <div className="glass-card rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={activeHospital.director?.photo || (activeHospital.id === 'revenhill' ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80')}
                    alt={activeHospital.director?.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-medical-500 shadow-md bg-slate-100 dark:bg-slate-800"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = activeHospital.id === 'revenhill' ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div>
                    <span className="text-[10px] font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider block">
                      Direktur Rumah Sakit
                    </span>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {activeHospital.director.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeHospital.director.title}
                    </p>
                  </div>
                </div>

                <div className="relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  <Quote className="w-6 h-6 text-medical-500/20 absolute top-2 right-2" />
                  "{activeHospital.director.message}"
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-healthemerald-500" /> Los Santos Medical Board
                  </span>
                  <span className="font-mono text-[11px]">Badge: {activeHospital.id === 'nusawardenna' ? 'NW-DIR-01' : 'RH-DIR-01'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            {/* Vision */}
            <div className="glass-card rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-medical-500/15 text-medical-600 dark:text-medical-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Visi Rumah Sakit
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {activeHospital.vision.map((v, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-medical-100 text-medical-700 dark:bg-medical-950 dark:text-medical-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mission */}
            <div className="glass-card rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-healthemerald-500/15 text-healthemerald-600 dark:text-healthemerald-400 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Misi Utama
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {activeHospital.mission.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-healthemerald-100 text-healthemerald-700 dark:bg-healthemerald-950 dark:text-healthemerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 animate-fadeIn space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Struktur Organisasi & Divisi Pelayanan
                </h3>
                <p className="text-xs text-slate-500">
                  Hierarki dewan direksi, kepala instalasi, dan penanggung jawab medis
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 w-fit">
                Divisi Terdaftar: {activeHospital.orgStructure.length}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeHospital.orgStructure.map(member => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-medical-500/50 transition-colors"
                >
                  <span className="text-[10px] font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider block">
                    {member.department}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {member.role}
                  </p>
                  {member.badge && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Badge ID:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{member.badge}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
