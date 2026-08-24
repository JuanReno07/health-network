import { isSafeUrl, sanitizeText } from './security';

/**
 * Utility to safely extract YouTube video ID and generate embed URL & thumbnail
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = sanitizeText(url.trim());

  // Check if string is already just an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtube.com/watch?v=VIDEO_ID
  // - https://m.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/live/VIDEO_ID
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

export function formatYouTubeEmbedUrl(url: string, autoPlay: boolean = true): string {
  if (!url || typeof url !== 'string') return '';
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}${autoPlay ? '?autoplay=1&rel=0' : '?rel=0'}`;
  }
  const clean = sanitizeText(url.trim());
  return isSafeUrl(clean) ? clean : '';
}

export function getYouTubeThumbnailUrl(url: string): string | null {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
}
