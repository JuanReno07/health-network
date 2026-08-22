import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Service } from '../../types';
import {
  Activity,
  Siren,
  Pill,
  FlaskConical,
  Brain,
  Stethoscope,
  HeartPulse,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';

interface ServicesSectionProps {
  onNavigateToBooking: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigateToBooking }) => {
  const { services, activeHospitalId, activeHospital } = useHospital();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Icon mapping
  const renderIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Siren':
        return <Siren {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      case 'Pill':
        return <Pill {...props} />;
      case 'FlaskConical':
        return <FlaskConical {...props} />;
      case 'Brain':
        return <Brain {...props} />;
      case 'HeartPulse':
        return <HeartPulse {...props} />;
      case 'Stethoscope':
      default:
        return <Stethoscope {...props} />;
    }
  };

  // Filter services for current active hospital (or 'all') and active status only
  const filteredServices = services.filter(service => {
    const matchHospital =
      service.hospitalId === 'all' || service.hospitalId === activeHospitalId;
    const matchCategory =
      selectedCategory === 'All' || service.category === selectedCategory;
    const isActive = service.status === 'active';
    return matchHospital && matchCategory && isActive;
  });

  const categories = ['All', 'Emergency', 'Surgery', 'Diagnostic', 'Inpatient', 'Support'];

  return (
    <section id="services" className="py-20 bg-slate-100/50 dark:bg-navy-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-navy-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm backdrop-blur-sm">
            <Activity className={`w-3.5 h-3.5 ${activeHospitalId === 'nusawardenna' ? 'text-medical-500' : 'text-healthemerald-500'}`} />
            <span>Layanan Medis Komprehensif</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Instalasi & Spesialisasi Medis
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Fasilitas kesehatan trauma darurat, bedah robotik, dan diagnostik penunjang terlengkap di {activeHospital.name}.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-medical-600 text-white shadow-md'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat === 'All' ? 'Semua Layanan' : cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="glass-card rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border border-slate-200/80 dark:border-slate-800/80"
            >
              <div className="space-y-4">
                {/* Header with Icon & Category */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-medical-500/10 text-medical-600 dark:text-medical-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {renderIcon(service.icon)}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {service.category}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                {/* Key Features List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-healthemerald-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Bottom: Hours & Action */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-medical-500" />
                  <span>{service.operatingHours}</span>
                </div>

                <button
                  onClick={() => setSelectedService(service)}
                  className="p-2 rounded-xl text-medical-600 dark:text-medical-400 hover:bg-medical-50 dark:hover:bg-medical-950/60 transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <span>Detail</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-medical-500/10 text-medical-600 dark:text-medical-400 flex items-center justify-center">
                    {renderIcon(selectedService.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-medical-600 dark:text-medical-400 uppercase tracking-widest block">
                      {selectedService.category} Department
                    </span>
                    <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                      {selectedService.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedService.description}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block uppercase">
                    Keunggulan & Fasilitas Layanan:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {selectedService.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-healthemerald-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-medical-500" /> Jam Operasional: {selectedService.operatingHours}
                  </span>
                  <span className="font-semibold text-healthemerald-500">Standar Medis Terverifikasi</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    onNavigateToBooking();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-medical-600 hover:bg-medical-700 shadow-md flex items-center gap-1.5"
                >
                  <span>Buat Janji untuk Layanan Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
