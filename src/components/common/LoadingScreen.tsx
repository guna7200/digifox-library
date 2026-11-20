import React from 'react';
import { DigiFoxLogo } from './DigiFoxLogo';

export const LoadingScreen: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-main)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        zIndex: 200,
      }}
    >
      <div style={{ transform: 'scale(1.1)' }}>
        <DigiFoxLogo size="lg" showTagline={false} />
      </div>

      <div
        style={{
          width: 140,
          height: 3,
          backgroundColor: 'var(--border-color)',
          borderRadius: 2,
          overflow: 'hidden',
          marginTop: 8,
        }}
      >
        <div
          style={{
            width: '45%',
            height: '100%',
            backgroundColor: 'var(--accent)',
            borderRadius: 2,
            animation: 'digifoxPulse 1.2s infinite ease-in-out',
          }}
        />
      </div>

      <span
        style={{
          fontSize: 12,
          color: 'var(--text-tertiary)',
          letterSpacing: '0.04em',
        }}
      >
        Initializing DigiFox Library...
      </span>

      <style>{`
        @keyframes digifoxPulse {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};
