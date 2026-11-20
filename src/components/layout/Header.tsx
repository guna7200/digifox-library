import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  UploadCloud,
  ArrowUpDown,
  Filter,
  Sun,
  Moon,
  Bell,
  Check,
  HardDrive,
  Settings,
  ShieldCheck,
  X,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { FilterState, SortField } from '../../types/media';

interface HeaderProps {
  filterState: FilterState;
  onFilterChange: (update: Partial<FilterState>) => void;
  onOpenUpload: () => void;
  onOpenSettings: (tab?: 'appearance' | 'general' | 'storage' | 'account') => void;
  onOpenAuthModal: () => void;
  totalMediaCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  filterState,
  onFilterChange,
  onOpenUpload,
  onOpenSettings,
  onOpenAuthModal,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  // Dropdown states
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Search input ref for keyboard shortcut
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sort labels
  const sortOptions: { field: SortField; label: string }[] = [
    { field: 'dateAdded', label: 'Date Added' },
    { field: 'dateTaken', label: 'Date Captured' },
    { field: 'fileSize', label: 'File Size' },
    { field: 'title', label: 'File Name' },
    { field: 'rating', label: 'Rating' },
  ];

  return (
    <header
      style={{
        height: 64,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        gap: 16,
      }}
    >
      {/* Global Search Bar */}
      <div
        style={{
          position: 'relative',
          flex: '1 1 360px',
          maxWidth: 460,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            color: 'var(--text-tertiary)',
            pointerEvents: 'none',
          }}
        />
        <input
          ref={searchInputRef}
          type="text"
          value={filterState.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          placeholder="Search by filename, tag, camera, or city... (/)"
          style={{
            width: '100%',
            height: 38,
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            padding: '0 36px 0 36px',
            fontSize: 13.5,
            color: 'var(--text-primary)',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
          }}
        />
        {filterState.searchQuery ? (
          <button
            onClick={() => onFilterChange({ searchQuery: '' })}
            style={{
              position: 'absolute',
              right: 10,
              padding: 4,
              color: 'var(--text-tertiary)',
              borderRadius: 4,
            }}
            title="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <span
            style={{
              position: 'absolute',
              right: 12,
              padding: '2px 6px',
              fontSize: 11,
              fontFamily: 'monospace',
              borderRadius: 4,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-tertiary)',
              pointerEvents: 'none',
            }}
          >
            /
          </span>
        )}
      </div>

      {/* Action Controls & Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="btn-primary"
          title="Upload new photos or videos"
        >
          <UploadCloud size={16} />
          <span>Upload</span>
        </button>

        {/* Sort Options Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowFilterMenu(false);
              setShowNotifMenu(false);
              setShowProfileMenu(false);
            }}
            className="btn-secondary"
            style={{ height: 38 }}
            title="Sort media"
          >
            <ArrowUpDown size={15} color="var(--text-secondary)" />
            <span style={{ fontSize: 13 }}>Sort</span>
            <ChevronDown size={14} color="var(--text-tertiary)" />
          </button>

          {showSortMenu && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 200,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '6px 0',
                boxShadow: 'var(--shadow-md)',
                zIndex: 50,
              }}
            >
              <div
                style={{
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.05em',
                }}
              >
                Sort By
              </div>
              {sortOptions.map((opt) => (
                <button
                  key={opt.field}
                  onClick={() => {
                    if (filterState.sortField === opt.field) {
                      onFilterChange({
                        sortDirection: filterState.sortDirection === 'asc' ? 'desc' : 'asc',
                      });
                    } else {
                      onFilterChange({ sortField: opt.field, sortDirection: 'desc' });
                    }
                    setShowSortMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color:
                      filterState.sortField === opt.field
                        ? 'var(--accent)'
                        : 'var(--text-primary)',
                    background:
                      filterState.sortField === opt.field
                        ? 'var(--selected-bg)'
                        : 'transparent',
                    textAlign: 'left',
                  }}
                >
                  <span>{opt.label}</span>
                  {filterState.sortField === opt.field && (
                    <span style={{ fontSize: 11, fontWeight: 600 }}>
                      {filterState.sortDirection === 'desc' ? '↓ Desc' : '↑ Asc'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowSortMenu(false);
              setShowNotifMenu(false);
              setShowProfileMenu(false);
            }}
            className="btn-secondary"
            style={{
              height: 38,
              borderColor:
                filterState.mediaType !== 'all' || filterState.favoritesOnly
                  ? 'var(--accent)'
                  : 'var(--border-color)',
            }}
            title="Filter by media type or favorites"
          >
            <Filter
              size={15}
              color={
                filterState.mediaType !== 'all' || filterState.favoritesOnly
                  ? 'var(--accent)'
                  : 'var(--text-secondary)'
              }
            />
            <span style={{ fontSize: 13 }}>Filter</span>
            {(filterState.mediaType !== 'all' || filterState.favoritesOnly) && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                }}
              />
            )}
          </button>

          {showFilterMenu && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 220,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '8px 0',
                boxShadow: 'var(--shadow-md)',
                zIndex: 50,
              }}
            >
              <div
                style={{
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.05em',
                }}
              >
                Media Format
              </div>
              {(['all', 'photo', 'video', 'raw'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    onFilterChange({ mediaType: type });
                    setShowFilterMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color:
                      filterState.mediaType === type
                        ? 'var(--accent)'
                        : 'var(--text-primary)',
                    background:
                      filterState.mediaType === type
                        ? 'var(--selected-bg)'
                        : 'transparent',
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>
                    {type === 'all'
                      ? 'All Formats'
                      : type === 'photo'
                      ? 'Photos'
                      : type === 'video'
                      ? 'Videos (4K & HD)'
                      : 'RAW Files'}
                  </span>
                  {filterState.mediaType === type && <Check size={14} />}
                </button>
              ))}

              <div
                style={{
                  margin: '6px 0',
                  borderTop: '1px solid var(--border-color)',
                }}
              />

              <button
                onClick={() => {
                  onFilterChange({ favoritesOnly: !filterState.favoritesOnly });
                  setShowFilterMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: filterState.favoritesOnly
                    ? 'var(--accent)'
                    : 'var(--text-primary)',
                  background: filterState.favoritesOnly
                    ? 'var(--selected-bg)'
                    : 'transparent',
                }}
              >
                <span>Starred Favorites Only</span>
                {filterState.favoritesOnly && <Check size={14} />}
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle Button — Exact Moon/Sun Requirement */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          title={`Currently ${
            resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'
          } (Click to toggle)`}
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 180ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
            e.currentTarget.style.borderColor = 'var(--border-focus)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          {resolvedTheme === 'dark' ? (
            <Moon
              size={18}
              color="var(--accent)"
              style={{ transition: 'transform 200ms ease' }}
            />
          ) : (
            <Sun
              size={18}
              color="var(--accent)"
              style={{ transition: 'transform 200ms ease' }}
            />
          )}
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowSortMenu(false);
              setShowFilterMenu(false);
              setShowProfileMenu(false);
            }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            title="Notifications"
          >
            <Bell size={17} />
            <span
              style={{
                position: 'absolute',
                top: 8,
                right: 9,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--accent)',
              }}
            />
          </button>

          {showNotifMenu && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 320,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: '12px 0',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 50,
              }}
            >
              <div
                style={{
                  padding: '0 16px 8px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  Activity & Sync
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <ShieldCheck size={13} /> Library Synced
                </span>
              </div>
              <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                    }}
                  >
                    RAW ingest completed
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    Hasselblad 16-bit captures indexed with lossless color profiles.
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: 'var(--text-tertiary)',
                      marginTop: 2,
                    }}
                  >
                    12 minutes ago
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Cloud Backup Optimal
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    48.2 GB encrypted storage verified.
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: 'var(--text-tertiary)',
                      marginTop: 2,
                    }}
                  >
                    2 hours ago
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Storage Indicator */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowSortMenu(false);
              setShowFilterMenu(false);
              setShowNotifMenu(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 8px 4px 4px',
              borderRadius: 24,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              cursor: 'pointer',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent) 0%, #3B82F6 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              AR
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              Alex
            </span>
            <ChevronDown size={13} color="var(--text-tertiary)" />
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 240,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: '12px 0',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 50,
              }}
            >
              <div style={{ padding: '0 16px 12px 16px' }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  Alex Reed
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                  curator@digifox.library
                </div>

                {/* Storage gauge */}
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      marginBottom: 4,
                    }}
                  >
                    <span>Vault Storage</span>
                    <span style={{ fontWeight: 600 }}>48.2 / 256 GB</span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      width: '100%',
                      background: 'var(--border-subtle)',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: '18.8%',
                        background: 'var(--accent)',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  padding: '6px 0',
                }}
              >
                <button
                  onClick={() => {
                    onOpenSettings('appearance');
                    setShowProfileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                  }}
                >
                  <SlidersHorizontal size={14} color="var(--accent)" />
                  <span>Appearance & Theme</span>
                </button>
                <button
                  onClick={() => {
                    onOpenSettings('storage');
                    setShowProfileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                  }}
                >
                  <HardDrive size={14} color="var(--text-secondary)" />
                  <span>Storage & Backup</span>
                </button>
                <button
                  onClick={() => {
                    onOpenSettings('general');
                    setShowProfileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                  }}
                >
                  <Settings size={14} color="var(--text-secondary)" />
                  <span>Library Preferences</span>
                </button>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  padding: '6px 0 0 0',
                }}
              >
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setShowProfileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    textAlign: 'left',
                  }}
                >
                  <span>Lock DigiFox Vault</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
