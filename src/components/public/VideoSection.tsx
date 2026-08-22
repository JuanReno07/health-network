import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { VideoItem } from '../../types';
import {
  Video,
  Play,
  X,
  Film,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { formatYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../../utils/youtube';

export const VideoSection: React.FC = () => {
  const { videos, activeHospitalId, activeHospital } = useHospital();
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

  const filteredVideos = videos.filter(
    v => v.hospitalId === 'all' || v.hospitalId === activeHospitalId
  );

  return (
    <section id="videos" className="py-16 bg-slate-100/40 dark:bg-navy-950/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-navy-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm backdrop-blur-sm">
            <Video className={`w-3.5 h-3.5 ${activeHospital.id === 'nusawardenna' ? 'text-medical-500' : 'text-healthemerald-500'}`} />
            <span>Video Profile &amp; Media Edukasi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Video Center Rumah Sakit
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Saksikan trailer resmi, profil departemen medis, dan panduan pertolongan pertama dari para dokter kami.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => {
            const displayThumbnail =
              video.thumbnailUrl ||
              getYouTubeThumbnailUrl(video.url) ||
              'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={video.id}
                onClick={() => setPlayingVideo(video)}
                className="glass-card rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail with Play Button Overlay */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={displayThumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-medical-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-medical-500 transition-all">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-md">
                        {video.type}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-medical-400" /> {video.duration}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-sm sm:text-base font-display text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-semibold text-medical-600 dark:text-medical-400">
                  <span>Putar Video Sekarang</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Video Player Modal */}
        {playingVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
            <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2 text-white">
                  <Film className="w-4 h-4 text-medical-400" />
                  <span className="font-bold text-xs sm:text-sm truncate max-w-md">
                    {playingVideo.title}
                  </span>
                </div>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full bg-black">
                <iframe
                  src={formatYouTubeEmbedUrl(playingVideo.url, true)}
                  title={playingVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-5 text-white space-y-1">
                <p className="text-xs text-slate-300">
                  {playingVideo.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
