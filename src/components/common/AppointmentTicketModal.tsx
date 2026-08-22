import React from 'react';
import { Appointment } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import {
  X,
  Printer,
  Calendar,
  Clock,
  User,
  Phone,
  Building2,
  CheckCircle,
  FileText,
  QrCode,
  ShieldCheck,
  Download
} from 'lucide-react';

interface AppointmentTicketModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentTicketModal: React.FC<AppointmentTicketModalProps> = ({
  appointment,
  isOpen,
  onClose
}) => {
  const { hospitals } = useHospital();

  if (!isOpen || !appointment) return null;

  const hospital = hospitals[appointment.hospitalId] || hospitals.nusawardenna;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Controls Top Bar (Hidden during Print) */}
        <div className="no-print bg-slate-100 dark:bg-navy-950 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <CheckCircle className="w-4 h-4 text-healthemerald-500" />
            <span>Tiket Janji Temu Digital Berhasil Dibuat</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak / Unduh
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Digital Pass / Ticket */}
        <div className="printable-ticket p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-dashed border-slate-300 dark:border-slate-700 pb-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-medical-600 dark:text-medical-400 block mb-1">
                Medical Appointment Pass &bull; Official Digital Ticket
              </span>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                {hospital.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {hospital.location.address}
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                Status: {appointment.status}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                {appointment.createdAt}
              </div>
            </div>
          </div>

          {/* Appointment ID Highlight */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Nomor Registrasi / Appointment ID
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-medical-600 dark:text-medical-400 tracking-wider my-1">
              {appointment.id}
            </div>
            <div className="text-[11px] text-slate-400">
              Simpan ID ini untuk pengecekan status antrian di lobi rumah sakit
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Nama Pasien</span>
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-medical-500" /> {appointment.patientName}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Kontak / No. Telepon</span>
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-healthemerald-500" /> {appointment.patientPhone}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Tanggal Konsultasi</span>
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-medical-500" /> {appointment.date}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Waktu / Jam</span>
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-healthemerald-500" /> {appointment.time} WIB
              </div>
            </div>

            <div className="col-span-2 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Dokter yang Dituju</span>
              <div className="font-bold text-medical-700 dark:text-medical-300">
                {appointment.doctorName || 'Dokter Spesialis Siaga'}
              </div>
            </div>

            <div className="col-span-2 space-y-1">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Keluhan Pasien</span>
              <p className="text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                "{appointment.complaint}"
              </p>
            </div>
          </div>

          {/* Barcode & Security Stamp Mockup */}
          <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center p-1.5">
                <QrCode className="w-full h-full text-white" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono leading-tight">
                <div>SAN ANDREAS HEALTH AUTH</div>
                <div>SECURE-VERIFIED TICKET</div>
                <div>ID: {appointment.id}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-[11px] font-bold text-healthemerald-600 dark:text-healthemerald-400">
                <ShieldCheck className="w-4 h-4" /> Terverifikasi Resmi
              </div>
              <div className="text-[10px] text-slate-400">
                Harap hadir 10 menit sebelum jadwal
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print p-4 bg-slate-50 dark:bg-navy-950/80 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-medical-600 hover:bg-medical-700 shadow-md transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Tiket
          </button>
        </div>
      </div>
    </div>
  );
};
