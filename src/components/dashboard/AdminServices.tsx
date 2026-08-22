import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Service, HospitalId } from '../../types';
import {
  Activity,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Siren,
  Pill,
  FlaskConical,
  Brain,
  Stethoscope,
  HeartPulse,
  Save,
  X
} from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { services, saveService, deleteService, activeHospitalId, activeHospital } = useHospital();

  const [filterHospital, setFilterHospital] = useState<'current' | 'all'>('current');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filteredServices = services.filter(s => {
    if (filterHospital === 'all') return true;
    return s.hospitalId === 'all' || s.hospitalId === activeHospitalId;
  });

  const handleOpenNew = () => {
    setEditingService({
      id: `srv-${Date.now()}`,
      hospitalId: activeHospitalId,
      title: '',
      category: 'Emergency',
      description: '',
      icon: 'Activity',
      status: 'active',
      features: ['Layanan Siaga 24 Jam', 'Peralatan Medis Modern'],
      operatingHours: '24 Jam'
    });
    setIsNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title.trim()) return;
    saveService(editingService);
    setEditingService(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus layanan ini?')) {
      deleteService(id);
    }
  };

  const handleToggleStatus = (srv: Service) => {
    saveService({
      ...srv,
      status: srv.status === 'active' ? 'disabled' : 'active'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Content Management: Layanan Medis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tambah, edit, aktifkan/nonaktifkan layanan yang tampil di website publik
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold shadow-md shadow-medical-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Layanan Baru</span>
          </button>
        </div>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map(srv => (
          <div
            key={srv.id}
            className={`glass-card rounded-3xl p-5 border flex flex-col justify-between transition-all ${
              srv.status === 'disabled'
                ? 'opacity-60 border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50'
                : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-medical-50 text-medical-700 dark:bg-medical-950 dark:text-medical-300">
                  {srv.category}
                </span>

                <button
                  onClick={() => handleToggleStatus(srv)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    srv.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                  title="Klik untuk ubah status"
                >
                  {srv.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {srv.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {srv.description}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-medical-500" />
                <span>{srv.operatingHours}</span>
                <span>&bull;</span>
                <span>
                  {srv.hospitalId === 'all'
                    ? 'Semua RS'
                    : srv.hospitalId === 'nusawardenna'
                    ? 'RS Nusawardenna'
                    : 'MC Revenhill'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-[10px] text-slate-400 font-mono">
                ID: {srv.id}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setEditingService(srv);
                    setIsNew(false);
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-medical-50 hover:text-medical-600 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Edit Layanan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id)}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition-colors"
                  title="Hapus Layanan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {isNew ? 'Tambah Layanan Medis Baru' : 'Edit Data Layanan'}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Layanan / Instalasi *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="contoh: Instalasi Bedah & Kamar Operasi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editingService.category}
                    onChange={e =>
                      setEditingService({
                        ...editingService,
                        category: e.target.value as Service['category']
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Inpatient">Inpatient</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rumah Sakit
                  </label>
                  <select
                    value={editingService.hospitalId}
                    onChange={e =>
                      setEditingService({
                        ...editingService,
                        hospitalId: e.target.value as HospitalId | 'all'
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  >
                    <option value="all">Semua Rumah Sakit</option>
                    <option value="nusawardenna">RS Nusawardenna</option>
                    <option value="revenhill">MC Revenhill</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Lengkap Layanan
                </label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={e =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Icon Visual
                  </label>
                  <select
                    value={editingService.icon}
                    onChange={e => setEditingService({ ...editingService, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  >
                    <option value="Activity">Activity (Bedah / Medis)</option>
                    <option value="Siren">Siren (Gawat Darurat / IGD)</option>
                    <option value="Pill">Pill (Farmasi / Obat)</option>
                    <option value="FlaskConical">FlaskConical (Laboratorium)</option>
                    <option value="Brain">Brain (Neurologi / Saraf)</option>
                    <option value="Stethoscope">Stethoscope (Poliklinik / Diagnostik)</option>
                    <option value="HeartPulse">HeartPulse (Kardiologi / Helipad)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={editingService.operatingHours}
                    onChange={e =>
                      setEditingService({ ...editingService, operatingHours: e.target.value })
                    }
                    placeholder="24 Jam Non-Stop"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Layanan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
