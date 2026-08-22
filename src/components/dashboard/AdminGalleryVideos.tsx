import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { GalleryItem, VideoItem, HospitalId } from '../../types';
import {
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Play,
  Eye,
  Building2
} from 'lucide-react';
import { formatYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../../utils/youtube';

export const AdminGalleryVideos: React.FC = () => {
  const {
    gallery,
    videos,
    saveGalleryItem,
    deleteGalleryItem,
    saveVideo,
    deleteVideo,
    activeHospitalId,
    activeHospital
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'gallery' | 'videos'>('gallery');

  // Modal states for Gallery
  const [editingPhoto, setEditingPhoto] = useState<GalleryItem | null>(null);
  const [isNewPhoto, setIsNewPhoto] = useState(false);

  // Modal states for Video
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isNewVideo, setIsNewVideo] = useState(false);

  // Filtered lists
  const filteredGallery = gallery.filter(
    g => g.hospitalId === 'all' || g.hospitalId === activeHospitalId
  );

  const filteredVideos = videos.filter(
    v => v.hospitalId === 'all' || v.hospitalId === activeHospitalId
  );

  const handleOpenNewPhoto = () => {
    setEditingPhoto({
      id: `gal-${Date.now()}`,
      hospitalId: activeHospitalId,
      title: '',
      category: 'Facilities',
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsNewPhoto(true);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto || !editingPhoto.title.trim()) return;
    saveGalleryItem(editingPhoto);
    setEditingPhoto(null);
    setIsNewPhoto(false);
  };

  const handleOpenNewVideo = () => {
    setEditingVideo({
      id: `vid-${Date.now()}`,
      hospitalId: activeHospitalId,
      title: '',
      type: 'Trailer',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      duration: '03:30',
      description: ''
    });
    setIsNewVideo(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo || !editingVideo.title.trim()) return;

    const formattedUrl = formatYouTubeEmbedUrl(editingVideo.url, false);
    const autoThumb = editingVideo.thumbnailUrl?.trim() || getYouTubeThumbnailUrl(editingVideo.url) || '';

    saveVideo({
      ...editingVideo,
      url: formattedUrl || editingVideo.url,
      thumbnailUrl: autoThumb || editingVideo.thumbnailUrl
    });
    setEditingVideo(null);
    setIsNewVideo(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Media Center: Galeri & Video
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola foto dokumentasi fasilitas, armada ambulans, trailer sinematik, dan video edukasi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white dark:bg-navy-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                activeTab === 'gallery'
                  ? 'bg-medical-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Galeri Foto ({filteredGallery.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                activeTab === 'videos'
                  ? 'bg-medical-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Video Center ({filteredVideos.length})
            </button>
          </div>

          <button
            onClick={activeTab === 'gallery' ? handleOpenNewPhoto : handleOpenNewVideo}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold shadow-md shadow-medical-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'gallery' ? 'Upload Foto Baru' : 'Tambah Video Baru'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'gallery' ? (
        /* Gallery Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map(photo => (
            <div
              key={photo.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-950/80 text-white backdrop-blur-md">
                    {photo.category}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {photo.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">{photo.date}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingPhoto(photo);
                      setIsNewPhoto(false);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-medical-50 hover:text-medical-600 text-slate-600 dark:text-slate-300"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Hapus foto ini?')) deleteGalleryItem(photo.id);
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Video Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(vid => (
            <div
              key={vid.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-950/80 text-white">
                    {vid.type}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/80 text-white">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {vid.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 truncate max-w-[150px] font-mono">
                  {vid.url}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingVideo(vid);
                      setIsNewVideo(false);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-medical-50 hover:text-medical-600 text-slate-600 dark:text-slate-300"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Hapus video ini?')) deleteVideo(vid.id);
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Photo */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isNewPhoto ? 'Tambah Foto Galeri' : 'Edit Foto Galeri'}
              </h3>
              <button
                onClick={() => setEditingPhoto(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Foto *
                </label>
                <input
                  type="text"
                  required
                  value={editingPhoto.title}
                  onChange={e => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  placeholder="Gedung Trauma Center IGD"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={editingPhoto.category}
                  onChange={e =>
                    setEditingPhoto({
                      ...editingPhoto,
                      category: e.target.value as GalleryItem['category']
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                >
                  <option value="Facilities">Facilities (Fasilitas RS)</option>
                  <option value="Ambulance & EMS">Ambulance & EMS (Armada)</option>
                  <option value="Surgical Theatres">Surgical Theatres (Kamar Operasi)</option>
                  <option value="Medical Staff">Medical Staff (Tenaga Medis)</option>
                  <option value="Events">Events (Kegiatan)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Gambar (Cloud / CDN) *
                </label>
                <input
                  type="text"
                  required
                  value={editingPhoto.imageUrl}
                  onChange={e => setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={editingPhoto.description}
                  onChange={e => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold"
                >
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Video */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isNewVideo ? 'Tambah Video Baru' : 'Edit Data Video'}
              </h3>
              <button
                onClick={() => setEditingVideo(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Video *
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.title}
                  onChange={e => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  placeholder="Trailer Profile RS Nusawardenna"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Video
                  </label>
                  <select
                    value={editingVideo.type}
                    onChange={e =>
                      setEditingVideo({
                        ...editingVideo,
                        type: e.target.value as VideoItem['type']
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  >
                    <option value="Trailer">Trailer</option>
                    <option value="Profile">Profile</option>
                    <option value="Education">Education</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi Video
                  </label>
                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={e => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    placeholder="03:45"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Video (YouTube / Embed / MP4) *
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.url}
                  onChange={e => {
                    const val = e.target.value;
                    const autoThumb = getYouTubeThumbnailUrl(val);
                    setEditingVideo({
                      ...editingVideo,
                      url: val,
                      thumbnailUrl: (!editingVideo.thumbnailUrl && autoThumb) ? autoThumb : editingVideo.thumbnailUrl
                    });
                  }}
                  placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  💡 Mendukung semua format link YouTube (link share youtu.be, shorts, atau watch biasa). Sistem akan otomatis mengonversi ke format embed yang valid.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thumbnail Video URL (Opsional)
                </label>
                <input
                  type="text"
                  value={editingVideo.thumbnailUrl}
                  onChange={e =>
                    setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/... (atau kosongkan untuk auto-thumbnail YouTube)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Video *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingVideo.description}
                  onChange={e =>
                    setEditingVideo({ ...editingVideo, description: e.target.value })
                  }
                  placeholder="Tuliskan ringkasan / deskripsi mengenai video ini..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold"
                >
                  Simpan Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
