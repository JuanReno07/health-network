import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Users, HeartHandshake, ShieldCheck, Ambulance, Clock3, Star } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { activeHospital } = useHospital();

  const stats = [
    {
      id: 1,
      label: 'Pasien Terlayani',
      value: `${activeHospital.stats.patientsServed}+`,
      description: 'Kasus darurat & tindakan medis berhasil',
      icon: Users,
      color: 'text-medical-500 bg-medical-500/10'
    },
    {
      id: 2,
      label: 'Staff Medis & Dokter',
      value: `${activeHospital.stats.staffCount}+`,
      description: 'Dokter spesialis & paramedis tersertifikasi',
      icon: HeartHandshake,
      color: 'text-healthemerald-500 bg-healthemerald-500/10'
    },
    {
      id: 3,
      label: 'Layanan Darurat 24/7',
      value: '24 Jam',
      description: 'IGD & Trauma Bay selalu siaga tanpa henti',
      icon: Ambulance,
      color: 'text-rose-500 bg-rose-500/10'
    },
    {
      id: 4,
      label: 'Respon Darurat Cepat',
      value: activeHospital.stats.emergencyResponseTime,
      description: 'Rata-rata waktu sampai armada ambulans/helipad',
      icon: Clock3,
      color: 'text-amber-500 bg-amber-500/10'
    }
  ];

  return (
    <section className="py-10 bg-white/60 dark:bg-navy-900/60 border-y border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-4 rounded-2xl hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className={`p-3 rounded-2xl ${item.color} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                    {item.label}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 hidden sm:block">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
