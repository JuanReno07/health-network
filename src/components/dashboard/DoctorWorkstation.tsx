import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment, Doctor } from '../../types';
import {
  Stethoscope,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  FileText,
  Calendar,
  Sparkles,
  AlertCircle,
  Building2,
  Check
} from 'lucide-react';

interface DoctorWorkstationProps {
  onOpenCreateRecord: (appointment?: Appointment) => void;
}

export const DoctorWorkstation: React.FC<DoctorWorkstationProps> = ({ onOpenCreateRecord }) => {
  const {
    currentUser,
    doctors,
    appointments,
    updateAppointmentStatus,
    updateDoctorAvailability,
    activeHospital
  } = useHospital();

  const currentDoctor = doctors.find(d => d.id === currentUser?.doctorId) || doctors[0];
  const [availability, setAvailability] = useState<Doctor['availability']>(
    currentDoctor?.availability || 'Available'
  );

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');

  // Filter appointments specifically assigned to this doctor or matching hospital
  const myAppointments = appointments.filter(
    a => a.doctorId === currentDoctor?.id || a.doctorName === currentDoctor?.name
  );

  const handleAvailabilityToggle = (newAvail: Doctor['availability']) => {
    setAvailability(newAvail);
    if (currentDoctor) {
      updateDoctorAvailability(currentDoctor.id, newAvail);
    }
  };

  const handleAction = (aptId: string, status: Appointment['status']) => {
    updateAppointmentStatus(aptId, status, doctorNotes || undefined);
    setSelectedAppointment(null);
    setDoctorNotes('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Doctor Profile & Status Command */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentDoctor?.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'}
            alt={currentDoctor?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-medical-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400 font-mono">
                {currentDoctor?.badgeNumber || 'MED-DUTY'}
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-xs font-semibold text-slate-500">{activeHospital.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              {currentDoctor?.name || 'Dokter Spesialis'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentDoctor?.specialization} &bull; {currentDoctor?.department}
            </p>
          </div>
        </div>

        {/* Live Availability Toggle */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Status Ketersediaan On-Duty (Live):
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAvailabilityToggle('Available')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                availability === 'Available'
                  ? 'bg-healthemerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Available</span>
            </button>

            <button
              type="button"
              onClick={() => handleAvailabilityToggle('Busy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                availability === 'Busy'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-900" />
              <span>Busy / Operasi</span>
            </button>

            <button
              type="button"
              onClick={() => handleAvailabilityToggle('Offline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                availability === 'Offline'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Offline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Queue Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Antrian Janji Temu Saya ({myAppointments.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daftar pasien yang memesan jadwal konsultasi dan tindakan khusus dengan Anda
            </p>
          </div>
        </div>

        {myAppointments.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-700 dark:text-slate-300">
              Belum Ada Janji Temu Masuk
            </h3>
            <p className="text-xs max-w-sm mx-auto">
              Ketika ada pasien yang memilih nama Anda melalui formulir janji temu publik, tiketnya akan langsung muncul di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myAppointments.map(apt => (
              <div
                key={apt.id}
                className={`glass-card rounded-3xl p-5 border flex flex-col justify-between transition-all ${
                  apt.status === 'Pending'
                    ? 'border-amber-400/80 bg-amber-50/20 dark:bg-amber-950/10 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-medical-600 dark:text-medical-400 block">
                        {apt.id}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                        {apt.patientName}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3" /> {apt.patientPhone} &bull; {apt.patientGender}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
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

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-medical-500" />
                      <span>{apt.date} &bull; {apt.time} WIB</span>
                    </div>
                    <p className="italic text-slate-600 dark:text-slate-300 text-[11px] pt-1">
                      "{apt.complaint}"
                    </p>
                  </div>

                  {apt.doctorNotes && (
                    <div className="p-3 rounded-2xl bg-medical-50 dark:bg-medical-950/40 border border-medical-200 dark:border-medical-800 text-xs">
                      <span className="font-bold text-medical-700 dark:text-medical-300 text-[10px] uppercase block">
                        Catatan Dokter Anda:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 text-xs mt-0.5">
                        {apt.doctorNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Doctor Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenCreateRecord(apt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-healthemerald-500" />
                    <span>Buat Rekam Medis</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {apt.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleAction(apt.id, 'Accepted')}
                          className="px-3 py-1.5 rounded-xl bg-healthemerald-600 hover:bg-healthemerald-700 text-white text-xs font-bold transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(apt.id, 'Cancelled')}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {apt.status === 'Accepted' && (
                      <button
                        onClick={() => handleAction(apt.id, 'Completed')}
                        className="px-3 py-1.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Selesaikan Tindakan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
