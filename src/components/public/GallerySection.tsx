import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { GalleryItem } from '../../types';
import {
  Image as ImageIcon,
  Eye,
  X,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery, activeHospitalId, activeHospital } = useHospital();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Facilities', 'Ambulance & EMS', 'Surgical Theatres', 'Medical Staff'];

  const filteredGallery = gallery.filter(item => {
    const matchHospital =
      item.hospitalId === 'all' || item.hospitalId === activeHospitalId;
    const matchCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchHospital && matchCategory;
  });

  return (
    <section id="gallery" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-medical-50 dark:bg-medical-950/60 border border-medical-200 dark:border-medical-800 text-medical-700 dark:text-medical-300 text-xs font-bold">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Dokumentasi & Visual Fasilitas</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Galeri {activeHospital.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Kumpulan dokumentasi fasilitas trauma center, ruang bedah modern, helipad air ambulance, dan kegiatan tim paramedis.
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-medical-600 text-white shadow-md'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat === 'All' ? 'Semua Galeri' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-3xl overflow-hidden glass-card border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer h-72"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-medical-300 backdrop-blur-md border border-white/20">
                  {item.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
                <h3 className="font-bold text-sm sm:text-base font-display leading-tight group-hover:text-medical-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.date}</span>
                  <span className="flex items-center gap-1 text-medical-400 font-semibold">
                    <Eye className="w-3.5 h-3.5" /> Perbesar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Zoom Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
            <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-slate-950/60 hover:bg-slate-950 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>

              <div className="p-6 text-white space-y-2 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-medical-500/20 text-medical-300 border border-medical-500/30">
                    {activeItem.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{activeItem.date}</span>
                </div>
                <h3 className="font-bold text-lg font-display text-white">
                  {activeItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  {activeItem.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
