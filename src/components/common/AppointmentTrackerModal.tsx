import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment } from '../../types';
import {
  X,
  Search,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Stethoscope,
  Building2,
  FileText
} from 'lucide-react';

interface AppointmentTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicketForPrint: (appointment: Appointment) => void;
}

export const AppointmentTrackerModal: React.FC<AppointmentTrackerModalProps> = ({
  isOpen,
  onClose,
  onSelectTicketForPrint
}) => {
  const { appointments, hospitals } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedResult, setSearchedResult] = useState<Appointment | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = appointments.find(
      a =>
        a.id.toLowerCase() === query ||
        a.patientPhone.toLowerCase() === query ||
        a.patientName.toLowerCase().includes(query)
    );

    setSearchedResult(found || null);
    setSearched(true);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <Clock3 className="w-3.5 h-3.5" /> Menunggu Konfirmasi Dokter
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui & Terjadwal
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai Ditangani
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
            <XCircle className="w-3.5 h-3.5" /> Dibatalkan
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-medical-700 to-medical-600 text-white p-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-white/15 text-white backdrop-blur-sm">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-medical-200">
              Live Patient Tracker
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Pelacakan Status Janji Temu
          </h2>
          <p className="text-xs text-medical-100 mt-0.5">
            Masukkan Nomor Registrasi / Appointment ID (contoh: NW-2026-8921)
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Ketik Appointment ID atau No. Telepon..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold shadow-md transition-all shrink-0"
            >
              Cari
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold">Coba contoh ID:</span>
            {appointments.slice(0, 3).map(apt => (
              <button
                key={apt.id}
                type="button"
                onClick={() => {
                  setSearchQuery(apt.id);
                  setSearchedResult(apt);
                  setSearched(true);
                }}
                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-medical-50 hover:text-medical-600 text-[11px] font-mono font-medium border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {apt.id}
              </button>
            ))}
          </div>

          {/* Result Area */}
          {searched && searchedResult && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                    {searchedResult.id}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {searchedResult.patientName}
                  </h3>
                  <p className="text-xs text-medical-600 dark:text-medical-400 font-medium">
                    {hospitals[searchedResult.hospitalId]?.name || 'Rumah Sakit'}
                  </p>
                </div>
                <div>{getStatusBadge(searchedResult.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block">Jadwal Janji Temu</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-medical-500" />
                    <span>{searchedResult.date} &bull; {searchedResult.time}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Dokter Penanggung Jawab</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <Stethoscope className="w-3.5 h-3.5 text-healthemerald-500" />
                    <span className="truncate">{searchedResult.doctorName}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 block">Keluhan Terdaftar</span>
                  <p className="text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 mt-1">
                    "{searchedResult.complaint}"
                  </p>
                </div>

                {searchedResult.doctorNotes && (
                  <div className="col-span-2 bg-medical-50 dark:bg-medical-950/40 p-3 rounded-xl border border-medical-200 dark:border-medical-800">
                    <span className="text-[10px] font-bold text-medical-700 dark:text-medical-300 block uppercase">
                      Catatan Dokter / Tim Medis
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 text-xs mt-1 font-medium">
                      {searchedResult.doctorNotes}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectTicketForPrint(searchedResult);
                  }}
                  className="text-xs font-bold text-medical-600 hover:text-medical-700 dark:text-medical-400 flex items-center gap-1.5 underline"
                >
                  <FileText className="w-3.5 h-3.5" /> Lihat & Cetak Tiket Lengkap
                </button>
              </div>
            </div>
          )}

          {searched && !searchedResult && (
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <h4 className="font-bold text-rose-900 dark:text-rose-200 text-sm">
                Janji Temu Tidak Ditemukan
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Pastikan Appointment ID yang Anda masukkan sudah benar atau hubungi hotline kami jika membutuhkan bantuan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
