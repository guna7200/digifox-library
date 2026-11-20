import React, { useState } from 'react';
import {
  X,
  Sun,
  Moon,
  Laptop,
  Palette,
  Sliders,
  HardDrive,
  User,
  Shield,
  Eye,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { DigiFoxLogo } from '../common/DigiFoxLogo';

interface SettingsModalProps {
  initialTab?: 'appearance' | 'general' | 'storage' | 'account';
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  initialTab = 'appearance',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'general' | 'storage' | 'account'>(
    initialTab
  );
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  // Local settings states
  const [libraryName, setLibraryName] = useState('DigiFox Main Vault');
  const [autoExifTagging, setAutoExifTagging] = useState(true);
  const [preserveRawNegatives, setPreserveRawNegatives] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--overlay-bg)',
        backdropFilter: 'blur(8px)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 820,
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            height: 60,
            padding: '0 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DigiFoxLogo size="sm" />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              Settings
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: 6, borderRadius: 6 }}
            title="Close"
          >
            <X size={18} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Modal Body with Sidebar Tabs */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Tabs Navigation */}
          <div
            style={{
              width: 200,
              borderRight: '1px solid var(--border-color)',
              padding: '16px 12px',
              backgroundColor: 'var(--bg-sidebar)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <button
              onClick={() => setActiveTab('appearance')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: activeTab === 'appearance' ? 600 : 400,
                color:
                  activeTab === 'appearance'
                    ? 'var(--accent)'
                    : 'var(--text-primary)',
                backgroundColor:
                  activeTab === 'appearance'
                    ? 'var(--selected-bg)'
                    : 'transparent',
                textAlign: 'left',
              }}
            >
              <Palette size={16} />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => setActiveTab('general')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: activeTab === 'general' ? 600 : 400,
                color:
                  activeTab === 'general'
                    ? 'var(--accent)'
                    : 'var(--text-primary)',
                backgroundColor:
                  activeTab === 'general'
                    ? 'var(--selected-bg)'
                    : 'transparent',
                textAlign: 'left',
              }}
            >
              <Sliders size={16} />
              <span>General</span>
            </button>

            <button
              onClick={() => setActiveTab('storage')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: activeTab === 'storage' ? 600 : 400,
                color:
                  activeTab === 'storage'
                    ? 'var(--accent)'
                    : 'var(--text-primary)',
                backgroundColor:
                  activeTab === 'storage'
                    ? 'var(--selected-bg)'
                    : 'transparent',
                textAlign: 'left',
              }}
            >
              <HardDrive size={16} />
              <span>Storage & Backup</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: activeTab === 'account' ? 600 : 400,
                color:
                  activeTab === 'account'
                    ? 'var(--accent)'
                    : 'var(--text-primary)',
                backgroundColor:
                  activeTab === 'account'
                    ? 'var(--selected-bg)'
                    : 'transparent',
                textAlign: 'left',
              }}
            >
              <User size={16} />
              <span>Account</span>
            </button>
          </div>

          {/* Tab Content Area */}
          <div
            style={{
              flex: 1,
              padding: '24px 32px',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-main)',
            }}
          >
            {/* ==================================================== */}
            {/* APPEARANCE TAB — SPECIFICATION REQUIREMENTS          */}
            {/* ==================================================== */}
            {activeTab === 'appearance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 4,
                    }}
                  >
                    Theme Mode
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Select your preferred interface theme. Changes apply instantly across all
                    screens and are saved to local storage.
                  </p>
                </div>

                {/* Theme Mode Selector Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 14,
                  }}
                >
                  {/* Light Mode Option */}
                  <div
                    onClick={() => setThemeMode('light')}
                    style={{
                      border: `2px solid ${
                        themeMode === 'light'
                          ? 'var(--accent)'
                          : 'var(--border-color)'
                      }`,
                      borderRadius: 10,
                      padding: 16,
                      cursor: 'pointer',
                      backgroundColor: 'var(--bg-card)',
                      transition: 'all 150ms ease',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        height: 60,
                        backgroundColor: '#F6F7F9',
                        border: '1px solid #E5E7EB',
                        borderRadius: 6,
                        marginBottom: 12,
                        padding: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: '#526DFF',
                          }}
                        />
                        <div
                          style={{
                            width: 40,
                            height: 6,
                            backgroundColor: '#191A1C',
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          height: 20,
                          backgroundColor: '#FFFFFF',
                          borderRadius: 4,
                          border: '1px solid #E5E7EB',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sun size={16} color="#526DFF" />
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                          }}
                        >
                          Light
                        </span>
                      </div>
                      {themeMode === 'light' && (
                        <CheckCircle2 size={16} color="var(--accent)" />
                      )}
                    </div>
                  </div>

                  {/* Dark Mode Option */}
                  <div
                    onClick={() => setThemeMode('dark')}
                    style={{
                      border: `2px solid ${
                        themeMode === 'dark'
                          ? 'var(--accent)'
                          : 'var(--border-color)'
                      }`,
                      borderRadius: 10,
                      padding: 16,
                      cursor: 'pointer',
                      backgroundColor: 'var(--bg-card)',
                      transition: 'all 150ms ease',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        height: 60,
                        backgroundColor: '#111214',
                        border: '1px solid #2A2C31',
                        borderRadius: 6,
                        marginBottom: 12,
                        padding: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: '#8B9EFF',
                          }}
                        />
                        <div
                          style={{
                            width: 40,
                            height: 6,
                            backgroundColor: '#F5F5F5',
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          height: 20,
                          backgroundColor: '#202124',
                          borderRadius: 4,
                          border: '1px solid #2A2C31',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Moon size={16} color="#8B9EFF" />
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                          }}
                        >
                          Dark
                        </span>
                      </div>
                      {themeMode === 'dark' && (
                        <CheckCircle2 size={16} color="var(--accent)" />
                      )}
                    </div>
                  </div>

                  {/* System Default Option */}
                  <div
                    onClick={() => setThemeMode('system')}
                    style={{
                      border: `2px solid ${
                        themeMode === 'system'
                          ? 'var(--accent)'
                          : 'var(--border-color)'
                      }`,
                      borderRadius: 10,
                      padding: 16,
                      cursor: 'pointer',
                      backgroundColor: 'var(--bg-card)',
                      transition: 'all 150ms ease',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        height: 60,
                        background:
                          'linear-gradient(90deg, #111214 50%, #F6F7F9 50%)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 6,
                        marginBottom: 12,
                        padding: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Laptop size={22} color="var(--text-secondary)" />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Laptop size={16} color="var(--accent)" />
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                          }}
                        >
                          System
                        </span>
                      </div>
                      {themeMode === 'system' && (
                        <CheckCircle2 size={16} color="var(--accent)" />
                      )}
                    </div>
                  </div>
                </div>

                {/* LIVE THEME PREVIEW SECTION */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 10,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Eye size={15} color="var(--accent)" />
                        <span>Live Theme Preview & Tokens</span>
                      </h4>
                      <p
                        style={{
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                          marginTop: 2,
                        }}
                      >
                        Currently rendering active token hierarchy ({resolvedTheme.toUpperCase()} mode).
                      </p>
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        padding: '3px 8px',
                        borderRadius: 12,
                        backgroundColor: 'var(--accent-subtle)',
                        color: 'var(--accent)',
                        fontWeight: 600,
                      }}
                    >
                      Active: {resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>

                  {/* Interactive Mini Mockup */}
                  <div
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      overflow: 'hidden',
                      backgroundColor: 'var(--bg-main)',
                      display: 'flex',
                      height: 140,
                    }}
                  >
                    {/* Mini Sidebar */}
                    <div
                      style={{
                        width: 80,
                        backgroundColor: 'var(--bg-sidebar)',
                        borderRight: '1px solid var(--border-color)',
                        padding: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 14,
                          borderRadius: 3,
                          backgroundColor: 'var(--accent)',
                        }}
                      />
                      <div
                        style={{
                          height: 8,
                          width: '100%',
                          backgroundColor: 'var(--selected-bg)',
                          borderRadius: 3,
                        }}
                      />
                      <div
                        style={{
                          height: 8,
                          width: '70%',
                          backgroundColor: 'var(--hover-bg)',
                          borderRadius: 3,
                        }}
                      />
                    </div>

                    {/* Mini Main Stage */}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Mini Header */}
                      <div
                        style={{
                          height: 28,
                          backgroundColor: 'var(--bg-surface)',
                          borderBottom: '1px solid var(--border-color)',
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            width: 60,
                            height: 10,
                            backgroundColor: 'var(--bg-main)',
                            borderRadius: 3,
                            border: '1px solid var(--border-color)',
                          }}
                        />
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent)',
                          }}
                        />
                      </div>

                      {/* Mini Cards */}
                      <div
                        style={{
                          flex: 1,
                          padding: 10,
                          display: 'flex',
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 6,
                            padding: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div
                            style={{
                              height: 35,
                              backgroundColor: 'var(--hover-bg)',
                              borderRadius: 4,
                            }}
                          />
                          <div
                            style={{
                              height: 6,
                              width: '60%',
                              backgroundColor: 'var(--text-secondary)',
                              borderRadius: 2,
                            }}
                          />
                        </div>

                        <div
                          style={{
                            flex: 1,
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 6,
                            padding: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div
                            style={{
                              height: 35,
                              backgroundColor: 'var(--hover-bg)',
                              borderRadius: 4,
                            }}
                          />
                          <div
                            style={{
                              height: 6,
                              width: '80%',
                              backgroundColor: 'var(--text-secondary)',
                              borderRadius: 2,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Color Swatch Tokens */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 8,
                      marginTop: 16,
                      fontSize: 11,
                    }}
                  >
                    <div
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 3,
                          backgroundColor: 'var(--bg-main)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                      <span>Main BG: {resolvedTheme === 'dark' ? '#111214' : '#F6F7F9'}</span>
                    </div>

                    <div
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        backgroundColor: 'var(--bg-sidebar)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 3,
                          backgroundColor: 'var(--bg-sidebar)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                      <span>Sidebar: {resolvedTheme === 'dark' ? '#18191C' : '#FFFFFF'}</span>
                    </div>

                    <div
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 3,
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                      <span>Card: {resolvedTheme === 'dark' ? '#202124' : '#FFFFFF'}</span>
                    </div>

                    <div
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        backgroundColor: 'var(--accent-subtle)',
                        border: '1px solid var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 3,
                          backgroundColor: 'var(--accent)',
                        }}
                      />
                      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                        Accent: {resolvedTheme === 'dark' ? '#8B9EFF' : '#526DFF'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* GENERAL TAB                                          */}
            {/* ==================================================== */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 4,
                    }}
                  >
                    Library Configuration
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Manage DigiFox Library core indexing and metadata settings.
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      marginBottom: 6,
                    }}
                  >
                    Library Vault Name
                  </label>
                  <input
                    type="text"
                    value={libraryName}
                    onChange={(e) => setLibraryName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                        }}
                      >
                        Automated EXIF Extraction
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        Read shutter speed, aperture, camera model, and GPS coordinates upon ingest.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoExifTagging}
                      onChange={(e) => setAutoExifTagging(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                        }}
                      >
                        Preserve Original RAW Negatives
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        Maintain lossless bitstreams alongside compressed preview proxies.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preserveRawNegatives}
                      onChange={(e) => setPreserveRawNegatives(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* STORAGE TAB                                          */}
            {/* ==================================================== */}
            {activeTab === 'storage' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 4,
                    }}
                  >
                    Vault Storage Allocation
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Detailed analysis of your personal DigiFox storage volume.
                  </p>
                </div>

                {/* Storage breakdown bar */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      48.2 GB of 256 GB Used (18.8%)
                    </span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>
                      Healthy
                    </span>
                  </div>

                  <div
                    style={{
                      height: 10,
                      width: '100%',
                      backgroundColor: 'var(--border-subtle)',
                      borderRadius: 5,
                      overflow: 'hidden',
                      display: 'flex',
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ width: '11%', backgroundColor: '#526DFF' }} title="Photos" />
                    <div style={{ width: '6%', backgroundColor: '#34D399' }} title="Videos" />
                    <div style={{ width: '1.8%', backgroundColor: '#FBBF24' }} title="RAW Captures" />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 20,
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#526DFF',
                        }}
                      />
                      <span>Photos (28.4 GB)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#34D399',
                        }}
                      />
                      <span>Videos (15.2 GB)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#FBBF24',
                        }}
                      />
                      <span>RAW (4.6 GB)</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Clear Thumbnail Cache
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Rebuilds hardware-accelerated preview thumbnails.
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCacheCleared(true);
                      setTimeout(() => setCacheCleared(false), 2000);
                    }}
                    className="btn-secondary"
                  >
                    <RefreshCw size={14} />
                    <span>{cacheCleared ? 'Cache Rebuilt' : 'Purge Cache'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* ACCOUNT TAB                                          */}
            {/* ==================================================== */}
            {activeTab === 'account' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 4,
                    }}
                  >
                    DigiFox Curator Profile
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Personal authentication and local vault security.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    padding: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent) 0%, #3B82F6 100%)',
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    AR
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Alex Reed
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      Personal Library Administrator • Single-User Vault Mode
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Shield size={20} color="var(--color-success)" />
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      End-to-End Vault Encryption Active
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Local AES-256 metadata encryption enabled on DigiFox storage root.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            height: 56,
            padding: '0 24px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <button onClick={onClose} className="btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
