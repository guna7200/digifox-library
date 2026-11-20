import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import { DigiFoxLogo } from '../common/DigiFoxLogo';
import { useTheme } from '../../context/ThemeContext';

interface LoginViewProps {
  onUnlock: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onUnlock }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow unlock with any demonstration password or button click
    onUnlock();
  };

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
        padding: 24,
        zIndex: 100,
        transition: 'background-color 180ms ease',
      }}
    >
      {/* Top right theme toggle */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
        }}
      >
        <button
          onClick={toggleTheme}
          className="btn-secondary"
          style={{ width: 40, height: 40, padding: 0, borderRadius: 8 }}
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {resolvedTheme === 'dark' ? (
            <Moon size={18} color="var(--accent)" />
          ) : (
            <Sun size={18} color="var(--accent)" />
          )}
        </button>
      </div>

      {/* Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          padding: 32,
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-block', marginBottom: 20 }}>
          <DigiFoxLogo size="lg" showTagline={true} />
        </div>

        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.015em',
            marginBottom: 6,
          }}
        >
          Unlock DigiFox Vault
        </h2>
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            marginBottom: 24,
            lineHeight: 1.4,
          }}
        >
          Enter your vault credentials to access your personal high-resolution media library.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ textAlign: 'left' }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 6,
              }}
            >
              Master Key / Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="input-field"
              style={{ height: 40 }}
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ height: 40, width: '100%', fontSize: 14, marginTop: 4 }}
          >
            <span>Enter Library</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 11.5,
            color: 'var(--text-tertiary)',
          }}
        >
          <ShieldCheck size={14} color="var(--color-success)" />
          <span>Local Encrypted Storage • DigiFox Security</span>
        </div>
      </div>
    </div>
  );
};
