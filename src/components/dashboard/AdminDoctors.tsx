import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor, User } from '../../types';
import {
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Phone,
  Mail,
  Building2,
  Shield,
  Search,
  CheckCircle,
  Clock,
  User as UserIcon,
  X,
  Save,
  Filter,
  KeyRound,
  UserPlus,
  ShieldCheck,
  LogIn
} from 'lucide-react';

export const AdminDoctors: React.FC = () => {
  const { doctors, saveDoctor, deleteDoctor, updateDoctorAvailability, activeHospitalId, hospitals, users, saveUser } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterHospital, setFilterHospital] = useState<'all' | 'nusawardenna' | 'revenhill'>('all');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'Available' | 'Busy' | 'Offline'>('all');

  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filteredDoctors = doctors.filter(doc => {
    const matchSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.badgeNumber && doc.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchHospital =
      filterHospital === 'all' ||
      doc.hospitalId === 'both' ||
      doc.hospitalId === filterHospital;

    const matchAvail =
      filterAvailability === 'all' || doc.availability === filterAvailability;

    return matchSearch && matchHospital && matchAvail;
  });

  const handleOpenNew = () => {
    setEditingDoctor({
      id: `doc-${Date.now()}`,
      hospitalId: activeHospitalId,
      name: '',
      title: 'Spesialis Bedah Trauma',
      specialization: 'Trauma & Emergency Surgery',
      department: 'Instalasi Bedah & IGD',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      bio: 'Dokter spesialis berpengalaman dalam penanganan medis gawat darurat dan bedah trauma intensif.',
      schedule: 'Senin - Kamis (08.00 - 16.00)',
      experience: '8+ Tahun Pengalaman',
      availability: 'Available',
      status: 'active',
      badgeNumber: activeHospitalId === 'nusawardenna' ? 'NW-MED-09' : 'RH-MED-09',
      phone: '555-8109',
      email: 'doctor@hospital.gov'
    });
    setIsNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor || !editingDoctor.name.trim()) return;
    saveDoctor(editingDoctor);

    // Auto-create user account if new doctor without existing account
    if (isNew) {
      const existingUser = users.find(u => u.doctorId === editingDoctor.id);
      if (!existingUser && editingDoctor.email) {
        const newUser: User = {
          id: `user-${editingDoctor.id}`,
          name: editingDoctor.name,
          email: editingDoctor.email,
          role: 'DOCTOR',
          hospitalId: editingDoctor.hospitalId === 'both' ? 'all' : editingDoctor.hospitalId,
          doctorId: editingDoctor.id,
          badgeNumber: editingDoctor.badgeNumber,
          avatar: editingDoctor.photo
        };
        saveUser(newUser);
      }
    }

    setEditingDoctor(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus profil dokter ini?')) {
      deleteDoctor(id);
    }
  };

  // Create/update user account from doctor data
  const handleCreateAccount = (doc: Doctor) => {
    const newUser: User = {
      id: `user-${doc.id}`,
      name: doc.name,
      email: doc.email || `${doc.id}@hospital.gov`,
      role: 'DOCTOR',
      hospitalId: doc.hospitalId === 'both' ? 'all' : doc.hospitalId,
      doctorId: doc.id,
      badgeNumber: doc.badgeNumber,
      avatar: doc.photo
    };
    saveUser(newUser);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Manajemen Dokter & Spesialis Medis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola data staf medis, jadwal poliklinik, status ketersediaan live, dan penugasan departemen
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="h-10 px-4 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold shadow-md shadow-medical-600/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokter Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama dokter, spesialisasi, badge ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Hospital Filter */}
          <select
            value={filterHospital}
            onChange={e => setFilterHospital(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="all">Semua Rumah Sakit</option>
            <option value="nusawardenna">RS Nusawardenna</option>
            <option value="revenhill">MC Revenhill</option>
          </select>

          {/* Availability Filter */}
          <select
            value={filterAvailability}
            onChange={e => setFilterAvailability(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="all">Semua Status Siaga</option>
            <option value="Available">Available (Siaga)</option>
            <option value="Busy">Busy (Operasi)</option>
            <option value="Offline">Offline (Istirahat)</option>
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doc => (
          <div
            key={doc.id}
            className={`glass-card rounded-3xl p-6 border flex flex-col justify-between transition-all duration-200 ${
              doc.status === 'disabled'
                ? 'opacity-60 border-slate-300 dark:border-slate-800'
                : 'border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md'
            }`}
          >
            {/* Card Content Top */}
            <div className="space-y-4">
              {/* Doctor Avatar & Identity */}
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0 shadow-sm"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                    {doc.name}
                  </h3>
                  <div className="text-xs font-semibold text-medical-600 dark:text-medical-400 mt-1">
                    {doc.specialization}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      ID: {doc.badgeNumber || 'MED-00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Switcher Row */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Status Siaga On-Duty:
                </span>
                <select
                  value={doc.availability}
                  onChange={e =>
                    updateDoctorAvailability(doc.id, e.target.value as Doctor['availability'])
                  }
                  className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer transition-colors ${
                    doc.availability === 'Available'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                      : doc.availability === 'Busy'
                      ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <option value="Available">● Available</option>
                  <option value="Busy">● Busy (Operasi)</option>
                  <option value="Offline">● Offline</option>
                </select>
              </div>

              {/* Info Rows */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-medical-500 shrink-0" />
                  <span className="truncate">{doc.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-healthemerald-500 shrink-0" />
                  <span className="truncate">{doc.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-mono text-[11px]">{doc.phone || '555-0000'}</span>
                </div>
              </div>

              {/* Login Account Panel */}
              {(() => {
                const linkedUser = users.find(u => u.doctorId === doc.id);
                return linkedUser ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Akun Login Aktif</div>
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-200 font-mono truncate">{linkedUser.email}</div>
                    </div>
                    <span className="text-[9px] font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded-lg">DOCTOR</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCreateAccount(doc)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 border-dashed hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">Buat Akun Login Dokter</span>
                  </button>
                );
              })()}
            </div>

            {/* Card Footer Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                  doc.hospitalId === 'both'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : doc.hospitalId === 'nusawardenna'
                    ? 'bg-medical-50 text-medical-700 dark:bg-medical-950 dark:text-medical-300 border border-medical-200 dark:border-medical-800'
                    : 'bg-healthemerald-50 text-healthemerald-700 dark:bg-healthemerald-950 dark:text-healthemerald-300 border border-healthemerald-200 dark:border-healthemerald-800'
                }`}
              >
                {doc.hospitalId === 'both'
                  ? 'Semua RS'
                  : doc.hospitalId === 'nusawardenna'
                  ? 'RS Nusawardenna'
                  : 'MC Revenhill'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setEditingDoctor(doc);
                    setIsNew(false);
                  }}
                  className="h-8 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-medical-50 hover:text-medical-600 dark:hover:bg-medical-950/60 dark:hover:text-medical-300 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  title="Edit Data Dokter"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="h-8 w-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition-colors flex items-center justify-center shrink-0"
                  title="Hapus Profil Dokter"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {isNew ? 'Tambah Dokter / Staf Medis Baru' : 'Edit Profil Dokter'}
              </h3>
              <button
                onClick={() => setEditingDoctor(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap & Gelar Dokter *
                </label>
                <input
                  type="text"
                  required
                  value={editingDoctor.name}
                  onChange={e => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  placeholder="contoh: Dr. Raymond Vance, Sp.B"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Spesialisasi
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.specialization}
                    onChange={e =>
                      setEditingDoctor({ ...editingDoctor, specialization: e.target.value })
                    }
                    placeholder="Trauma & Bedah Umum"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Departemen / Instalasi
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.department}
                    onChange={e =>
                      setEditingDoctor({ ...editingDoctor, department: e.target.value })
                    }
                    placeholder="Instalasi Bedah"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Penugasan Rumah Sakit
                  </label>
                  <select
                    value={editingDoctor.hospitalId}
                    onChange={e =>
                      setEditingDoctor({
                        ...editingDoctor,
                        hospitalId: e.target.value as Doctor['hospitalId']
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  >
                    <option value="nusawardenna">RS Nusawardenna</option>
                    <option value="revenhill">MC Revenhill</option>
                    <option value="both">Kedua Rumah Sakit (Both)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor ID / Badge Medis
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.badgeNumber || ''}
                    onChange={e =>
                      setEditingDoctor({ ...editingDoctor, badgeNumber: e.target.value })
                    }
                    placeholder="NW-MED-01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Foto Profil Dokter
                </label>
                <input
                  type="text"
                  value={editingDoctor.photo}
                  onChange={e => setEditingDoctor({ ...editingDoctor, photo: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jadwal Praktik
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.schedule}
                    onChange={e =>
                      setEditingDoctor({ ...editingDoctor, schedule: e.target.value })
                    }
                    placeholder="Senin - Kamis (08.00 - 16.00)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No. Telepon Dokter
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.phone || ''}
                    onChange={e => setEditingDoctor({ ...editingDoctor, phone: e.target.value })}
                    placeholder="555-8101"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Biografi Singkat
                </label>
                <textarea
                  rows={2}
                  value={editingDoctor.bio}
                  onChange={e => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                  placeholder="Keahlian spesifik dan riwayat..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              {/* Hari & Slot Jam Praktik */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                    Hari Praktik Konsultasi Aktif
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => {
                      const isSel = (editingDoctor.availableDays || []).includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const cur = editingDoctor.availableDays || [];
                            const next = isSel ? cur.filter(d => d !== day) : [...cur, day];
                            setEditingDoctor({ ...editingDoctor, availableDays: next });
                          }}
                          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border text-center transition-all ${
                            isSel
                              ? 'bg-medical-600 text-white border-medical-600'
                              : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Slot Jam Praktik Terbuka (s/d 24:00)
                    </label>
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const pagi = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
                          const cur = editingDoctor.availableTimeSlots || [];
                          setEditingDoctor({
                            ...editingDoctor,
                            availableTimeSlots: Array.from(new Set([...cur, ...pagi])).sort()
                          });
                        }}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold"
                      >
                        + Pagi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const siang = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
                          const cur = editingDoctor.availableTimeSlots || [];
                          setEditingDoctor({
                            ...editingDoctor,
                            availableTimeSlots: Array.from(new Set([...cur, ...siang])).sort()
                          });
                        }}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold"
                      >
                        + Siang/Sore
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const malam = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00'];
                          const cur = editingDoctor.availableTimeSlots || [];
                          setEditingDoctor({
                            ...editingDoctor,
                            availableTimeSlots: Array.from(new Set([...cur, ...malam])).sort()
                          });
                        }}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold"
                      >
                        + Malam (s/d 24:00)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDoctor({ ...editingDoctor, availableTimeSlots: [] });
                        }}
                        className="text-[9px] px-1 py-0.5 text-rose-500 font-bold"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
                    {[
                      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
                      '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
                      '24:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00'
                    ].map(slot => {
                      const isSel = (editingDoctor.availableTimeSlots || []).includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            const cur = editingDoctor.availableTimeSlots || [];
                            const next = isSel ? cur.filter(s => s !== slot) : [...cur, slot].sort();
                            setEditingDoctor({ ...editingDoctor, availableTimeSlots: next });
                          }}
                          className={`px-1.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all text-center ${
                            isSel
                              ? 'bg-healthemerald-600 text-white border-healthemerald-600'
                              : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Dokter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
