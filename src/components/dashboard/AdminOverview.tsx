import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Users,
  CalendarCheck,
  Stethoscope,
  Activity,
  AlertTriangle,
  Radio,
  Eye,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Building2,
  PhoneCall
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigateToTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateToTab }) => {
  const {
    activeHospital,
    activeHospitalId,
    appointments,
    doctors,
    recruitment,
    auditLogs,
    setEmergencyMode,
    setHospitalStatus
  } = useHospital();

  const [emergencyInputMessage, setEmergencyInputMessage] = useState(
    activeHospital.emergencyMessage || 'IGD Siaga Level 1 - Penanganan Trauma Darurat Aktif.'
  );

  const isEmergency = activeHospital.emergencyMode;

  const currentHospitalAppointments = appointments.filter(
    a => a.hospitalId === activeHospitalId
  );

  const activeDocs = doctors.filter(
    d =>
      d.status === 'active' &&
      d.availability === 'Available' &&
      (d.hospitalId === 'both' || d.hospitalId === activeHospitalId)
  );

  const pendingAppointments = currentHospitalAppointments.filter(
    a => a.status === 'Pending'
  );

  const handleToggleEmergency = () => {
    setEmergencyMode(activeHospitalId, !isEmergency, emergencyInputMessage);
  };

  const handleStatusChange = (status: 'OPEN' | 'BUSY' | 'FULL CAPACITY') => {
    setHospitalStatus(activeHospitalId, status);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome & Hospital Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Central Management Control &bull; {activeHospital.shortName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight mt-1">
            Overview Operasional Rumah Sakit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Pantau status IGD, antrian janji temu pasien, dokter on-duty, dan sistem kendali darurat real-time.
          </p>
        </div>

        {/* Live Operational Status Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-navy-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 pl-2">Status RS:</span>
          {(['OPEN', 'BUSY', 'FULL CAPACITY'] as const).map(status => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeHospital.status === status
                  ? status === 'OPEN'
                    ? 'bg-healthemerald-600 text-white shadow-sm'
                    : status === 'BUSY'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Mode Command Center Card */}
      <div
        className={`p-6 rounded-3xl border transition-all duration-300 ${
          isEmergency
            ? 'bg-rose-950/40 border-rose-600 shadow-xl shadow-rose-950/30'
            : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-xl ${
                  isEmergency
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Sistem Emergency Mode & Siaga Bencana Medis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ketika aktif, banner peringatan merah darurat akan muncul secara instan di seluruh halaman website publik.
                </p>
              </div>
            </div>

            {isEmergency ? (
              <div className="p-3 rounded-2xl bg-rose-900/40 border border-rose-700/60 text-xs text-rose-200 font-medium">
                <strong>Status Siaga Aktif:</strong> "{activeHospital.emergencyMessage}"
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={emergencyInputMessage}
                  onChange={e => setEmergencyInputMessage(e.target.value)}
                  placeholder="Pesan siaga darurat (contoh: Insiden Massal Downtown - IGD Siaga Penuh)..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={handleToggleEmergency}
              className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 ${
                isEmergency
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-600/30'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isEmergency ? 'Nonaktifkan Emergency Mode' : 'Aktifkan Emergency Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Appointments */}
        <div
          onClick={() => onNavigateToTab('appointments')}
          className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-medical-500/10 text-medical-600 dark:text-medical-400 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-6 h-6" />
            </div>
            {pendingAppointments.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                {pendingAppointments.length} Pending
              </span>
            )}
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              {currentHospitalAppointments.length}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
              Total Janji Temu Terdaftar
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Kelola antrian pasien &rarr;</span>
            </p>
          </div>
        </div>

        {/* Card 2: Active Doctors */}
        <div
          onClick={() => onNavigateToTab('doctors')}
          className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-healthemerald-500/10 text-healthemerald-600 dark:text-healthemerald-400 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {activeDocs.length} On Duty
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              {doctors.length}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
              Tenaga Spesialis & Paramedis
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {activeDocs.length} dokter siap menerima pasien
            </p>
          </div>
        </div>

        {/* Card 3: Bed Occupancy / Today Patients */}
        <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              Kapasitas 84%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              {activeHospital.stats.patientsServed}+
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
              Total Pasien Terlayani
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tingkat kepuasan: {activeHospital.stats.satisfactionRate}%
            </p>
          </div>
        </div>

        {/* Card 4: Recruitment Status */}
        <div
          onClick={() => onNavigateToTab('recruitment')}
          className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {recruitment.filter(r => r.status === 'open').length} Lowongan
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              {recruitment.filter(r => r.status === 'open').length > 0 ? 'OPEN' : 'CLOSED'}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
              Status Rekrutmen Staff
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Atur penerimaan anggota baru &rarr;
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Appointments & Live Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Incoming Appointments (7 Cols) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Antrian Janji Temu Terbaru
              </h3>
              <p className="text-xs text-slate-400">
                Pendaftaran pasien online yang masuk di {activeHospital.shortName}
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('appointments')}
              className="text-xs font-bold text-medical-600 dark:text-medical-400 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {currentHospitalAppointments.slice(0, 4).map(apt => (
              <div
                key={apt.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-medical-600 dark:text-medical-400 text-[11px]">
                      {apt.id}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {apt.patientName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    Dokter: {apt.doctorName} &bull; {apt.date} {apt.time}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                    apt.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : apt.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : apt.status === 'Completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Audit Trail Activity (5 Cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Audit Trail Aktivitas Staff
              </h3>
              <p className="text-xs text-slate-400">Log perubahan & tindakan terbaru</p>
            </div>
            <button
              onClick={() => onNavigateToTab('audit-logs')}
              className="text-xs font-bold text-medical-600 dark:text-medical-400 hover:underline"
            >
              Detail Log
            </button>
          </div>

          <div className="space-y-3 overflow-hidden">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-2.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-medical-500 shrink-0 mt-1.5" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {log.userName}: <span className="font-normal text-slate-500 dark:text-slate-400">{log.action}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {log.timestamp} &bull; {log.target}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
