import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GalleryView } from './components/gallery/GalleryView';
import { MediaLightbox } from './components/gallery/MediaLightbox';
import { UploadModal } from './components/upload/UploadModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { NewAlbumModal } from './components/albums/NewAlbumModal';
import { EditAlbumModal } from './components/albums/EditAlbumModal';
import { LoginView } from './components/auth/LoginView';
import { LoadingScreen } from './components/common/LoadingScreen';
import type { MediaItem, Album, FilterState } from './types/media';
import {
  getAllMediaFromDB,
} from './utils/db';
import {
  fetchAllMedia,
  saveMediaToCloud,
  deleteMediaFromCloud,
  toggleFavoriteInCloud,
  fetchAlbumsFromCloud,
  saveAlbumToCloud,
  deleteAlbumFromCloud,
} from './utils/api';
import { CheckCircle2 } from 'lucide-react';

const DEMO_ALBUM_IDS = new Set([
  'nordic-expedition',
  'urban-architecture',
  'studio-archive',
  'cinematic-reels',
]);

const DigiFoxApp: React.FC = () => {
  // Main Library Data States - Starts completely clean, only user uploads
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  // Persistent Albums / Collections - Only user-created collections
  const [albums, setAlbums] = useState<Album[]>(() => {
    try {
      const saved = localStorage.getItem('digifox_saved_albums');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((a) => !DEMO_ALBUM_IDS.has(a.id));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial loading & Dual Local + Cloud DB hydration
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredUploads() {
      try {
        localStorage.setItem('digifox_cleared_demos', 'true');

        // 1. Fetch Local Albums from localStorage
        let localAlbums: Album[] = [];
        const saved = localStorage.getItem('digifox_saved_albums');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              localAlbums = parsed.filter((a) => !DEMO_ALBUM_IDS.has(a.id));
            }
          } catch {}
        }

        // Fetch Cloud Albums from Neon PostgreSQL
        let cloudAlbums: Album[] = [];
        try {
          cloudAlbums = await fetchAlbumsFromCloud();
        } catch (e) {
          console.warn('Could not fetch cloud albums:', e);
        }

        // Merge Albums (Cloud + Local)
        const albumMap = new Map<string, Album>();
        cloudAlbums.forEach((a) => {
          if (!DEMO_ALBUM_IDS.has(a.id)) albumMap.set(a.id, a);
        });
        localAlbums.forEach((a) => {
          if (!DEMO_ALBUM_IDS.has(a.id) && !albumMap.has(a.id)) {
            albumMap.set(a.id, a);
          }
        });
        const combinedAlbums = Array.from(albumMap.values());
        setAlbums(combinedAlbums);

        // Auto-sync any local-only albums to cloud
        const unsyncedAlbums = localAlbums.filter(
          (la) => !cloudAlbums.some((ca) => ca.id === la.id)
        );
        for (const alb of unsyncedAlbums) {
          saveAlbumToCloud(alb).catch(() => {});
        }

        // 2. Load Local Media from IndexedDB (instant offline / local cache)
        let localMedia: MediaItem[] = [];
        try {
          const stored = await getAllMediaFromDB();
          if (stored && stored.length > 0) {
            localMedia = stored.filter((i) => !i.id.startsWith('df-'));
          }
        } catch (e) {
          console.warn('Could not read local DB:', e);
        }

        // Load Cloud Media from Neon PostgreSQL
        let cloudMedia: MediaItem[] = [];
        try {
          cloudMedia = await fetchAllMedia();
        } catch (e) {
          console.warn('Could not read cloud media:', e);
        }

        // Merge Media (Cloud + Local) — ensuring local uploads are never lost!
        const mediaMap = new Map<string, MediaItem>();
        cloudMedia.forEach((m) => {
          if (!m.id.startsWith('df-')) mediaMap.set(m.id, m);
        });
        localMedia.forEach((m) => {
          if (!m.id.startsWith('df-') && !mediaMap.has(m.id)) {
            mediaMap.set(m.id, m);
          }
        });
        const combinedMedia = Array.from(mediaMap.values());
        setMediaItems(combinedMedia);

        // Auto-sync any local-only items to cloud so they appear on all devices
        const unsyncedMedia = localMedia.filter(
          (lm) => !cloudMedia.some((cm) => cm.id === lm.id)
        );
        if (unsyncedMedia.length > 0) {
          saveMediaToCloud(unsyncedMedia).catch(() => {});
        }
      } catch (err) {
        console.error('Failed to load uploads from DB:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredUploads();
  }, []);

  // Auth / Lock state
  const [isLocked, setIsLocked] = useState(false);

  // Filter & Sort State
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    mediaType: 'all',
    favoritesOnly: false,
    selectedAlbumId: null,
    selectedTag: null,
    sortField: 'dateAdded',
    sortDirection: 'desc',
  });

  // Modal States
  const [activeLightboxItem, setActiveLightboxItem] = useState<MediaItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<
    'appearance' | 'general' | 'storage' | 'account' | null
  >(null);
  const [isNewAlbumOpen, setIsNewAlbumOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  // Save albums to localStorage
  const saveAlbums = (updatedAlbums: Album[]) => {
    setAlbums(updatedAlbums);
    try {
      localStorage.setItem('digifox_saved_albums', JSON.stringify(updatedAlbums));
    } catch (e) {
      console.error('Failed to save albums:', e);
    }
  };

  // Compute live item counts for albums
  const albumsWithDynamicCounts = useMemo(() => {
    return albums.map((alb) => ({
      ...alb,
      itemCount: mediaItems.filter((m) => m.albumId === alb.id).length,
    }));
  }, [albums, mediaItems]);

  // Filter & Sort Calculations
  const filteredAndSortedMedia = useMemo(() => {
    return mediaItems
      .filter((item) => {
        // Search query filter
        if (filterState.searchQuery.trim()) {
          const q = filterState.searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
          const matchCamera = item.exif?.camera?.toLowerCase().includes(q);
          const matchLocation = item.exif?.location?.toLowerCase().includes(q);
          if (!matchTitle && !matchTags && !matchCamera && !matchLocation) {
            return false;
          }
        }

        // Media type filter
        if (filterState.mediaType !== 'all') {
          if (filterState.mediaType === 'drone' && item.type !== 'drone') return false;
          if (filterState.mediaType === 'photo' && item.type !== 'photo') return false;
          if (filterState.mediaType === 'video' && item.type !== 'video') return false;
          if (filterState.mediaType === 'raw' && item.type !== 'raw') return false;
        }

        // Favorites filter
        if (filterState.favoritesOnly && !item.isFavorite) {
          return false;
        }

        // Album filter
        if (filterState.selectedAlbumId && item.albumId !== filterState.selectedAlbumId) {
          return false;
        }

        // Tag filter
        if (filterState.selectedTag && !item.tags?.includes(filterState.selectedTag)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const factor = filterState.sortDirection === 'asc' ? 1 : -1;
        switch (filterState.sortField) {
          case 'title':
            return factor * a.title.localeCompare(b.title);
          case 'fileSize':
            return factor * (a.fileSizeBytes - b.fileSizeBytes);
          case 'rating':
            return factor * (a.rating - b.rating);
          case 'dateTaken':
            return factor * (new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime());
          case 'dateAdded':
          default:
            return factor * (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        }
      });
  }, [mediaItems, filterState]);

  // Media counts for sidebar indicators
  const mediaCounts = useMemo(() => {
    return {
      all: mediaItems.length,
      photos: mediaItems.filter((i) => i.type === 'photo').length,
      videos: mediaItems.filter((i) => i.type === 'video').length,
      drone: mediaItems.filter((i) => i.type === 'drone').length,
      favorites: mediaItems.filter((i) => i.isFavorite).length,
    };
  }, [mediaItems]);

  // Favorite toggle handler
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let nextFav = false;
    setMediaItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          nextFav = !item.isFavorite;
          return { ...item, isFavorite: nextFav };
        }
        return item;
      })
    );
    toggleFavoriteInCloud(id, nextFav);
  };

  // Batch operations
  const handleBatchFavorite = (ids: string[]) => {
    setMediaItems((prev) =>
      prev.map((item) =>
        ids.includes(item.id) ? { ...item, isFavorite: true } : item
      )
    );
    for (const id of ids) {
      toggleFavoriteInCloud(id, true);
    }
  };

  const handleDeleteItems = async (ids: string[]) => {
    setMediaItems((prev) => prev.filter((item) => !ids.includes(item.id)));
    try {
      await deleteMediaFromCloud(ids);
    } catch (e) {
      console.error(e);
    }
  };

  // Upload handler — Strictly deduplicated, single execution
  const handleUploadComplete = async (newItems: MediaItem[]) => {
    setMediaItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.id));
      const freshItems = newItems.filter((i) => !existingIds.has(i.id));
      return [...freshItems, ...prev];
    });

    try {
      await saveMediaToCloud(newItems);
    } catch (e) {
      console.error('Failed to persist items:', e);
    }

    setToastMessage(`Successfully uploaded ${newItems.length} file(s) to DigiFox Library!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Album creation handler
  const handleCreateAlbum = async (newAlbum: Album) => {
    const updated = [...albums, newAlbum];
    saveAlbums(updated);
    try {
      await saveAlbumToCloud(newAlbum);
    } catch (e) {
      console.error('Failed to sync new album to cloud:', e);
    }
    setToastMessage(`Collection "${newAlbum.title}" created.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Album edit / rename handler
  const handleSaveAlbum = async (updatedAlbum: Album) => {
    const updated = albums.map((a) => (a.id === updatedAlbum.id ? updatedAlbum : a));
    saveAlbums(updated);
    try {
      await saveAlbumToCloud(updatedAlbum);
    } catch (e) {
      console.error('Failed to sync updated album to cloud:', e);
    }
    setToastMessage(`Collection "${updatedAlbum.title}" updated.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Album delete handler
  const handleDeleteAlbum = async (albumId: string) => {
    const target = albums.find((a) => a.id === albumId);
    const updated = albums.filter((a) => a.id !== albumId);
    saveAlbums(updated);
    try {
      await deleteAlbumFromCloud(albumId);
    } catch (e) {
      console.error('Failed to delete album from cloud:', e);
    }

    // Unlink media items from this album
    setMediaItems((prev) =>
      prev.map((m) => (m.albumId === albumId ? { ...m, albumId: undefined } : m))
    );

    // If currently viewing this album, reset to all media
    if (filterState.selectedAlbumId === albumId) {
      setFilterState((prev) => ({ ...prev, selectedAlbumId: null }));
    }

    setToastMessage(`Collection "${target?.title || 'Album'}" deleted.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Assign or remove media from an album
  const handleAssignMediaToAlbum = (mediaIds: string[], targetAlbumId: string | null) => {
    setMediaItems((prev) => {
      const updated = prev.map((m) =>
        mediaIds.includes(m.id) ? { ...m, albumId: targetAlbumId || undefined } : m
      );
      saveMediaToCloud(updated.filter((i) => mediaIds.includes(i.id)));
      return updated;
    });

    const target = albums.find((a) => a.id === targetAlbumId);
    if (targetAlbumId && target) {
      setToastMessage(`Moved ${mediaIds.length} item(s) to "${target.title}"`);
    } else {
      setToastMessage(`Removed ${mediaIds.length} item(s) from collection`);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isLocked) {
    return <LoginView onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)',
        position: 'relative',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 150,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--accent)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 8,
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: 'var(--text-primary)',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={16} color="var(--color-success)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        albums={albumsWithDynamicCounts}
        filterState={filterState}
        onFilterChange={(update) => setFilterState((prev) => ({ ...prev, ...update }))}
        onOpenSettings={(tab) => setSettingsTab(tab || 'appearance')}
        onOpenNewAlbumModal={() => setIsNewAlbumOpen(true)}
        onEditAlbum={(album) => setEditingAlbum(album)}
        onDeleteAlbum={(albumId) => handleDeleteAlbum(albumId)}
        mediaCounts={mediaCounts}
      />

      {/* Main Workspace Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Global Header */}
        <Header
          filterState={filterState}
          onFilterChange={(update) => setFilterState((prev) => ({ ...prev, ...update }))}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenSettings={(tab) => setSettingsTab(tab || 'appearance')}
          onOpenAuthModal={() => setIsLocked(true)}
          totalMediaCount={filteredAndSortedMedia.length}
        />

        {/* Gallery View */}
        <GalleryView
          items={filteredAndSortedMedia}
          albums={albumsWithDynamicCounts}
          filterState={filterState}
          onSelectItem={(item) => setActiveLightboxItem(item)}
          onToggleFavorite={handleToggleFavorite}
          onDeleteItems={handleDeleteItems}
          onBatchFavorite={handleBatchFavorite}
          onOpenUpload={() => setIsUploadOpen(true)}
          onEditAlbum={(album) => setEditingAlbum(album)}
          onDeleteAlbum={(albumId) => handleDeleteAlbum(albumId)}
          onAssignMediaToAlbum={handleAssignMediaToAlbum}
        />
      </div>

      {/* Modals & Overlays */}
      {activeLightboxItem && (
        <MediaLightbox
          item={activeLightboxItem}
          items={filteredAndSortedMedia}
          onClose={() => setActiveLightboxItem(null)}
          onNavigate={(item) => setActiveLightboxItem(item)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {isUploadOpen && (
        <UploadModal
          albums={albumsWithDynamicCounts}
          onClose={() => setIsUploadOpen(false)}
          onUploadComplete={handleUploadComplete}
          onCreateAlbum={handleCreateAlbum}
        />
      )}

      {settingsTab && (
        <SettingsModal
          initialTab={settingsTab}
          onClose={() => setSettingsTab(null)}
        />
      )}

      {isNewAlbumOpen && (
        <NewAlbumModal
          onClose={() => setIsNewAlbumOpen(false)}
          onCreateAlbum={handleCreateAlbum}
        />
      )}

      {editingAlbum && (
        <EditAlbumModal
          album={editingAlbum}
          onClose={() => setEditingAlbum(null)}
          onSave={handleSaveAlbum}
          onDelete={handleDeleteAlbum}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <DigiFoxApp />
    </ThemeProvider>
  );
}
