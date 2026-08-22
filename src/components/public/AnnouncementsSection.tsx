import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Bell,
  AlertTriangle,
  Calendar,
  Sparkles,
  ChevronRight,
  Info,
  Building2
} from 'lucide-react';

export const AnnouncementsSection: React.FC = () => {
  const { announcements, activeHospitalId, activeHospital } = useHospital();

  const publishedAnnouncements = announcements.filter(
    a => a.published && (a.hospitalId === 'all' || a.hospitalId === activeHospitalId)
  );

  if (publishedAnnouncements.length === 0) return null;

  return (
    <section className="py-14 bg-white/40 dark:bg-navy-900/40 border-y border-slate-200/80 dark:border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-medical-50 dark:bg-medical-950/60 text-medical-600 dark:text-medical-400 text-xs font-bold border border-medical-200 dark:border-medical-800">
              <Bell className="w-3.5 h-3.5" />
              <span>Pusat Informasi Terkini</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Pengumuman & Berita Rumah Sakit
            </h2>
          </div>
          <div className="text-xs text-slate-500">
            Update resmi dari Dewan Direksi {activeHospital.shortName}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedAnnouncements.map(ann => {
            const isBreaking = ann.category === 'Breaking Alert' || ann.priority === 'high';
            return (
              <div
                key={ann.id}
                className={`glass-card rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border ${
                  isBreaking
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isBreaking
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-medical-50 text-medical-700 dark:bg-medical-950 dark:text-medical-300 border border-medical-200 dark:border-medical-800'
                      }`}
                    >
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{ann.date}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {ann.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                    {ann.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">Rilis: {ann.author}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
