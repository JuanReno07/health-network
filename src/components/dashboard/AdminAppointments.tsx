import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment } from '../../types';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  FileText,
  User,
  Phone,
  Building2,
  Stethoscope,
  ChevronDown
} from 'lucide-react';

interface AdminAppointmentsProps {
  onPrintTicket: (appointment: Appointment) => void;
}

export const AdminAppointments: React.FC<AdminAppointmentsProps> = ({ onPrintTicket }) => {
  const {
    appointments,
    doctors,
    updateAppointmentStatus,
    activeHospitalId,
    activeHospital
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterHospital, setFilterHospital] = useState<'current' | 'all'>('current');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    const matchHospital =
      filterHospital === 'all' ? true : apt.hospitalId === activeHospitalId;
    const matchStatus = filterStatus === 'All' || apt.status === filterStatus;
    const matchSearch =
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.doctorName && apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchHospital && matchStatus && matchSearch;
  });

  const handleStatusChange = (
    aptId: string,
    newStatus: Appointment['status']
  ) => {
    updateAppointmentStatus(aptId, newStatus, editNotes || undefined);
    if (selectedAppointment && selectedAppointment.id === aptId) {
      setSelectedAppointment({
        ...selectedAppointment,
        status: newStatus,
        doctorNotes: editNotes || selectedAppointment.doctorNotes
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Manajemen Janji Temu & Dispatch Pasien
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar reservasi antrian dokter, verifikasi pendaftaran, dan cetak slip dispatch medis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white dark:bg-navy-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFilterHospital('current')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterHospital === 'current'
                  ? 'bg-medical-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              {activeHospital.shortName}
            </button>
            <button
              onClick={() => setFilterHospital('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterHospital === 'all'
                  ? 'bg-medical-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              Semua RS
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari ID tiket, nama pasien, no hp..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-medical-600 text-white shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {st === 'All' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-navy-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID & Pasien</th>
                <th className="px-6 py-4">Rumah Sakit</th>
                <th className="px-6 py-4">Dokter & Jadwal</th>
                <th className="px-6 py-4">Keluhan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filteredAppointments.map(apt => (
                <tr
                  key={apt.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-medical-600 dark:text-medical-400 text-xs">
                      {apt.id}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {apt.patientName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {apt.patientPhone}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                    {apt.hospitalId === 'nusawardenna' ? 'RS Nusawardenna' : 'MC Revenhill'}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {apt.doctorName}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {apt.date} &bull; {apt.time} WIB
                    </div>
                  </td>

                  <td className="px-6 py-4 max-w-xs truncate" title={apt.complaint}>
                    <span className="italic text-slate-600 dark:text-slate-400">
                      "{apt.complaint}"
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
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
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setEditNotes(apt.doctorNotes || '');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                      >
                        Kelola
                      </button>
                      <button
                        onClick={() => onPrintTicket(apt)}
                        className="p-1.5 rounded-xl bg-medical-50 dark:bg-medical-950/60 text-medical-600 dark:text-medical-400 hover:bg-medical-100 transition-colors"
                        title="Cetak Tiket"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Detail & Status Update Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-medical-600 dark:text-medical-400">
                  {selectedAppointment.id}
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {selectedAppointment.patientName}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedAppointment.patientPhone} &bull; {selectedAppointment.patientGender}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Jadwal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedAppointment.date} {selectedAppointment.time} WIB
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Dokter:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedAppointment.doctorName}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Keluhan:</span>
                <p className="italic text-slate-700 dark:text-slate-300 mt-0.5">
                  "{selectedAppointment.complaint}"
                </p>
              </div>
            </div>

            {/* Change Status Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Ubah Status Janji Temu:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedAppointment.id, 'Pending')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedAppointment.status === 'Pending'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedAppointment.id, 'Accepted')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedAppointment.status === 'Accepted'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Terima / Setujui
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedAppointment.id, 'Completed')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedAppointment.status === 'Completed'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Selesai
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedAppointment.id, 'Cancelled')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedAppointment.status === 'Cancelled'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Batalkan
                </button>
              </div>
            </div>

            {/* Doctor Notes Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Dokter / Tim Medis (Dapat dilihat pasien saat cek status)
              </label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder="Tambahkan catatan instruksi, resep obat, atau jadwal kontrol..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  onPrintTicket(selectedAppointment);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-medical-600 dark:text-medical-400 bg-medical-50 dark:bg-medical-950 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Slip Dispatch
              </button>

              <button
                type="button"
                onClick={() => {
                  updateAppointmentStatus(
                    selectedAppointment.id,
                    selectedAppointment.status,
                    editNotes
                  );
                  setSelectedAppointment(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-medical-600 hover:bg-medical-700 text-white shadow-md"
              >
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
