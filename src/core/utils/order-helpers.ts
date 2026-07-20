export const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const formatDuration = (seconds: number) => {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const getFileName = (uri: string, fallbackPrefix: string, fallbackExtension: string) => {
  const rawName = uri.split('/').pop()?.split('?')[0];
  return rawName && rawName.includes('.') ? rawName : `${fallbackPrefix}-${genId()}.${fallbackExtension}`;
};

export const getMimeType = (uri: string, fallbackType: string) => {
  const extension = uri.split('?')[0].split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'webm':
      return 'video/webm';
    case 'm4a':
      return 'audio/mp4';
    case 'aac':
      return 'audio/aac';
    case 'wav':
      return 'audio/wav';
    default:
      return fallbackType;
  }
};

export const buildFilePayload = (uri: string, kind: 'image' | 'video' | 'voice') => {
  const fallbackExtension = kind === 'image' ? 'jpg' : kind === 'video' ? 'mp4' : 'm4a';
  const fallbackMimeType = kind === 'image' ? 'image/jpeg' : kind === 'video' ? 'video/mp4' : 'audio/mp4';
  return {
    uri,
    name: getFileName(uri, kind, fallbackExtension),
    type: getMimeType(uri, fallbackMimeType),
  };
};

const pad = (n: number) => String(n).padStart(2, '0');

// API expects "YYYY-MM-DD HH:mm:ss" in local time.
export const formatForApi = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:00`;

export const formatDateLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

export const formatTimeLabel = (date: Date) =>
  date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
