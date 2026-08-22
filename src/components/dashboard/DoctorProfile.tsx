import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor } from '../../types';
import {
  Stethoscope,
  Save,
  CheckCircle,
  Calendar,
  Award,
  Phone,
  Mail,
  Building2,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const DoctorProfile: React.FC = () => {
  const { currentUser, doctors, saveDoctor, updateDoctorAvailability, activeHospital } = useHospital();

  const currentDoctor = doctors.find(d => d.id === currentUser?.doctorId) || doctors[0];

  const [formData, setFormData] = useState<Doctor>({ ...currentDoctor });
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (currentDoctor) {
      setFormData({ ...currentDoctor });
    }
  }, [currentDoctor]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveDoctor(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAvailabilityChange = (avail: Doctor['availability']) => {
    setFormData(prev => ({ ...prev, availability: avail }));
    updateDoctorAvailability(formData.id, avail);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Pengaturan Profil Dokter & Ketersediaan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perbarui foto profil, spesialisasi, jadwal konsultasi, dan status siaga yang langsung terlihat oleh publik
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4" />
            <span>Profil berhasil diperbarui!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Availability Switch */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Status Ketersediaan On-Duty (Live Public Status)
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleAvailabilityChange('Available')}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                formData.availability === 'Available'
                  ? 'bg-healthemerald-50 dark:bg-healthemerald-950 border-healthemerald-500 text-healthemerald-700 dark:text-healthemerald-300 ring-2 ring-healthemerald-500/20'
                  : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available (Siaga Konsultasi)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAvailabilityChange('Busy')}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                formData.availability === 'Busy'
                  ? 'bg-amber-50 dark:bg-amber-950 border-amber-500 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/20'
                  : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Busy (Tindakan / Operasi)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAvailabilityChange('Offline')}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                formData.availability === 'Offline'
                  ? 'bg-slate-200 dark:bg-slate-800 border-slate-400 text-slate-800 dark:text-white ring-2 ring-slate-400/20'
                  : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span>Offline (Istirahat / Off-Duty)</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={formData.photo}
              alt={formData.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-medical-500 shadow-md"
            />
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                URL Foto Profil Dokter
              </label>
              <input
                type="text"
                value={formData.photo}
                onChange={e => setFormData({ ...formData, photo: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap & Gelar
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gelar / Jabatan Medis
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Spesialisasi Klinis
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Departemen / Instalasi
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jadwal Praktik Rutin
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Biografi & Ringkasan Pengalaman
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Schedule & Consultation Time Slots */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-medical-600 dark:text-medical-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Konfigurasi Hari & Jam Praktik Mandiri
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tentukan hari aktif dan slot jam konsultasi Anda. Pasien di formulir reservasi publik hanya dapat memilih hari dan jam yang Anda aktifkan di sini.
            </p>
          </div>

          {/* 1. Days Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              1. Hari Praktik Aktif (Klik untuk Aktifkan / Libur)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => {
                const isSelected = (formData.availableDays || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const currentDays = formData.availableDays || [];
                      const nextDays = isSelected
                        ? currentDays.filter(d => d !== day)
                        : [...currentDays, day];
                      setFormData({ ...formData, availableDays: nextDays });
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                      isSelected
                        ? 'bg-medical-600 text-white border-medical-600 shadow-sm ring-2 ring-medical-500/20'
                        : 'bg-white dark:bg-navy-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Time Slots Selection */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                2. Slot Jam Konsultasi Tersedia (Hingga 24.00 / Siaga 24 Jam)
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const pagi = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
                    const existing = formData.availableTimeSlots || [];
                    const merged = Array.from(new Set([...existing, ...pagi])).sort();
                    setFormData({ ...formData, availableTimeSlots: merged });
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-medical-50 hover:text-medical-600 border border-slate-200 dark:border-slate-700"
                >
                  + Shift Pagi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const siang = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
                    const existing = formData.availableTimeSlots || [];
                    const merged = Array.from(new Set([...existing, ...siang])).sort();
                    setFormData({ ...formData, availableTimeSlots: merged });
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-medical-50 hover:text-medical-600 border border-slate-200 dark:border-slate-700"
                >
                  + Shift Siang/Sore
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const malam = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00'];
                    const existing = formData.availableTimeSlots || [];
                    const merged = Array.from(new Set([...existing, ...malam])).sort();
                    setFormData({ ...formData, availableTimeSlots: merged });
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-medical-50 hover:text-medical-600 border border-slate-200 dark:border-slate-700"
                >
                  + Shift Malam (s/d 24:00)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, availableTimeSlots: [] });
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Grid of Slots from 00:00 to 24:00 */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
              {[
                '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
                '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
                '24:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00'
              ].map(slot => {
                const isSelected = (formData.availableTimeSlots || []).includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      const currentSlots = formData.availableTimeSlots || [];
                      const nextSlots = isSelected
                        ? currentSlots.filter(s => s !== slot)
                        : [...currentSlots, slot].sort();
                      setFormData({ ...formData, availableTimeSlots: nextSlots });
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all border text-center ${
                      isSelected
                        ? 'bg-healthemerald-600 text-white border-healthemerald-600 shadow-sm ring-2 ring-healthemerald-500/20'
                        : 'bg-white dark:bg-navy-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Profil</span>
          </button>
        </div>
      </form>
    </div>
  );
};
