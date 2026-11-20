import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  RotateCw,
  ZoomIn,
  ZoomOut,
  MapPin,
  Camera,
  Calendar,
  Download,
  Check,
} from 'lucide-react';
import type { MediaItem } from '../../types/media';
import { downloadSingleMediaItem } from '../../utils/download';

interface MediaLightboxProps {
  item: MediaItem;
  items: MediaItem[];
  onClose: () => void;
  onNavigate: (item: MediaItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  item,
  items,
  onClose,
  onNavigate,
  onToggleFavorite,
}) => {
  const [showInfo, setShowInfo] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    await downloadSingleMediaItem(item);
    setIsDownloading(false);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setZoom(1);
      setRotation(0);
      onNavigate(items[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setZoom(1);
      setRotation(0);
      onNavigate(items[currentIndex + 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'i' || e.key === 'I') setShowInfo((prev) => !prev);
      if (e.key === 'd' || e.key === 'D') handleDownload();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--overlay-bg)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Action Bar */}
      <div
        style={{
          height: 60,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: 6, borderRadius: 6 }}
            title="Close viewer (Esc)"
          >
            <X size={20} color="var(--text-primary)" />
          </button>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--text-tertiary)',
              }}
            >
              {currentIndex + 1} of {items.length} • {item.fileSize}
            </div>
          </div>
        </div>

        {/* Viewer Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            className="btn-ghost"
            title="Zoom in"
          >
            <ZoomIn size={17} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
            className="btn-ghost"
            title="Zoom out"
          >
            <ZoomOut size={17} />
          </button>
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="btn-ghost"
            title="Rotate 90°"
          >
            <RotateCw size={17} />
          </button>

          <div
            style={{
              height: 20,
              width: 1,
              backgroundColor: 'var(--border-color)',
              margin: '0 4px',
            }}
          />

          <button
            onClick={(e) => onToggleFavorite(item.id, e)}
            className="btn-ghost"
            title="Toggle favorite"
            style={{
              color: item.isFavorite ? '#F87171' : 'var(--text-secondary)',
            }}
          >
            <Heart size={18} fill={item.isFavorite ? '#F87171' : 'none'} />
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-ghost"
            title="Download original file (D)"
            style={{
              color: downloadSuccess ? 'var(--color-success)' : 'var(--text-secondary)',
            }}
          >
            {downloadSuccess ? <Check size={18} /> : <Download size={18} />}
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`btn-ghost ${showInfo ? 'active' : ''}`}
            title="Toggle EXIF & metadata (I)"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Navigation Arrow Left */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              zIndex: 20,
              cursor: 'pointer',
            }}
            title="Previous (Arrow Left)"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {hasNext && (
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: showInfo ? 360 : 20,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              zIndex: 20,
              cursor: 'pointer',
              transition: 'right 200ms ease',
            }}
            title="Next (Arrow Right)"
          >
            <ChevronRight size={22} />
          </button>
        )}

        {/* Media Canvas Stage */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            overflow: 'auto',
          }}
        >
          {item.type === 'video' || item.type === 'drone' ? (
            <video
              src={item.url}
              controls
              autoPlay
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 6,
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 200ms cubic-bezier(0.2, 0, 0.2, 1)',
              }}
            />
          ) : (
            <img
              src={item.url}
              alt={item.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 200ms cubic-bezier(0.2, 0, 0.2, 1)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                borderRadius: 6,
                // Media must never be affected by theme color filters
                filter: 'none',
              }}
            />
          )}
        </div>

        {/* Collapsible EXIF & Metadata Inspector Sidebar */}
        {showInfo && (
          <div
            style={{
              width: 340,
              backgroundColor: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border-color)',
              padding: 20,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              zIndex: 15,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                }}
              >
                Capture Information
              </div>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                {item.title}
              </h2>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Calendar size={13} color="var(--accent)" />
                <span>Captured {item.dateTaken}</span>
              </div>
            </div>

            {/* Camera & Lens Details */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Camera size={16} color="var(--accent)" />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.exif.camera}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {item.exif.lens}
              </div>

              {/* Exposure grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 8,
                  paddingTop: 8,
                  borderTop: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>Focal</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.exif.focalLength}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>Aperture</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.exif.aperture}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>Shutter</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.exif.shutter}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>ISO</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.exif.iso}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>Dimensions</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {item.width} × {item.height} px
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>File Size</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {item.fileSize}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>Color Space</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {item.exif.colorSpace || 'sRGB'}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>Format</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.exif.bitDepth || item.type}
                </span>
              </div>
            </div>

            {/* Geolocation Tag */}
            {item.exif.location && (
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  padding: 14,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <MapPin size={16} color="var(--accent)" style={{ marginTop: 2 }} />
                <div>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Location
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      marginTop: 2,
                    }}
                  >
                    {item.exif.location}
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                }}
              >
                Tags & Descriptors
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {item.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      fontSize: 11.5,
                      color: 'var(--text-primary)',
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
