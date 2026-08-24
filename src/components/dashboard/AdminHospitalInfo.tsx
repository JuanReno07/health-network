import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Hospital } from '../../types';
import {
  Settings,
  Building2,
  Save,
  Award,
  Phone,
  Radio,
  MapPin,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react';

export const AdminHospitalInfo: React.FC = () => {
  const { activeHospital, updateHospital } = useHospital();
  const [formData, setFormData] = useState<Hospital>({ ...activeHospital });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state ONLY when switching to a different hospital ID
  React.useEffect(() => {
    setFormData({ ...activeHospital });
  }, [activeHospital.id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospital(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Konfigurasi & Profil Rumah Sakit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perbarui nama, sejarah, visi misi, direktur, logo kota, dan informasi kontak {activeHospital.name}
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4" />
            <span>Perubahan berhasil disimpan dan langsung update ke website publik!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: General Info & Branding */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-medical-500" />
            <span>Identitas & Branding Rumah Sakit</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap Rumah Sakit *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Pendek / Singkatan
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={e => setFormData({ ...formData, shortName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tagline Utama
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi Umum Rumah Sakit
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: History & Director */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-medical-500" />
            <span>Sejarah & Direktur Utama</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sejarah Perjalanan Rumah Sakit
              </label>
              <textarea
                rows={3}
                value={formData.history}
                onChange={e => setFormData({ ...formData, history: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Direktur Utama
                </label>
                <input
                  type="text"
                  value={formData.director.name}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      director: { ...formData.director, name: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jabatan / Gelar Direktur
                </label>
                <input
                  type="text"
                  value={formData.director.title}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      director: { ...formData.director, title: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL / Link Foto Profil Direktur
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={formData.director.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'}
                    alt="Preview Direktur"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-medical-500 shadow-sm flex-shrink-0 bg-slate-100 dark:bg-slate-800"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <input
                    type="url"
                    value={formData.director.photo || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        director: { ...formData.director, photo: e.target.value }
                      })
                    }
                    placeholder="https://images.unsplash.com/... atau link foto dokter"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pesan / Sambutan Direktur
                </label>
                <textarea
                  rows={2}
                  value={formData.director.message}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      director: { ...formData.director, message: e.target.value }
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Emergency Dispatch */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-medical-500" />
            <span>Kontak & Radio EMS</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hotline Darurat
              </label>
              <input
                type="text"
                value={formData.contact.emergencyPhone}
                onChange={e =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, emergencyPhone: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Frekuensi Radio Medis (EMS Band)
              </label>
              <input
                type="text"
                value={formData.contact.radioFrequency}
                onChange={e =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, radioFrequency: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Rumah Sakit
              </label>
              <input
                type="text"
                value={formData.contact.email}
                onChange={e =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold shadow-xl shadow-medical-600/25 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Seluruh Pengaturan Rumah Sakit</span>
          </button>
        </div>
      </form>
    </div>
  );
};
