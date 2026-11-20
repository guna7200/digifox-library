// Utility to trigger real browser downloads for photos, videos, and raw files
import type { MediaItem } from '../types/media';

export function getSafeFilename(item: MediaItem): string {
  let name = item.title.trim().replace(/[/\\?%*:|"<>]/g, '_');
  const hasExt = /\.(jpe?g|png|webp|mp4|mov|mkv|dng|arw|cr2|cr3|raw)$/i.test(name);
  if (!hasExt) {
    if (item.type === 'video') {
      name += '.mp4';
    } else if (item.type === 'raw') {
      name += '.dng';
    } else {
      name += '.jpg';
    }
  }
  return name;
}

export async function downloadSingleMediaItem(item: MediaItem): Promise<boolean> {
  const filename = getSafeFilename(item);
  const url = item.url;

  try {
    // If it's a Data URL (base64) or Blob URL
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    }

    // If it's a remote URL (http / https), fetch as blob to force download
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 2500);

    return true;
  } catch (err) {
    console.warn('Direct blob download failed, falling back to anchor trigger:', err);
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    } catch (fallbackErr) {
      console.error('All download attempts failed:', fallbackErr);
      return false;
    }
  }
}

export async function downloadBatchMediaItems(
  items: MediaItem[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    if (onProgress) {
      onProgress(i + 1, items.length);
    }
    await downloadSingleMediaItem(items[i]);
    // Small delay between downloads so the browser doesn't block multi-file downloads
    if (i < items.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }
}
