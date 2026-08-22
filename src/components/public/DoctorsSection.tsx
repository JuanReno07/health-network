import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor } from '../../types';
import {
  Stethoscope,
  Search,
  Calendar,
  Clock,
  Award,
  CheckCircle,
  Building2,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';

interface DoctorsSectionProps {
  onSelectDoctorForBooking: (doctor: Doctor) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onSelectDoctorForBooking }) => {
  const { doctors, activeHospitalId, activeHospital } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterHospital, setFilterHospital] = useState<'current' | 'all'>('current');

  const filteredDoctors = doctors.filter(doc => {
    if (doc.status !== 'active') return false;

    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHospital =
      filterHospital === 'all'
        ? true
        : doc.hospitalId === 'both' || doc.hospitalId === activeHospitalId;

    return matchesSearch && matchesHospital;
  });

  const getAvailabilityBadge = (avail: Doctor['availability']) => {
    switch (avail) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tersedia / On-Duty</span>
          </span>
        );
      case 'Busy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Sedang Tindakan / Operasi</span>
          </span>
        );
      case 'Offline':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Off Duty / Istirahat</span>
          </span>
        );
    }
  };

  return (
    <section id="doctors" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-navy-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm backdrop-blur-sm">
            <Stethoscope className={`w-3.5 h-3.5 ${activeHospitalId === 'nusawardenna' ? 'text-medical-500' : 'text-healthemerald-500'}`} />
            <span>Tenaga Spesialis &amp; Paramedis Profesional</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Direktori Dokter & Spesialis
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Temukan dokter spesialis terbaik kami dengan status ketersediaan live untuk penanganan rawat jalan dan tindakan operasi darurat.
          </p>
        </div>

        {/* Controls: Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama dokter / spesialisasi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Hospital Filter Switch */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFilterHospital('current')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filterHospital === 'current'
                  ? 'bg-white dark:bg-slate-800 text-medical-600 dark:text-medical-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Dokter {activeHospital.shortName}
            </button>
            <button
              onClick={() => setFilterHospital('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filterHospital === 'all'
                  ? 'bg-white dark:bg-slate-800 text-medical-600 dark:text-medical-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semua Jaringan RS
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <div
              key={doctor.id}
              className="glass-card rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-slate-200/80 dark:border-slate-800/80"
            >
              <div className="space-y-4">
                {/* Doctor Photo & Availability Header */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                    />
                    {doctor.badgeNumber && (
                      <span className="absolute -bottom-2 -right-1 bg-slate-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border border-white/20">
                        {doctor.badgeNumber}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div>{getAvailabilityBadge(doctor.availability)}</div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-medical-600 dark:text-medical-400 font-semibold truncate">
                      {doctor.specialization}
                    </p>
                    <div className="text-[11px] text-slate-400 truncate">
                      {doctor.department}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {doctor.bio}
                </p>

                {/* Schedule & Experience Pills */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-medical-500 shrink-0" />
                    <span className="truncate font-medium">{doctor.schedule}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                    <Award className="w-3.5 h-3.5 text-healthemerald-500 shrink-0" />
                    <span>{doctor.experience}</span>
                  </div>
                </div>
              </div>

              {/* Action: Book Appointment with this doctor */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onSelectDoctorForBooking(doctor)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 hover:bg-medical-600 hover:text-white dark:bg-slate-800 dark:hover:bg-medical-600 dark:hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:bg-medical-600 group-hover:text-white"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Pilih & Buat Janji</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
