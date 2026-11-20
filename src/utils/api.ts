// Cloud database synchronization for DigiFox Library with Neon PostgreSQL & Vercel
import type { MediaItem, Album } from '../types/media';
import {
  getAllMediaFromDB,
  saveMediaItemsToDB,
  deleteMediaFromDB,
  replaceMediaInDB,
} from './db';

const API_BASE = '';

export async function fetchAllMedia(): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/media`);
    if (res.ok) {
      const cloudItems: MediaItem[] = await res.json();
      if (Array.isArray(cloudItems)) {
        // Keep local IndexedDB cache in exact sync with cloud
        replaceMediaInDB(cloudItems).catch(() => {});
        return cloudItems;
      }
    }
  } catch (err) {
    console.warn('API /api/media offline or unreachable, falling back to local DB:', err);
  }

  // Fallback to local IndexedDB
  return getAllMediaFromDB();
}

export async function saveMediaToCloud(items: MediaItem[]): Promise<void> {
  // Always save locally first for instant response
  await saveMediaItemsToDB(items);

  try {
    await fetch(`${API_BASE}/api/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
  } catch (err) {
    console.warn('Failed to sync media to Neon Cloud DB:', err);
  }
}

export async function deleteMediaFromCloud(ids: string[]): Promise<void> {
  // Remove locally
  await deleteMediaFromDB(ids);

  try {
    await fetch(`${API_BASE}/api/media`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
  } catch (err) {
    console.warn('Failed to delete media from Neon Cloud DB:', err);
  }
}

export async function toggleFavoriteInCloud(id: string, isFavorite: boolean): Promise<void> {
  try {
    const items = await getAllMediaFromDB();
    const item = items.find((i) => i.id === id);
    if (item) {
      item.isFavorite = isFavorite;
      await saveMediaItemsToDB([item]);
    }
  } catch {}

  try {
    await fetch(`${API_BASE}/api/media`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isFavorite }),
    });
  } catch (err) {
    console.warn('Failed to update favorite status in Cloud DB:', err);
  }
}

export async function fetchAlbumsFromCloud(): Promise<Album[]> {
  try {
    const res = await fetch(`${API_BASE}/api/albums`);
    if (res.ok) {
      const cloudAlbums: Album[] = await res.json();
      if (Array.isArray(cloudAlbums)) {
        try {
          localStorage.setItem('digifox_saved_albums', JSON.stringify(cloudAlbums));
        } catch {}
        return cloudAlbums;
      }
    }
  } catch (err) {
    console.warn('API /api/albums offline, reading from localStorage:', err);
  }

  try {
    const saved = localStorage.getItem('digifox_saved_albums');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}

  return [];
}

export async function saveAlbumToCloud(album: Album): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/albums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(album),
    });
  } catch (err) {
    console.warn('Failed to save album to Neon Cloud DB:', err);
  }
}

export async function deleteAlbumFromCloud(albumId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/albums`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: albumId }),
    });
  } catch (err) {
    console.warn('Failed to delete album from Neon Cloud DB:', err);
  }
}
