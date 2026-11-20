import React, { useState, useEffect } from 'react';
import { Heart, Play, Check, Maximize2, Drone, Image as ImageIcon } from 'lucide-react';
import type { MediaItem } from '../../types/media';
import { convertHeicToJpegUrl } from '../../utils/heic';

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onClick: (item: MediaItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  density: 'compact' | 'comfortable' | 'expanded';
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  isSelected,
  onSelect,
  onClick,
  onToggleFavorite,
  density,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displaySrc, setDisplaySrc] = useState(item.thumbnail);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    setDisplaySrc(item.thumbnail);
    setHasError(false);

    convertHeicToJpegUrl(item.thumbnail).then((resolved) => {
      if (active && resolved !== item.thumbnail) {
        setDisplaySrc(resolved);
      }
    });

    return () => {
      active = false;
    };
  }, [item.thumbnail]);

  // Height based on density
  const cardHeights = {
    compact: 180,
    comfortable: 240,
    expanded: 340,
  };

  const height = cardHeights[density];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
        boxShadow: isSelected ? '0 0 0 2px var(--accent)' : 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Media Image Area */}
      <div
        onClick={() => onClick(item)}
        style={{
          position: 'relative',
          width: '100%',
          height: height,
          backgroundColor: 'var(--media-placeholder-bg)',
          overflow: 'hidden',
        }}
      >
        {!hasError ? (
          <img
            src={displaySrc}
            alt={item.title}
            loading="lazy"
            onError={() => setHasError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'none',
              transform: isHovered ? 'scale(1.025)' : 'scale(1.0)',
              transition: 'transform 240ms cubic-bezier(0.2, 0, 0.2, 1)',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              color: 'var(--text-tertiary)',
              gap: 8,
              padding: 12,
              textAlign: 'center',
            }}
          >
            <ImageIcon size={28} />
            <span style={{ fontSize: 11, opacity: 0.8 }}>Image Unavailable</span>
          </div>
        )}

        {/* Hover / Selection Overlay gradient for readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              isSelected
                ? 'rgba(82, 109, 255, 0.15)'
                : isHovered
                ? 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.65) 100%)'
                : 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4) 100%)',
            pointerEvents: 'none',
            transition: 'opacity 180ms ease',
          }}
        />

        {/* Top Badges & Selection Checkbox */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          {/* Checkbox button */}
          <button
            onClick={(e) => onSelect(item.id, e)}
            aria-label="Select item"
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              backgroundColor: isSelected
                ? 'var(--accent)'
                : 'rgba(20, 22, 26, 0.75)',
              border: `1.5px solid ${isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.65)'}`,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isHovered || isSelected ? 1 : 0,
              transition: 'opacity 150ms ease, background-color 150ms ease',
              backdropFilter: 'blur(4px)',
            }}
          >
            {isSelected && <Check size={14} strokeWidth={3} />}
          </button>

          {/* Media Format Badge (RAW / Video / 4K / My Upload) */}
          <div style={{ display: 'flex', gap: 5 }}>
            {item.isCustomUpload && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 6px',
                  borderRadius: 4,
                  backgroundColor: 'var(--accent)',
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                YOUR UPLOAD
              </span>
            )}

            {item.type === 'drone' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 7px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(14, 165, 233, 0.9)',
                  backdropFilter: 'blur(6px)',
                  color: '#FFFFFF',
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                <Drone size={11} />
                <span>DRONE</span>
              </span>
            )}

            {item.type === 'video' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 7px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(17, 18, 20, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                <Play size={10} fill="#FFFFFF" />
                {item.videoDuration || 'VIDEO'}
              </span>
            )}

            {item.type === 'raw' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 6px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(17, 18, 20, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#8B9EFF',
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                RAW
              </span>
            )}

            {/* Favorite Star / Heart Button */}
            <button
              onClick={(e) => onToggleFavorite(item.id, e)}
              aria-label="Toggle favorite"
              style={{
                width: 26,
                height: 26,
                borderRadius: 5,
                backgroundColor: 'rgba(20, 22, 26, 0.75)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.isFavorite ? '#F87171' : 'rgba(255, 255, 255, 0.85)',
                opacity: isHovered || item.isFavorite ? 1 : 0,
                transition: 'opacity 150ms ease, transform 120ms ease',
              }}
            >
              <Heart
                size={14}
                fill={item.isFavorite ? '#F87171' : 'none'}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        {/* Bottom Thumbnail Overlay info (visible on hover or comfortable mode) */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 10,
            right: 10,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            color: '#FFFFFF',
            zIndex: 10,
            textShadow: '0 1px 3px rgba(0,0,0,0.7)',
          }}
        >
          <div style={{ maxWidth: '80%', overflow: 'hidden' }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.title}
            </div>
            {density !== 'compact' && (
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.85,
                  marginTop: 2,
                  display: 'flex',
                  gap: 8,
                }}
              >
                <span>{item.exif.camera.split(' ')[0]}</span>
                <span>•</span>
                <span>{item.fileSize}</span>
              </div>
            )}
          </div>

          {/* Quick Zoom Pill Button */}
          {isHovered && (
            <div
              style={{
                padding: '4px 6px',
                borderRadius: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
              }}
            >
              <Maximize2 size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
