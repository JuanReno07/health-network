import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment, Doctor, HospitalId } from '../../types';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Building2,
  Stethoscope,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { sanitizeText, FormRateLimiter } from '../../utils/security';

interface AppointmentBookingSectionProps {
  preselectedDoctor?: Doctor | null;
  onAppointmentCreated: (appointment: Appointment) => void;
}

export const AppointmentBookingSection: React.FC<AppointmentBookingSectionProps> = ({
  preselectedDoctor,
  onAppointmentCreated
}) => {
  const { hospitals, doctors, appointments, activeHospitalId, createAppointment } = useHospital();

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientDob, setPatientDob] = useState('2000-01-01');
  const [patientGender, setPatientGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [complaint, setComplaint] = useState('');
  const [hospitalId, setHospitalId] = useState<HospitalId>(activeHospitalId);
  const [doctorId, setDoctorId] = useState<string>('');
  const [botTrap, setBotTrap] = useState(''); // Invisible honeypot for spam bots
  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:00');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update hospital and doctor if preselectedDoctor changes
  useEffect(() => {
    if (preselectedDoctor) {
      if (preselectedDoctor.hospitalId !== 'both') {
        setHospitalId(preselectedDoctor.hospitalId);
      }
      setDoctorId(preselectedDoctor.id);
    }
  }, [preselectedDoctor]);

  // Keep hospitalId synced with activeHospitalId if not manually modified
  useEffect(() => {
    if (!preselectedDoctor) {
      setHospitalId(activeHospitalId);
    }
  }, [activeHospitalId]);

  // Filter available doctors for the selected hospital
  const availableDoctors = doctors.filter(
    d =>
      d.status === 'active' &&
      (d.hospitalId === 'both' || d.hospitalId === hospitalId)
  );

  // Auto-select first doctor if doctorId is empty or invalid
  useEffect(() => {
    if (!doctorId && availableDoctors.length > 0) {
      setDoctorId(availableDoctors[0].id);
    } else if (doctorId && !availableDoctors.some(d => d.id === doctorId)) {
      setDoctorId(availableDoctors[0]?.id || '');
    }
  }, [hospitalId, availableDoctors]);

  // Selected doctor object & schedule
  const selectedDoctor = doctors.find(d => d.id === doctorId);
  const doctorDays = selectedDoctor?.availableDays || ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const doctorTimeSlots = selectedDoctor?.availableTimeSlots || [
    '08:30', '09:30', '10:30', '11:30', '13:30', '14:30', '15:30', '16:30'
  ];

  // Helper to get Indonesian day name
  const getDayNameIndo = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[d.getDay()];
  };

  const selectedDayName = getDayNameIndo(date);
  const isDoctorAvailableOnDay = doctorDays.includes(selectedDayName);

  // Booked slots for this doctor on this date
  const bookedSlots = appointments
    .filter(a => a.doctorId === doctorId && a.date === date && a.status !== 'Cancelled')
    .map(a => a.time);

  // Synchronize time selection when doctor or date changes
  useEffect(() => {
    if (doctorTimeSlots.length > 0) {
      const firstFreeSlot = doctorTimeSlots.find(s => !bookedSlots.includes(s));
      if (firstFreeSlot && (!doctorTimeSlots.includes(time) || bookedSlots.includes(time))) {
        setTime(firstFreeSlot);
      }
    }
  }, [doctorId, date, doctorTimeSlots, bookedSlots]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot bot protection
    if (botTrap) {
      console.warn('Bot submission blocked via honeypot.');
      return;
    }

    // Rate Limiting (Anti-Spam Flooding)
    const rateCheck = FormRateLimiter.canSubmit('appointment_booking', 4);
    if (!rateCheck.allowed) {
      setErrorMessage(`Terlalu banyak permintaan cepat. Mohon tunggu ${rateCheck.waitSeconds} detik sebelum memesan kembali.`);
      return;
    }

    const cleanPatientName = sanitizeText(patientName);
    const cleanPhone = sanitizeText(patientPhone);
    const cleanComplaint = sanitizeText(complaint);

    if (!cleanPatientName) {
      setErrorMessage('Harap masukkan nama lengkap pasien yang valid.');
      return;
    }
    if (!cleanPhone) {
      setErrorMessage('Harap masukkan nomor kontak / telepon aktif.');
      return;
    }
    if (!cleanComplaint) {
      setErrorMessage('Harap jelaskan keluhan atau alasan konsultasi.');
      return;
    }
    if (!doctorId || !selectedDoctor) {
      setErrorMessage('Harap pilih dokter spesialis yang dituju.');
      return;
    }
    if (!isDoctorAvailableOnDay) {
      setErrorMessage(
        `${selectedDoctor.name} tidak melayani konsultasi pada hari ${selectedDayName}. Silakan pilih hari praktik aktif: ${doctorDays.join(', ')}.`
      );
      return;
    }
    if (bookedSlots.includes(time)) {
      setErrorMessage(`Slot waktu ${time} sudah terisi. Silakan pilih slot jam lain yang masih tersedia.`);
      return;
    }

    setSubmitting(true);

    try {
      const newAppointment = createAppointment({
        patientName: cleanPatientName,
        patientPhone: cleanPhone,
        patientDob,
        patientGender,
        complaint: cleanComplaint,
        hospitalId,
        doctorId,
        doctorName: selectedDoctor.name,
        date,
        time,
        notes: `Didaftarkan secara online melalui Public Portal (Jadwal: ${selectedDayName}, ${time}).`
      });

      // Confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Reset form
      setComplaint('');
      setSubmitting(false);

      // Trigger callback to display digital ticket modal
      onAppointmentCreated(newAppointment);
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi kesalahan sistem saat menyimpan janji temu.');
      setSubmitting(false);
    }
  };

  const timeSlots = [
    '08:30', '09:30', '10:30', '11:30',
    '13:30', '14:30', '15:30', '16:30',
    '18:30', '19:30', '20:30'
  ];

  return (
    <section id="booking" className="py-20 relative bg-slate-100/50 dark:bg-navy-950/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-medical-50 dark:bg-medical-950/60 border border-medical-200 dark:border-medical-800 text-medical-700 dark:text-medical-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pendaftaran Pasien Publik Tanpa Login</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Buat Janji Temu Dokter
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Lengkapi formulir di bawah ini untuk mendapatkan Appointment ID resmi dan jadwal konsultasi prioritas di RS Nusawardenna atau MC Revenhill.
          </p>
        </div>

        {/* Booking Card Form */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/80 dark:border-slate-800/80">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Hospital Choice */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                1. Pilih Rumah Sakit Tujuan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHospitalId('nusawardenna')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    hospitalId === 'nusawardenna'
                      ? 'bg-medical-50 dark:bg-medical-950/50 border-medical-500 ring-2 ring-medical-500/20 shadow-md'
                      : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-medical-500/10 text-medical-600 dark:text-medical-400 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      RS Nusawardenna
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Pusat Trauma & Bedah Downtown
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setHospitalId('revenhill')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    hospitalId === 'revenhill'
                      ? 'bg-healthemerald-50 dark:bg-healthemerald-950/50 border-healthemerald-500 ring-2 ring-healthemerald-500/20 shadow-md'
                      : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-healthemerald-500/10 text-healthemerald-600 dark:text-healthemerald-400 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      Medical Center Revenhill
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Bedah Presisi & Suite VIP Rockford
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Patient Biodata */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                2. Data Pasien
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nama Lengkap Pasien *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      placeholder="contoh: Franklin Clinton"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    No. Telepon / No. HP Aktif *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value.replace(/[^0-9+-]/g, ''))}
                      placeholder="contoh: 555-0142"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none font-mono"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={patientDob}
                    onChange={e => setPatientDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Jenis Kelamin
                  </label>
                  <select
                    value={patientGender}
                    onChange={e => setPatientGender(e.target.value as 'Laki-laki' | 'Perempuan')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Doctor Selection & Schedule */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                3. Pilih Dokter & Waktu Konsultasi
              </label>

              <div className="space-y-4">
                {/* Doctor Select Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Pilih Dokter Spesialis *
                  </label>
                  <div className="relative">
                    <select
                      value={doctorId}
                      onChange={e => setDoctorId(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
                    >
                      {availableDoctors.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} - {doc.specialization} ({doc.availability})
                        </option>
                      ))}
                    </select>
                    <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Doctor Active Schedule Pill Info */}
                {selectedDoctor && (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-medical-50/70 dark:bg-medical-950/40 border border-medical-200/80 dark:border-medical-800/80 text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={selectedDoctor.photo}
                        alt={selectedDoctor.name}
                        className="w-8 h-8 rounded-xl object-cover border border-medical-500 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {selectedDoctor.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {selectedDoctor.department} &bull; {selectedDoctor.specialization}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Hari Praktik:
                      </span>
                      {doctorDays.map(d => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-navy-900 border border-medical-300 dark:border-medical-700 text-medical-700 dark:text-medical-300 text-[10px] font-bold"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Date Picker with Day Indicator */}
                  <div className="sm:col-span-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Tanggal Janji Temu *
                      </label>
                      {selectedDayName && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isDoctorAvailableOnDay
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          Hari {selectedDayName}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Time Slots based on Doctor Availability */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Pilihan Slot Waktu Dokter *
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {doctorTimeSlots.length} slot terdaftar
                      </span>
                    </div>

                    {!isDoctorAvailableOnDay ? (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
                        <span className="font-bold">{selectedDoctor?.name}</span> tidak membuka praktik pada hari{' '}
                        <span className="font-bold underline">{selectedDayName}</span>. Silakan pilih tanggal pada hari:{' '}
                        <span className="font-bold">{doctorDays.join(', ')}</span>.
                      </div>
                    ) : doctorTimeSlots.length === 0 ? (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs">
                        Dokter belum mengaktifkan slot waktu praktik untuk hari ini.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {doctorTimeSlots.map(slot => {
                          const isBooked = bookedSlots.includes(slot);
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setTime(slot)}
                              title={isBooked ? `Slot ${slot} sudah terisi / Booked` : `Pilih slot jam ${slot}`}
                              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                                isBooked
                                  ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-600 line-through cursor-not-allowed border border-dashed border-slate-300 dark:border-slate-700'
                                  : time === slot
                                  ? 'bg-medical-600 text-white shadow-md ring-2 ring-medical-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'
                              }`}
                            >
                              {!isBooked && (
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    time === slot ? 'bg-white' : 'bg-emerald-500'
                                  }`}
                                />
                              )}
                              <span>{slot}</span>
                              {isBooked && <span className="text-[9px] no-underline font-sans">(Penuh)</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Medical Complaint */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                4. Keluhan / Gejala Medis Pasien *
              </label>
              <textarea
                rows={3}
                value={complaint}
                onChange={e => setComplaint(e.target.value)}
                placeholder="Jelaskan secara singkat gejala, riwayat keluhan/kondisi fisik, atau tujuan konsultasi..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-medical-600 via-medical-500 to-healthemerald-600 hover:from-medical-500 hover:to-healthemerald-500 shadow-xl shadow-medical-500/20 hover:shadow-glow-blue transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{submitting ? 'Memproses Pendaftaran...' : 'Konfirmasi & Terbitkan Tiket Janji Temu'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Nomor Appointment ID dan tiket digital akan langsung diterbitkan secara otomatis setelah konfirmasi.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
