import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Announcement, HospitalId } from '../../types';
import {
  Bell,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Calendar,
  Save,
  X,
  CheckCircle2,
  Radio
} from 'lucide-react';

export const AdminAnnouncements: React.FC = () => {
  const {
    announcements,
    saveAnnouncement,
    deleteAnnouncement,
    activeHospitalId,
    activeHospital
  } = useHospital();

  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filteredAnnouncements = announcements.filter(
    a => a.hospitalId === 'all' || a.hospitalId === activeHospitalId
  );

  const handleOpenNew = () => {
    setEditingAnnouncement({
      id: `ann-${Date.now()}`,
      hospitalId: activeHospitalId,
      title: '',
      content: '',
      category: 'Notice',
      priority: 'normal',
      date: new Date().toISOString().split('T')[0],
      published: true,
      author: `Direktorat ${activeHospital.shortName}`
    });
    setIsNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !editingAnnouncement.title.trim()) return;
    saveAnnouncement(editingAnnouncement);
    setEditingAnnouncement(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus pengumuman ini?')) {
      deleteAnnouncement(id);
    }
  };

  const handleTogglePublish = (ann: Announcement) => {
    saveAnnouncement({
      ...ann,
      published: !ann.published
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Pusat Pengumuman & Breaking News
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Terbitkan rilis pers resmi, instruksi siaga darurat, dan informasi donor darah kota
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold shadow-md shadow-medical-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnnouncements.map(ann => (
          <div
            key={ann.id}
            className={`glass-card rounded-3xl p-5 border flex flex-col justify-between transition-all ${
              !ann.published
                ? 'opacity-60 border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50'
                : ann.priority === 'high'
                ? 'border-rose-300 dark:border-rose-800 shadow-md'
                : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    ann.priority === 'high'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-medical-50 text-medical-700 dark:bg-medical-950 dark:text-medical-300'
                  }`}
                >
                  {ann.category}
                </span>

                <button
                  onClick={() => handleTogglePublish(ann)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    ann.published
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {ann.published ? 'Published' : 'Draft'}
                </button>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                  {ann.content}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                {ann.date} &bull; {ann.author}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {ann.hospitalId === 'all' ? 'Semua RS' : activeHospital.shortName}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setEditingAnnouncement(ann);
                    setIsNew(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-medical-50 hover:text-medical-600 text-slate-600 dark:text-slate-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isNew ? 'Terbitkan Pengumuman Baru' : 'Edit Pengumuman'}
              </h3>
              <button
                onClick={() => setEditingAnnouncement(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Pengumuman / Berita *
                </label>
                <input
                  type="text"
                  required
                  value={editingAnnouncement.title}
                  onChange={e =>
                    setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editingAnnouncement.category}
                    onChange={e =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        category: e.target.value as Announcement['category']
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  >
                    <option value="Breaking Alert">Breaking Alert (Darurat)</option>
                    <option value="News">News (Berita)</option>
                    <option value="Notice">Notice (Pemberitahuan)</option>
                    <option value="Event">Event (Kegiatan / Donor)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prioritas Tampilan
                  </label>
                  <select
                    value={editingAnnouncement.priority}
                    onChange={e =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        priority: e.target.value as 'normal' | 'high'
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High (Sorotan Utama Merah)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Konten Lengkap Pengumuman *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingAnnouncement.content}
                  onChange={e =>
                    setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAnnouncement(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold"
                >
                  Simpan & Rilis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
