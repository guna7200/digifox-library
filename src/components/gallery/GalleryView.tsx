import React, { useState } from 'react';
import {
  Grid3X3,
  LayoutGrid,
  Maximize,
  Download,
  Trash2,
  Heart,
  CheckSquare,
  X,
  Upload,
  FolderOpen,
  Folder,
  Edit3,
  FolderPlus,
  ChevronDown,
} from 'lucide-react';
import type { MediaItem, FilterState, Album } from '../../types/media';
import { MediaCard } from './MediaCard';
import { downloadBatchMediaItems } from '../../utils/download';

interface GalleryViewProps {
  items: MediaItem[];
  albums: Album[];
  filterState: FilterState;
  onSelectItem: (item: MediaItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDeleteItems: (ids: string[]) => void;
  onBatchFavorite: (ids: string[]) => void;
  onOpenUpload: () => void;
  onEditAlbum?: (album: Album) => void;
  onDeleteAlbum?: (albumId: string) => void;
  onAssignMediaToAlbum?: (mediaIds: string[], albumId: string | null) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  items,
  albums,
  filterState,
  onSelectItem,
  onToggleFavorite,
  onDeleteItems,
  onBatchFavorite,
  onOpenUpload,
  onEditAlbum,
  onDeleteAlbum,
  onAssignMediaToAlbum,
}) => {
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'expanded'>('comfortable');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAlbumAssignMenu, setShowAlbumAssignMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  // Export selected items directly to user's computer
  const handleExportSelected = async () => {
    if (selectedIds.length === 0 || isExporting) return;
    setIsExporting(true);
    const selectedItems = items.filter((i) => selectedIds.includes(i.id));
    await downloadBatchMediaItems(selectedItems, (curr, total) => {
      setExportStatus(`Exporting ${curr}/${total}...`);
    });
    setIsExporting(false);
    setExportStatus(null);
  };

  // Active album details if viewing an album
  const currentAlbum = filterState.selectedAlbumId
    ? albums.find((a) => a.id === filterState.selectedAlbumId)
    : null;

  // Selection handlers
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Group items by date added or taken
  const groups: { [key: string]: MediaItem[] } = {};
  items.forEach((item) => {
    const dateObj = new Date(item.dateAdded);
    const dateKey = dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
  });

  const gridColsClass = {
    compact: 'repeat(auto-fill, minmax(180px, 1fr))',
    comfortable: 'repeat(auto-fill, minmax(260px, 1fr))',
    expanded: 'repeat(auto-fill, minmax(380px, 1fr))',
  }[density];

  return (
    <div
      style={{
        flex: 1,
        padding: '24px 32px 64px 32px',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-main)',
      }}
    >
      {/* If viewing a specific album/collection, display the rich Album Header */}
      {currentAlbum && (
        <div
          style={{
            marginBottom: 24,
            padding: 20,
            borderRadius: 12,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 10,
                backgroundColor: 'var(--accent-subtle)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Folder size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {currentAlbum.title}
                </h2>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 12,
                    backgroundColor: 'var(--selected-bg)',
                    color: 'var(--accent)',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  marginTop: 4,
                  maxWidth: 540,
                }}
              >
                {currentAlbum.description || 'Collection album in DigiFox Library.'}
              </p>
            </div>
          </div>

          {/* Album Management Actions: Edit Details & Delete Collection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {onEditAlbum && (
              <button
                type="button"
                onClick={() => onEditAlbum(currentAlbum)}
                className="btn-secondary"
                style={{ height: 36, fontSize: 12.5 }}
                title="Rename collection or edit description"
              >
                <Edit3 size={14} />
                <span>Edit Collection</span>
              </button>
            )}

            {onDeleteAlbum && (
              <button
                type="button"
                onClick={() => onDeleteAlbum(currentAlbum.id)}
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 8,
                  backgroundColor: 'var(--color-error-subtle)',
                  color: 'var(--color-error)',
                  border: '1px solid var(--color-error-subtle)',
                  fontSize: 12.5,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'opacity 150ms ease',
                }}
                title="Delete this collection"
              >
                <Trash2 size={14} />
                <span>Delete Collection</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Gallery Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {filterState.selectedAlbumId
              ? `${currentAlbum ? currentAlbum.title : 'Album Media'}`
              : filterState.favoritesOnly
              ? 'Starred Favorites'
              : filterState.mediaType === 'video'
              ? 'Videos'
              : filterState.mediaType === 'drone'
              ? 'Drone Videos'
              : 'All Library Media'}
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              marginTop: 4,
            }}
          >
            {items.length} {items.length === 1 ? 'item' : 'items'} in DigiFox Library
            {filterState.searchQuery && ` • matching "${filterState.searchQuery}"`}
          </p>
        </div>

        {/* Actions & View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* View density switches */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              padding: 3,
              borderRadius: 8,
            }}
          >
            <button
              onClick={() => setDensity('compact')}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                background: density === 'compact' ? 'var(--hover-bg)' : 'transparent',
                color: density === 'compact' ? 'var(--accent)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 500,
              }}
              title="Compact grid"
            >
              <Grid3X3 size={14} />
              <span>Compact</span>
            </button>
            <button
              onClick={() => setDensity('comfortable')}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                background: density === 'comfortable' ? 'var(--hover-bg)' : 'transparent',
                color: density === 'comfortable' ? 'var(--accent)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 500,
              }}
              title="Comfortable grid"
            >
              <LayoutGrid size={14} />
              <span>Comfortable</span>
            </button>
            <button
              onClick={() => setDensity('expanded')}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                background: density === 'expanded' ? 'var(--hover-bg)' : 'transparent',
                color: density === 'expanded' ? 'var(--accent)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 500,
              }}
              title="Expanded cinematic view"
            >
              <Maximize size={14} />
              <span>Cinematic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div
          style={{
            margin: '60px auto',
            maxWidth: 420,
            textAlign: 'center',
            padding: '48px 24px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-color)',
            borderRadius: 12,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              backgroundColor: 'var(--accent-subtle)',
              color: 'var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <FolderOpen size={24} />
          </div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            Your DigiFox Library is Empty
          </h3>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginBottom: 20,
            }}
          >
            {filterState.searchQuery || filterState.mediaType !== 'all' || filterState.favoritesOnly
              ? 'No media found matching your active filters.'
              : 'Upload photos, videos, or drone footage to start building your library.'}
          </p>
          <button onClick={onOpenUpload} className="btn-primary">
            <Upload size={15} />
            <span>Upload Media</span>
          </button>
        </div>
      )}

      {/* Date-Grouped Gallery Grid */}
      {Object.entries(groups).map(([dateLabel, groupItems]) => (
        <div key={dateLabel} style={{ marginBottom: 36 }}>
          {/* Section Date Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
              paddingBottom: 6,
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {dateLabel}
            </span>
            <span
              style={{
                fontSize: 12,
                color: 'var(--text-tertiary)',
              }}
            >
              {groupItems.length} {groupItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Grid Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: gridColsClass,
              gap: 16,
            }}
          >
            {groupItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                isSelected={selectedIds.includes(item.id)}
                onSelect={handleToggleSelect}
                onClick={onSelectItem}
                onToggleFavorite={onToggleFavorite}
                density={density}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Sticky Multi-Selection Action Bar */}
      {selectedIds.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 12,
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 60,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              paddingRight: 10,
              borderRight: '1px solid var(--border-color)',
            }}
          >
            {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
          </div>

          <button
            onClick={handleSelectAll}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: 12 }}
            title="Toggle select all"
          >
            <CheckSquare size={14} />
            <span>{selectedIds.length === items.length ? 'Deselect All' : 'Select All'}</span>
          </button>

          <button
            onClick={() => onBatchFavorite(selectedIds)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            <Heart size={14} color="#F87171" />
            <span>Favorite</span>
          </button>

          {/* Add / Move to Album Dropdown */}
          {onAssignMediaToAlbum && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowAlbumAssignMenu(!showAlbumAssignMenu)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: 12 }}
              >
                <FolderPlus size={14} />
                <span>Collection</span>
                <ChevronDown size={13} />
              </button>

              {showAlbumAssignMenu && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 42,
                    left: 0,
                    width: 220,
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    padding: '6px 0',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 70,
                  }}
                >
                  <div
                    style={{
                      padding: '4px 12px',
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Assign to Album
                  </div>
                  {albums.map((alb) => (
                    <button
                      key={alb.id}
                      type="button"
                      onClick={() => {
                        onAssignMediaToAlbum(selectedIds, alb.id);
                        setShowAlbumAssignMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '7px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 12.5,
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Folder size={14} color="var(--accent)" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {alb.title}
                      </span>
                    </button>
                  ))}
                  {filterState.selectedAlbumId && (
                    <>
                      <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                      <button
                        type="button"
                        onClick={() => {
                          onAssignMediaToAlbum(selectedIds, null);
                          setShowAlbumAssignMenu(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '7px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 12.5,
                          color: 'var(--color-error)',
                          textAlign: 'left',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <X size={14} />
                        <span>Remove from Album</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleExportSelected}
            disabled={isExporting}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
            title="Download selected original media to your PC"
          >
            <Download size={14} />
            <span>{isExporting ? (exportStatus || 'Exporting...') : `Export (${selectedIds.length})`}</span>
          </button>

          <button
            onClick={() => {
              onDeleteItems(selectedIds);
              setSelectedIds([]);
            }}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: 12,
              color: 'var(--color-error)',
              borderColor: 'var(--color-error-subtle)',
            }}
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>

          <button
            onClick={handleClearSelection}
            style={{
              padding: 4,
              color: 'var(--text-tertiary)',
              borderRadius: 6,
              marginLeft: 4,
            }}
            title="Deselect all"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
