import React from 'react';

interface DigiFoxLogoProps {
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const DigiFoxLogo: React.FC<DigiFoxLogoProps> = ({
  size = 'md',
  collapsed = false,
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 24,
    md: 30,
    lg: 40,
  };

  const iconDim = iconSizes[size];

  return (
    <div
      className={`digifox-brand ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? 8 : 10,
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      {/* Geometric DigiFox Emblem */}
      <div
        style={{
          width: iconDim,
          height: iconDim,
          borderRadius: size === 'sm' ? 6 : 8,
          background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, var(--bg-card) 100%)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <svg
          width={iconDim * 0.72}
          height={iconDim * 0.72}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Geometric Fox Silhouette */}
          <path
            d="M3 5.5L7.5 14.5H16.5L21 5.5L17.5 17L12 21L6.5 17L3 5.5Z"
            fill="var(--accent)"
          />
          <path
            d="M7.5 14.5L12 18.5L16.5 14.5H7.5Z"
            fill="#FFFFFF"
            fillOpacity="0.85"
          />
          <circle cx="9" cy="11" r="1" fill="var(--bg-main)" />
          <circle cx="15" cy="11" r="1" fill="var(--bg-main)" />
        </svg>
      </div>

      {/* Brand Typography Wordmark */}
      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            <span
              style={{
                fontSize: size === 'sm' ? 14 : size === 'lg' ? 20 : 16,
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              Digi<span style={{ color: 'var(--accent)' }}>Fox</span>
            </span>
            <span
              style={{
                fontSize: size === 'sm' ? 14 : size === 'lg' ? 20 : 16,
                fontWeight: 400,
                color: 'var(--text-secondary)',
                marginLeft: 4,
              }}
            >
              Library
            </span>
          </div>

          {showTagline && (
            <span
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-tertiary)',
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              Media Management
            </span>
          )}
        </div>
      )}
    </div>
  );
};
