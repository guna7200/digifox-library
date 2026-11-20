import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import type { Album } from '../../types/media';

interface NewAlbumModalProps {
  onClose: () => void;
  onCreateAlbum: (album: Album) => void;
}

export const NewAlbumModal: React.FC<NewAlbumModalProps> = ({
  onClose,
  onCreateAlbum,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      coverUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      itemCount: 0,
      dateCreated: new Date().toISOString().split('T')[0],
    };

    onCreateAlbum(newAlbum);
    onClose();
  };

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
      <form
        onSubmit={handleCreate}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: 56,
            padding: '0 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderPlus size={18} color="var(--accent)" />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              New Collection Album
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: 6 }}
          >
            <X size={18} color="var(--text-secondary)" />
          </button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}
            >
              Album Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kyoto Golden Hour 2026"
              className="input-field"
              autoFocus
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}
            >
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief notes about this shoot or expedition..."
              className="input-field"
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        <div
          style={{
            height: 56,
            padding: '0 20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={!title.trim()}>
            Create Album
          </button>
        </div>
      </form>
    </div>
  );
};
