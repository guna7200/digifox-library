import React, { useState } from 'react';
import {
  Image,
  Film,
  Drone,
  Heart,
  Folder,
  Plus,
  HardDrive,
  Settings,
  ChevronRight,
  ChevronDown,
  Layers,
  Trash2,
  Edit3,
} from 'lucide-react';
import { DigiFoxLogo } from '../common/DigiFoxLogo';
import type { Album, FilterState } from '../../types/media';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  albums: Album[];
  filterState: FilterState;
  onFilterChange: (update: Partial<FilterState>) => void;
  onOpenSettings: (tab?: 'appearance' | 'general' | 'storage' | 'account') => void;
  onOpenNewAlbumModal: () => void;
  onEditAlbum?: (album: Album) => void;
  onDeleteAlbum?: (albumId: string) => void;
  mediaCounts: {
    all: number;
    photos: number;
    videos: number;
    drone: number;
    favorites: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  albums,
  filterState,
  onFilterChange,
  onOpenSettings,
  onOpenNewAlbumModal,
  onEditAlbum,
  onDeleteAlbum,
  mediaCounts,
}) => {
  const { resolvedTheme, themeMode } = useTheme();
  const [albumsExpanded, setAlbumsExpanded] = useState(true);
  const [hoveredAlbumId, setHoveredAlbumId] = useState<string | null>(null);

  const isNavActive = (
    mediaType: 'all' | 'photo' | 'video' | 'drone' | 'raw',
    favoritesOnly: boolean,
    albumId: string | null
  ) => {
    return (
      filterState.mediaType === mediaType &&
      filterState.favoritesOnly === favoritesOnly &&
      filterState.selectedAlbumId === albumId
    );
  };

  return (
    <aside
      style={{
        width: 250,
        minWidth: 250,
        height: '100vh',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        userSelect: 'none',
        zIndex: 30,
      }}
    >
      {/* Sidebar Header / DigiFox Brand */}
      <div
        style={{
          height: 64,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <DigiFoxLogo size="md" showTagline={false} />
      </div>

      {/* Navigation Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Main Library Views */}
        <div>
          <div
            style={{
              padding: '0 8px 6px 8px',
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              letterSpacing: '0.06em',
            }}
          >
            Library
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* All Media */}
            <button
              onClick={() =>
                onFilterChange({
                  mediaType: 'all',
                  favoritesOnly: false,
                  selectedAlbumId: null,
                })
              }
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: isNavActive('all', false, null) ? 600 : 400,
                color: isNavActive('all', false, null)
                  ? 'var(--accent)'
                  : 'var(--text-primary)',
                backgroundColor: isNavActive('all', false, null)
                  ? 'var(--selected-bg)'
                  : 'transparent',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Layers size={16} />
                <span>All Media</span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: isNavActive('all', false, null)
                    ? 'var(--accent)'
                    : 'var(--text-tertiary)',
                }}
              >
                {mediaCounts.all}
              </span>
            </button>

            {/* Photos */}
            <button
              onClick={() =>
                onFilterChange({
                  mediaType: 'photo',
                  favoritesOnly: false,
                  selectedAlbumId: null,
                })
              }
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: isNavActive('photo', false, null) ? 600 : 400,
                color: isNavActive('photo', false, null)
                  ? 'var(--accent)'
                  : 'var(--text-primary)',
                backgroundColor: isNavActive('photo', false, null)
                  ? 'var(--selected-bg)'
                  : 'transparent',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Image size={16} />
                <span>Photos</span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: isNavActive('photo', false, null)
                    ? 'var(--accent)'
                    : 'var(--text-tertiary)',
                }}
              >
                {mediaCounts.photos}
              </span>
            </button>

            {/* Videos */}
            <button
              onClick={() =>
                onFilterChange({
                  mediaType: 'video',
                  favoritesOnly: false,
                  selectedAlbumId: null,
                })
              }
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: isNavActive('video', false, null) ? 600 : 400,
                color: isNavActive('video', false, null)
                  ? 'var(--accent)'
                  : 'var(--text-primary)',
                backgroundColor: isNavActive('video', false, null)
                  ? 'var(--selected-bg)'
                  : 'transparent',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Film size={16} />
                <span>Videos</span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: isNavActive('video', false, null)
                    ? 'var(--accent)'
                    : 'var(--text-tertiary)',
                }}
              >
                {mediaCounts.videos}
              </span>
            </button>

            {/* Drone Videos (.insv) */}
            <button
              onClick={() =>
                onFilterChange({
                  mediaType: 'drone',
                  favoritesOnly: false,
                  selectedAlbumId: null,
                })
              }
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: isNavActive('drone', false, null) ? 600 : 400,
                color: isNavActive('drone', false, null)
                  ? 'var(--accent)'
                  : 'var(--text-primary)',
                backgroundColor: isNavActive('drone', false, null)
                  ? 'var(--selected-bg)'
                  : 'transparent',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Drone size={16} />
                <span>Drone Videos</span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: isNavActive('drone', false, null)
                    ? 'var(--accent)'
                    : 'var(--text-tertiary)',
                }}
              >
                {mediaCounts.drone}
              </span>
            </button>

            {/* Favorites */}
            <button
              onClick={() =>
                onFilterChange({
                  mediaType: 'all',
                  favoritesOnly: true,
                  selectedAlbumId: null,
                })
              }
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: filterState.favoritesOnly ? 600 : 400,
                color: filterState.favoritesOnly
                  ? '#F87171'
                  : 'var(--text-primary)',
                backgroundColor: filterState.favoritesOnly
                  ? 'rgba(248, 113, 113, 0.12)'
                  : 'transparent',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Heart
                  size={16}
                  fill={filterState.favoritesOnly ? '#F87171' : 'none'}
                />
                <span>Starred Favorites</span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: filterState.favoritesOnly
                    ? '#F87171'
                    : 'var(--text-tertiary)',
                }}
              >
                {mediaCounts.favorites}
              </span>
            </button>
          </div>
        </div>

        {/* Albums Collection */}
        <div>
          <div
            style={{
              padding: '0 8px 6px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={() => setAlbumsExpanded(!albumsExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                letterSpacing: '0.06em',
              }}
            >
              {albumsExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              <span>Collections & Albums</span>
            </button>
            <button
              onClick={onOpenNewAlbumModal}
              title="Create new album"
              style={{
                color: 'var(--text-secondary)',
                padding: '2px 4px',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Plus size={14} />
            </button>
          </div>

          {albumsExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {albums.length === 0 ? (
                <button
                  type="button"
                  onClick={onOpenNewAlbumModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 7,
                    fontSize: 12.5,
                    color: 'var(--accent)',
                    border: '1px dashed var(--border-color)',
                    background: 'transparent',
                    cursor: 'pointer',
                    width: '100%',
                    justifyContent: 'center',
                    margin: '4px 0',
                    fontWeight: 500,
                  }}
                  title="Create your first collection"
                >
                  <Plus size={13} color="var(--accent)" />
                  <span>Create Collection</span>
                </button>
              ) : (
                albums.map((album) => {
                const isActive = filterState.selectedAlbumId === album.id;
                const isHovered = hoveredAlbumId === album.id;

                return (
                  <div
                    key={album.id}
                    onMouseEnter={() => setHoveredAlbumId(album.id)}
                    onMouseLeave={() => setHoveredAlbumId(null)}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 7,
                      backgroundColor: isActive ? 'var(--selected-bg)' : isHovered ? 'var(--hover-bg)' : 'transparent',
                    }}
                  >
                    <button
                      onClick={() =>
                        onFilterChange({
                          selectedAlbumId: album.id,
                          favoritesOnly: false,
                          mediaType: 'all',
                        })
                      }
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        borderRadius: 7,
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                        textAlign: 'left',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          overflow: 'hidden',
                          flex: 1,
                        }}
                      >
                        <Folder size={15} color={isActive ? 'var(--accent)' : 'var(--text-secondary)'} style={{ flexShrink: 0 }} />
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}
                        >
                          {album.title}
                        </span>
                      </div>
                      {!isHovered && (
                        <span
                          style={{
                            fontSize: 11,
                            color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                            marginLeft: 6,
                          }}
                        >
                          {album.itemCount}
                        </span>
                      )}
                    </button>

                    {/* Quick hover actions: Edit & Delete Album */}
                    {isHovered && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          paddingRight: 6,
                        }}
                      >
                        {onEditAlbum && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditAlbum(album);
                            }}
                            title="Rename / Edit Collection"
                            style={{
                              padding: 3,
                              color: 'var(--text-secondary)',
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Edit3 size={13} />
                          </button>
                        )}
                        {onDeleteAlbum && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteAlbum(album.id);
                            }}
                            title="Delete Collection"
                            style={{
                              padding: 3,
                              color: 'var(--color-error)',
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer — Storage & Appearance Settings */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: 'var(--bg-surface-elevated)',
        }}
      >
        {/* Storage status bar */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 11.5,
              color: 'var(--text-secondary)',
              marginBottom: 6,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <HardDrive size={13} color="var(--accent)" />
              <span>Storage Used</span>
            </span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              48.2 / 256 GB
            </span>
          </div>
          <div
            style={{
              height: 5,
              width: '100%',
              backgroundColor: 'var(--border-color)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: '18.8%',
                backgroundColor: 'var(--accent)',
                borderRadius: 3,
              }}
            />
          </div>
        </div>

        {/* Quick Settings Action & Current Theme Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 4,
          }}
        >
          <button
            onClick={() => onOpenSettings('appearance')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12.5,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            title="Open DigiFox Settings & Theme"
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>

          {/* Theme badge */}
          <span
            onClick={() => onOpenSettings('appearance')}
            style={{
              fontSize: 10.5,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '2px 7px',
              borderRadius: 12,
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {themeMode === 'system'
              ? `System (${resolvedTheme})`
              : `${resolvedTheme} Mode`}
          </span>
        </div>
      </div>
    </aside>
  );
};
