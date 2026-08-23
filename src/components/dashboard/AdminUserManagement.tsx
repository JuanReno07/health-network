import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { User, Doctor, HospitalId } from '../../types';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Stethoscope,
  Trash2,
  Edit2,
  Save,
  X,
  Search,
  CheckCircle,
  Building2,
  Lock,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';

export const AdminUserManagement: React.FC = () => {
  const { users, doctors, saveUser, deleteUser, saveDoctor, deleteDoctor, activeHospitalId } = useHospital();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'DOCTOR'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Additional doctor fields when creating a doctor account
  const [doctorSpecialization, setDoctorSpecialization] = useState('Spesialis Umum');
  const [doctorDepartment, setDoctorDepartment] = useState('Instalasi Rawat Jalan');

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenNew = () => {
    setEditingUser({
      id: `user-${Date.now()}`,
      name: '',
      email: '',
      password: '123',
      role: 'ADMIN',
      hospitalId: 'all',
      badgeNumber: 'HQ-STAFF-01',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    setDoctorSpecialization('Spesialis Trauma & Bedah');
    setDoctorDepartment('Instalasi Bedah & IGD');
    setShowPassword(false);
    setIsNew(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser({
      ...user,
      password: user.password || '123'
    });
    if (user.role === 'DOCTOR' && user.doctorId) {
      const doc = doctors.find(d => d.id === user.doctorId);
      if (doc) {
        setDoctorSpecialization(doc.specialization);
        setDoctorDepartment(doc.department);
      }
    }
    setShowPassword(false);
    setIsNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.name.trim() || !editingUser.email.trim()) return;

    let doctorId = editingUser.doctorId;

    // If role is DOCTOR, sync with doctor directory
    if (editingUser.role === 'DOCTOR') {
      if (!doctorId) {
        doctorId = `doc-${Date.now()}`;
      }

      const existingDoc = doctors.find(d => d.id === doctorId);
      const updatedDoctor: Doctor = {
        id: doctorId,
        hospitalId: editingUser.hospitalId === 'all' ? 'both' : (editingUser.hospitalId as 'nusawardenna' | 'revenhill'),
        name: editingUser.name,
        title: existingDoc?.title || `Dokter Spesialis (${doctorSpecialization})`,
        specialization: doctorSpecialization || existingDoc?.specialization || 'Spesialis Medis',
        department: doctorDepartment || existingDoc?.department || 'Departemen Pelayanan Medis',
        photo: editingUser.avatar || existingDoc?.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        bio: existingDoc?.bio || `Staf medis berlisensi ${editingUser.name}, melayani perawatan pasien gawat darurat dan konsultasi rawat jalan.`,
        schedule: existingDoc?.schedule || 'Senin - Jumat (09.00 - 17.00)',
        availableDays: existingDoc?.availableDays || ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
        availableTimeSlots: existingDoc?.availableTimeSlots || ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
        experience: existingDoc?.experience || '8+ Tahun Pengalaman',
        availability: existingDoc?.availability || 'Available',
        status: 'active',
        badgeNumber: editingUser.badgeNumber || existingDoc?.badgeNumber || 'MED-STAFF',
        phone: existingDoc?.phone || '555-0100',
        email: editingUser.email
      };

      saveDoctor(updatedDoctor);
    }

    const finalUser: User = {
      ...editingUser,
      doctorId: editingUser.role === 'DOCTOR' ? doctorId : undefined,
      password: editingUser.password?.trim() || '123'
    };

    saveUser(finalUser);
    setEditingUser(null);
    setIsNew(false);
  };

  const handleDelete = (user: User) => {
    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    if (user.role === 'ADMIN' && adminCount <= 1) {
      alert('Tidak dapat menghapus akun admin utama yang tersisa.');
      return;
    }

    deleteUser(user.id);
    if (user.role === 'DOCTOR' && user.doctorId) {
      deleteDoctor(user.doctorId);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.badgeNumber && user.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const doctorCount = users.filter(u => u.role === 'DOCTOR').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            User &amp; Role Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola data akun login, hak akses (Administrator &amp; Dokter), serta kata sandi staf
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold shadow-md shadow-medical-600/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Role Tabs */}
        <div className="flex bg-white dark:bg-navy-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold w-full sm:w-auto">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl transition-all ${
              roleFilter === 'ALL'
                ? 'bg-medical-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Semua Akun ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('ADMIN')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl transition-all ${
              roleFilter === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Administrator ({adminCount})
          </button>
          <button
            onClick={() => setRoleFilter('DOCTOR')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl transition-all ${
              roleFilter === 'DOCTOR'
                ? 'bg-healthemerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dokter &amp; Paramedik ({doctorCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari username, nama, badge..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-medical-500 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-navy-950 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama &amp; Avatar</th>
                <th className="px-6 py-4">Username / ID Login</th>
                <th className="px-6 py-4">Password</th>
                <th className="px-6 py-4">Role Akses</th>
                <th className="px-6 py-4">Penugasan Rumah Sakit</th>
                <th className="px-6 py-4">Nomor Badge</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    Tidak ada akun yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isPassVisible = visiblePasswords[user.id];
                  const userPass = user.password || '123';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={user.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {user.name}
                            </div>
                            {user.role === 'DOCTOR' && (
                              <div className="text-[10px] text-healthemerald-600 dark:text-healthemerald-400 font-medium">
                                Tersinkron Dokter
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                          <span>{isPassVisible ? userPass : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title={isPassVisible ? 'Sembunyikan' : 'Lihat Password'}
                          >
                            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {user.role === 'ADMIN' ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <Stethoscope className="w-3 h-3" />
                          )}
                          <span>{user.role === 'ADMIN' ? 'ADMINISTRATOR' : 'DOKTER'}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {user.hospitalId === 'all'
                          ? 'Semua RS'
                          : user.hospitalId === 'nusawardenna'
                          ? 'RS Nusawardenna'
                          : 'MC Revenhill'}
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {user.badgeNumber || 'STAFF-00'}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-medical-50 hover:text-medical-600 dark:hover:bg-medical-950/50 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Edit Akun"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition-colors"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                <span>{isNew ? 'Tambah Akun Staff Baru' : 'Edit Akun Pengguna'}</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Staff *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="Dr. Elena Rostova / Administrator"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username / ID Login Staff (Bebas tanpa @) *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="admin / elena / vance / staff01"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono font-semibold"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Gunakan username ini saat login di Portal Staff.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password Akun *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={editingUser.password || ''}
                    onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="Masukkan password login..."
                    className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role Hak Akses
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={e =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as 'ADMIN' | 'DOCTOR'
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="ADMIN">ADMIN (Full Access)</option>
                    <option value="DOCTOR">DOKTER (Workstation)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor ID / Badge
                  </label>
                  <input
                    type="text"
                    value={editingUser.badgeNumber || ''}
                    onChange={e =>
                      setEditingUser({ ...editingUser, badgeNumber: e.target.value })
                    }
                    placeholder="NW-MED-12"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Penugasan Rumah Sakit
                </label>
                <select
                  value={editingUser.hospitalId}
                  onChange={e =>
                    setEditingUser({
                      ...editingUser,
                      hospitalId: e.target.value as HospitalId | 'all'
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                >
                  <option value="all">Semua Rumah Sakit</option>
                  <option value="nusawardenna">RS Nusawardenna</option>
                  <option value="revenhill">MC Revenhill</option>
                </select>
              </div>

              {/* Extra Doctor Details when DOCTOR role is selected */}
              {editingUser.role === 'DOCTOR' && (
                <div className="p-3.5 bg-healthemerald-50/60 dark:bg-healthemerald-950/30 rounded-2xl border border-healthemerald-200 dark:border-healthemerald-800 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-healthemerald-700 dark:text-healthemerald-300">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Konfigurasi Profil Dokter (Otomatis Tersinkron)</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Spesialisasi Medis
                    </label>
                    <input
                      type="text"
                      value={doctorSpecialization}
                      onChange={e => setDoctorSpecialization(e.target.value)}
                      placeholder="Spesialis Jantung & Pembuluh Darah"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Departemen / Instalasi
                    </label>
                    <input
                      type="text"
                      value={doctorDepartment}
                      onChange={e => setDoctorDepartment(e.target.value)}
                      placeholder="Cardiovascular Center"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Foto Avatar URL (Opsional)
                </label>
                <input
                  type="text"
                  value={editingUser.avatar || ''}
                  onChange={e => setEditingUser({ ...editingUser, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
