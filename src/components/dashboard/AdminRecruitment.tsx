import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RecruitmentPosition, HospitalId } from '../../types';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  Calendar,
  Save,
  X,
  Phone,
  MessageSquare
} from 'lucide-react';

export const AdminRecruitment: React.FC = () => {
  const {
    recruitment,
    applications,
    saveRecruitmentPosition,
    deleteRecruitmentPosition,
    activeHospitalId,
    activeHospital
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'positions' | 'applications'>('positions');
  const [editingPosition, setEditingPosition] = useState<RecruitmentPosition | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filteredPositions = recruitment.filter(
    p => p.hospitalId === 'all' || p.hospitalId === activeHospitalId
  );

  const handleOpenNew = () => {
    setEditingPosition({
      id: `rec-${Date.now()}`,
      hospitalId: activeHospitalId,
      position: '',
      department: 'Emergency & Ambulance Division',
      description: '',
      requirements: ['Warga San Andreas dengan lisensi aktif', 'Memiliki sertifikasi Bantuan Hidup Dasar (BHD)'],
      salaryInfo: '$5,000 - $8,000 / Periode Gaji',
      type: 'Paramedic',
      status: 'open',
      openDate: new Date().toISOString().split('T')[0]
    });
    setIsNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPosition || !editingPosition.position.trim()) return;
    saveRecruitmentPosition(editingPosition);
    setEditingPosition(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus lowongan rekrutmen ini?')) {
      deleteRecruitmentPosition(id);
    }
  };

  const handleToggleStatus = (pos: RecruitmentPosition) => {
    saveRecruitmentPosition({
      ...pos,
      status: pos.status === 'open' ? 'closed' : 'open'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Portal Rekrutmen & Karir Staff Medis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Buka / tutup lowongan formasi medis dan evaluasi berkas lamaran masuk dari pelamar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white dark:bg-navy-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'positions'
                  ? 'bg-medical-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Daftar Lowongan ({filteredPositions.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'applications'
                  ? 'bg-medical-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Berkas Masuk ({applications.length})
            </button>
          </div>

          {activeTab === 'positions' && (
            <button
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-healthemerald-600 hover:bg-healthemerald-700 text-white text-xs font-bold shadow-md shadow-healthemerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Buka Posisi Baru</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'positions' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPositions.map(pos => (
            <div
              key={pos.id}
              className={`glass-card rounded-3xl p-5 border flex flex-col justify-between transition-all ${
                pos.status === 'closed'
                  ? 'opacity-60 border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50'
                  : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-healthemerald-50 text-healthemerald-700 dark:bg-healthemerald-950 dark:text-healthemerald-300">
                    {pos.type}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(pos)}
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      pos.status === 'open'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                    title="Klik untuk buka / tutup rekrutmen"
                  >
                    {pos.status === 'open' ? 'Status: OPEN' : 'Status: CLOSED'}
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {pos.position}
                  </h3>
                  <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold mt-0.5">
                    {pos.department}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {pos.description}
                  </p>
                </div>

                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{pos.salaryInfo}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  Buka: {pos.openDate}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingPosition(pos);
                      setIsNew(false);
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-medical-50 hover:text-medical-600 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pos.id)}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Applications Review Table */
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-navy-950 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Pelamar & Kontak</th>
                  <th className="px-6 py-4">Posisi Dilamar</th>
                  <th className="px-6 py-4">Pengalaman Medis</th>
                  <th className="px-6 py-4">Motivasi</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                      Belum ada berkas lamaran masuk.
                    </td>
                  </tr>
                ) : (
                  applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {app.applicantName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {app.applicantPhone}
                          {app.applicantDiscord && (
                            <>
                              <span>&bull;</span>
                              <MessageSquare className="w-3 h-3 text-indigo-400" /> {app.applicantDiscord}
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-medical-600 dark:text-medical-400">
                        {app.positionTitle}
                      </td>

                      <td className="px-6 py-4 max-w-xs truncate" title={app.experience}>
                        {app.experience || '-'}
                      </td>

                      <td className="px-6 py-4 max-w-xs truncate" title={app.motivation}>
                        {app.motivation || '-'}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Create Position Modal */}
      {editingPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {isNew ? 'Buka Formasi Lowongan Baru' : 'Edit Lowongan Rekrutmen'}
              </h3>
              <button
                onClick={() => setEditingPosition(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Posisi / Formasi *
                </label>
                <input
                  type="text"
                  required
                  value={editingPosition.position}
                  onChange={e =>
                    setEditingPosition({ ...editingPosition, position: e.target.value })
                  }
                  placeholder="Tactical Paramedic (EMT-P)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-healthemerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Departemen
                  </label>
                  <input
                    type="text"
                    value={editingPosition.department}
                    onChange={e =>
                      setEditingPosition({ ...editingPosition, department: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-healthemerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Kepegawaian
                  </label>
                  <select
                    value={editingPosition.type}
                    onChange={e =>
                      setEditingPosition({
                        ...editingPosition,
                        type: e.target.value as RecruitmentPosition['type']
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-healthemerald-500 focus:outline-none"
                  >
                    <option value="Paramedic">Paramedic</option>
                    <option value="Residency">Residency</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimasi Gaji / Penghasilan ($)
                </label>
                <input
                  type="text"
                  value={editingPosition.salaryInfo}
                  onChange={e =>
                    setEditingPosition({ ...editingPosition, salaryInfo: e.target.value })
                  }
                  placeholder="$5,000 - $8,000 / Periode Gaji"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-healthemerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Tanggung Jawab
                </label>
                <textarea
                  rows={2}
                  value={editingPosition.description}
                  onChange={e =>
                    setEditingPosition({ ...editingPosition, description: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-healthemerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPosition(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-healthemerald-600 hover:bg-healthemerald-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Posisi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
