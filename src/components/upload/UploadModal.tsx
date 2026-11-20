import React, { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import heic2any from 'heic2any';
import { saveMediaToCloud } from '../../utils/api';
import {
  X,
  UploadCloud,
  Trash2,
  HardDrive,
  AlertCircle,
  FolderPlus,
  Check,
  Drone,
} from 'lucide-react';
import type { Album, MediaItem, MediaType } from '../../types/media';

interface UploadModalProps {
  albums: Album[];
  onClose: () => void;
  onUploadComplete: (newItems: MediaItem[]) => void;
  onCreateAlbum?: (album: Album) => void;
}

interface StagedItem {
  id: string;
  file: File;
  title: string;
  type: MediaType;
  previewUrl: string;
  streamUrl: string;
  width: number;
  height: number;
  fileSize: string;
  fileSizeBytes: number;
  videoDuration?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  albums,
  onClose,
  onUploadComplete,
  onCreateAlbum,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string>(albums[0]?.id || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stagedFiles, setStagedFiles] = useState<StagedItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUploadingRef = useRef<boolean>(false);

  // New Collection / Album creation state
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [albumSuccessMsg, setAlbumSuccessMsg] = useState<string | null>(null);

  const handleCreateNewAlbum = () => {
    const trimmedTitle = newAlbumTitle.trim();
    if (!trimmedTitle) return;

    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: trimmedTitle,
      description: newAlbumDesc.trim(),
      coverUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      itemCount: 0,
      dateCreated: new Date().toISOString().split('T')[0],
    };

    if (onCreateAlbum) {
      onCreateAlbum(newAlbum);
    }
    setSelectedAlbum(newAlbum.id);
    setIsCreatingAlbum(false);
    setNewAlbumTitle('');
    setNewAlbumDesc('');
    setAlbumSuccessMsg(`Collection "${trimmedTitle}" created & selected`);
    setTimeout(() => setAlbumSuccessMsg(null), 3500);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return (bytes / 1024).toFixed(0) + ' KB';
  };

  // Process drone video file (.insv / aerial 360)
  const processDroneVideoFile = (file: File): Promise<StagedItem> => {
    return new Promise((resolve) => {
      // Create blob with video/mp4 MIME type so HTML5 video tag can try reading metadata/poster
      const videoBlob = file.type ? file : new Blob([file], { type: 'video/mp4' });
      const url = URL.createObjectURL(videoBlob);
      const video = document.createElement('video');
      video.src = url;
      video.muted = true;
      video.crossOrigin = 'anonymous';

      let resolved = false;
      const finish = (thumbUrl: string, durationStr = '01:15', width = 3840, height = 2160) => {
        if (resolved) return;
        resolved = true;
        resolve({
          id: `drone-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: 'drone',
          previewUrl: thumbUrl,
          streamUrl: url,
          width,
          height,
          fileSize: formatFileSize(file.size),
          fileSizeBytes: file.size,
          videoDuration: durationStr,
        });
      };

      // Fallback custom canvas poster for .insv proprietary stream
      const generateDroneFallbackThumbnail = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 640, 360);
          grad.addColorStop(0, '#0b1329');
          grad.addColorStop(0.5, '#1e293b');
          grad.addColorStop(1, '#0284c7');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 640, 360);

          // Subtle aerial altitude grid lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          for (let x = 40; x < 640; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 360); ctx.stroke();
          }
          for (let y = 30; y < 360; y += 30) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(640, y); ctx.stroke();
          }

          // Drone 360 Header
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 22px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('DRONE 360°', 320, 160);

          ctx.fillStyle = '#ffffff';
          ctx.font = '600 13px system-ui, sans-serif';
          ctx.fillText(file.name, 320, 195);

          ctx.fillStyle = '#93c5fd';
          ctx.font = '11.5px system-ui, sans-serif';
          ctx.fillText('Insta360 Aerial Panoramic Stream', 320, 225);
        }
        return canvas.toDataURL('image/jpeg', 0.9);
      };

      const timeout = setTimeout(() => {
        finish(generateDroneFallbackThumbnail());
      }, 1200);

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, (video.duration || 10) / 2);
      };

      video.onseeked = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1920;
          canvas.height = video.videoHeight || 1080;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbUrl = canvas.toDataURL('image/jpeg', 0.85);
            const mins = Math.floor((video.duration || 0) / 60);
            const secs = Math.floor((video.duration || 0) % 60);
            const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            finish(thumbUrl, durationStr, video.videoWidth || 3840, video.videoHeight || 2160);
            return;
          }
        } catch {
          // ignore
        }
        finish(generateDroneFallbackThumbnail());
      };

      video.onerror = () => {
        clearTimeout(timeout);
        finish(generateDroneFallbackThumbnail());
      };
    });
  };

  // Process video file from device
  const processVideoFile = (file: File): Promise<StagedItem> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;
      video.muted = true;
      video.crossOrigin = 'anonymous';

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, video.duration / 2);
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        const thumbUrl = canvas.toDataURL('image/jpeg', 0.85);

        const mins = Math.floor(video.duration / 60);
        const secs = Math.floor(video.duration % 60);
        const durationStr = `${mins.toString().padStart(2, '0')}:${secs
          .toString()
          .padStart(2, '0')}`;

        resolve({
          id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: 'video',
          previewUrl: thumbUrl,
          streamUrl: url,
          width: video.videoWidth || 1920,
          height: video.videoHeight || 1080,
          fileSize: formatFileSize(file.size),
          fileSizeBytes: file.size,
          videoDuration: durationStr,
        });
      };

      video.onerror = () => {
        resolve({
          id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: 'video',
          previewUrl: url,
          streamUrl: url,
          width: 1920,
          height: 1080,
          fileSize: formatFileSize(file.size),
          fileSizeBytes: file.size,
          videoDuration: '01:00',
        });
      };
    });
  };

  // Process image file from device with automatic HEIC-to-JPEG conversion
  const processImageFile = async (file: File): Promise<StagedItem> => {
    let workingFile = file;
    const isHeic = /\.(heic|heif)$/i.test(file.name) || file.type.includes('heic') || file.type.includes('heif');

    if (isHeic) {
      try {
        setStatusMessage(`Converting HEIC (${file.name}) to high-quality JPEG...`);
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9,
        });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        workingFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg',
          lastModified: file.lastModified,
        });
      } catch (convErr) {
        console.warn('HEIC conversion fallback:', convErr);
      }
    }

    const isRaw = workingFile.name.match(/\.(dng|arw|cr3|cr2|nef|raw|raf|rw2)$/i);

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new window.Image();

        img.onload = () => {
          let optimizedUrl = dataUrl;
          try {
            const MAX_DIM = 1600;
            let w = img.naturalWidth || 1920;
            let h = img.naturalHeight || 1080;
            if (w > MAX_DIM || h > MAX_DIM || dataUrl.length > 800000) {
              if (w > h) {
                h = Math.round((h * MAX_DIM) / w);
                w = MAX_DIM;
              } else {
                w = Math.round((w * MAX_DIM) / h);
                h = MAX_DIM;
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, w, h);
                optimizedUrl = canvas.toDataURL('image/jpeg', 0.85);
              }
            }
          } catch {
            optimizedUrl = dataUrl;
          }

          resolve({
            id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            file: workingFile,
            title: workingFile.name.replace(/\.[^/.]+$/, ''),
            type: isRaw ? 'raw' : 'photo',
            previewUrl: optimizedUrl,
            streamUrl: optimizedUrl,
            width: img.naturalWidth || 4000,
            height: img.naturalHeight || 3000,
            fileSize: formatFileSize(workingFile.size),
            fileSizeBytes: workingFile.size,
          });
        };

        img.onerror = () => {
          resolve({
            id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            file: workingFile,
            title: workingFile.name.replace(/\.[^/.]+$/, ''),
            type: isRaw ? 'raw' : 'photo',
            previewUrl: dataUrl,
            streamUrl: dataUrl,
            width: 4000,
            height: 3000,
            fileSize: formatFileSize(workingFile.size),
            fileSizeBytes: workingFile.size,
          });
        };

        img.src = dataUrl;
      };

      reader.onerror = () => {
        const objectUrl = URL.createObjectURL(workingFile);
        resolve({
          id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file: workingFile,
          title: workingFile.name.replace(/\.[^/.]+$/, ''),
          type: isRaw ? 'raw' : 'photo',
          previewUrl: objectUrl,
          streamUrl: objectUrl,
          width: 4000,
          height: 3000,
          fileSize: formatFileSize(workingFile.size),
          fileSizeBytes: workingFile.size,
        });
      };

      reader.readAsDataURL(workingFile);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setStatusMessage(`Scanning ${files.length} files...`);

    const newItems: StagedItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isDrone = /\.insv$/i.test(file.name) || /drone/i.test(file.name);
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|mkv|avi|m4v|3gp|flv|wmv)$/i.test(file.name);

      if (isDrone) {
        const item = await processDroneVideoFile(file);
        newItems.push(item);
      } else if (isVideo) {
        const item = await processVideoFile(file);
        newItems.push(item);
      } else {
        const item = await processImageFile(file);
        newItems.push(item);
      }
    }

    setStagedFiles((prev) => [...prev, ...newItems]);
    setStatusMessage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeStagedFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Final Ingest execution with direct Vercel Blob cloud upload
  const handleUploadExecution = async () => {
    if (stagedFiles.length === 0 || isUploadingRef.current) return;

    isUploadingRef.current = true;
    setIsUploading(true);
    setUploadProgress(0);

    const newMediaItems: MediaItem[] = [];
    const totalFiles = stagedFiles.length;

    try {
      for (let i = 0; i < stagedFiles.length; i++) {
        const staged = stagedFiles[i];
        setStatusMessage(`Uploading ${staged.title} to Cloud Storage (${i + 1}/${totalFiles})...`);

        // Sanitize file name
        const cleanFileName = `${Date.now()}-${staged.file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

        // 1. Upload main file directly to Vercel Blob
        let fileUrl = staged.streamUrl;
        try {
          const blobResult = await upload(cleanFileName, staged.file, {
            access: 'public',
            handleUploadUrl: '/api/blob-upload',
          });
          fileUrl = blobResult.url;
        } catch (uploadErr) {
          console.error('Vercel Blob upload failed for file:', staged.file.name, uploadErr);
        }

        // 2. Upload thumbnail if generated (for video/drone or raw)
        let thumbnailUrl = fileUrl;
        if (
          (staged.type === 'video' || staged.type === 'drone') &&
          staged.previewUrl &&
          staged.previewUrl.startsWith('data:')
        ) {
          try {
            const thumbRes = await fetch(staged.previewUrl);
            const thumbBlob = await thumbRes.blob();
            const thumbResult = await upload(`thumb-${Date.now()}-${staged.id}.jpg`, thumbBlob, {
              access: 'public',
              handleUploadUrl: '/api/blob-upload',
            });
            thumbnailUrl = thumbResult.url;
          } catch (thumbErr) {
            console.warn('Thumbnail blob upload fallback:', thumbErr);
            thumbnailUrl = fileUrl;
          }
        }

        const ext = staged.file.name.split('.').pop()?.toUpperCase() || 'JPEG';
        const isDrone = staged.type === 'drone';

        const item: MediaItem = {
          id: staged.id,
          title: staged.title,
          type: staged.type,
          url: fileUrl,
          thumbnail: thumbnailUrl,
          aspectRatio: staged.width / (staged.height || 1),
          width: staged.width,
          height: staged.height,
          fileSize: staged.fileSize,
          fileSizeBytes: staged.fileSizeBytes,
          dateAdded: new Date().toISOString(),
          dateTaken: new Date(staged.file.lastModified).toISOString().replace('T', ' ').substring(0, 16),
          isFavorite: false,
          rating: 5,
          tags: isDrone
            ? ['Drone Video', 'INSV', '360°', 'Aerial Footage']
            : ['My Upload', staged.type.toUpperCase(), ext],
          albumId: selectedAlbum || undefined,
          videoDuration: staged.videoDuration,
          isCustomUpload: true,
          exif: {
            camera: isDrone ? 'Insta360 Drone Cam (INSV)' : 'Local Device',
            lens: isDrone ? 'Dual 360° Aerial Fisheye' : 'Standard Optics',
            iso: 100,
            shutter: '1/500s',
            aperture: 'f/2.8',
            focalLength: isDrone ? '7.2mm' : '35mm',
            location: 'DigiFox Library Vault',
            colorSpace: 'sRGB / Rec.709',
            bitDepth: isDrone ? '10-bit INSV Stream' : staged.type === 'video' ? '10-bit Video' : '8-bit RGB',
          },
        };

        // Immediately persist this item to Neon Cloud DB
        setStatusMessage(`Storing ${staged.title} to database (${i + 1}/${totalFiles})...`);
        try {
          await saveMediaToCloud([item]);
        } catch (dbErr) {
          console.error('Failed to store item in database:', dbErr);
        }

        newMediaItems.push(item);
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      onUploadComplete(newMediaItems);
      setStagedFiles([]);
      onClose();
    } catch (err: any) {
      console.error('Upload process error:', err);
      setStatusMessage(`Upload failed: ${err.message || 'Error occurred'}`);
    } finally {
      setIsUploading(false);
      isUploadingRef.current = false;
    }
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
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 58,
            padding: '0 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: 'var(--selected-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <UploadCloud size={18} />
            </div>
            <div>
              <span
                style={{
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  display: 'block',
                }}
              >
                Upload to DigiFox Library
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                Import photos, videos, and drone footage directly from your computer
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 6 }}>
            <X size={18} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            overflowY: 'auto',
          }}
        >
          {/* Target Collection / Album selector with inline creation */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-secondary)',
                }}
              >
                Destination Collection / Album
              </label>

              {!isCreatingAlbum && (
                <button
                  type="button"
                  onClick={() => setIsCreatingAlbum(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--accent)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                  title="Create a new collection"
                >
                  <FolderPlus size={14} />
                  <span>+ New Collection</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={selectedAlbum}
                onChange={(e) => {
                  if (e.target.value === '__create_new__') {
                    setIsCreatingAlbum(true);
                  } else {
                    setSelectedAlbum(e.target.value);
                  }
                }}
                className="input-field"
                style={{ height: 38, flex: 1 }}
              >
                <option value="">All Media (Root Library)</option>
                {albums.map((alb) => (
                  <option key={alb.id} value={alb.id}>
                    {alb.title} {alb.itemCount !== undefined ? `(${alb.itemCount})` : ''}
                  </option>
                ))}
                <option value="__create_new__">+ Create New Collection...</option>
              </select>
            </div>

            {/* Inline New Album Panel */}
            {isCreatingAlbum && (
              <div
                style={{
                  marginTop: 10,
                  padding: 14,
                  borderRadius: 8,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Create New Collection
                </div>
                <input
                  type="text"
                  placeholder="Collection Title (e.g. Vacation, Drone Footage)"
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  className="input-field"
                  style={{ height: 36 }}
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Optional description"
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  className="input-field"
                  style={{ height: 34 }}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingAlbum(false);
                      setNewAlbumTitle('');
                      setNewAlbumDesc('');
                    }}
                    className="btn-secondary"
                    style={{ height: 32, fontSize: 12 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateNewAlbum}
                    disabled={!newAlbumTitle.trim()}
                    className="btn-primary"
                    style={{ height: 32, fontSize: 12 }}
                  >
                    <Check size={14} />
                    <span>Create & Select</span>
                  </button>
                </div>
              </div>
            )}

            {albumSuccessMsg && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Check size={14} />
                <span>{albumSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border-color)'}`,
              borderRadius: 10,
              padding: stagedFiles.length > 0 ? '24px 16px' : '40px 20px',
              textAlign: 'center',
              backgroundColor: dragActive ? 'var(--selected-bg)' : 'var(--bg-main)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.insv,.insp,.mp4,.mov,.dng,.arw,.cr3,.cr2,.nef,.raw,.raf"
              style={{ display: 'none' }}
              onChange={handleFileInput}
              onClick={(e) => e.stopPropagation()}
            />

            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                marginBottom: 10,
              }}
            >
              <HardDrive size={24} />
            </div>

            <div
              style={{
                fontSize: 14.5,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}
            >
              {stagedFiles.length > 0
                ? 'Click or drag to add more photos, videos & drone footage'
                : 'Click to browse or drag and drop your photos, videos & drone files here'}
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Supports JPG, PNG, WEBP, MP4, MOV, Drone INSV (Insta360 / 360°), and RAW files
            </p>
          </div>

          {/* Reading status message */}
          {statusMessage && (
            <div
              style={{
                padding: '9px 14px',
                borderRadius: 8,
                backgroundColor: 'var(--accent-subtle)',
                color: 'var(--accent)',
                fontSize: 12.5,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertCircle size={15} />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Staged Files List */}
          {stagedFiles.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.04em',
                  }}
                >
                  Selected Files ({stagedFiles.length})
                </div>
                <button
                  type="button"
                  onClick={() => setStagedFiles([])}
                  style={{
                    fontSize: 11.5,
                    color: 'var(--color-error)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Clear All
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  maxHeight: 220,
                  overflowY: 'auto',
                }}
              >
                {stagedFiles.map((staged) => (
                  <div
                    key={staged.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 8,
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      gap: 12,
                    }}
                  >
                    {/* Thumbnail Preview */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 6,
                        overflow: 'hidden',
                        backgroundColor: 'var(--media-placeholder-bg)',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={staged.previewUrl}
                        alt={staged.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>

                    {/* Metadata */}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{staged.file.name}</span>
                        {staged.type === 'drone' && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#fff',
                              backgroundColor: '#0284c7',
                              padding: '2px 6px',
                              borderRadius: 4,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 3,
                              flexShrink: 0,
                            }}
                          >
                            <Drone size={10} />
                            <span>DRONE</span>
                          </span>
                        )}
                        {staged.type === 'video' && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: 'var(--text-secondary)',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-color)',
                              padding: '2px 6px',
                              borderRadius: 4,
                              flexShrink: 0,
                            }}
                          >
                            VIDEO
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: 'var(--text-secondary)',
                          marginTop: 2,
                        }}
                      >
                        {staged.fileSize} • {staged.width} × {staged.height} px
                        {staged.videoDuration && ` • ${staged.videoDuration}`}
                        {staged.type === 'drone' && ' • 360° Aerial Sphere'}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeStagedFile(staged.id)}
                      style={{
                        padding: 6,
                        color: 'var(--text-tertiary)',
                        borderRadius: 4,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      title="Remove file"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar when Ingesting */}
          {isUploading && (
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12.5,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  Saving {stagedFiles.length} {stagedFiles.length === 1 ? 'file' : 'files'} to DigiFox Library...
                </span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {uploadProgress}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  width: '100%',
                  backgroundColor: 'var(--border-subtle)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${uploadProgress}%`,
                    backgroundColor: 'var(--accent)',
                    transition: 'width 200ms ease',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            height: 56,
            padding: '0 20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {stagedFiles.length > 0 ? `${stagedFiles.length} files selected` : 'Select photos or videos to upload'}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUploadExecution}
              className="btn-primary"
              disabled={isUploading || stagedFiles.length === 0}
            >
              <UploadCloud size={15} />
              <span>
                {isUploading
                  ? 'Saving...'
                  : `Upload ${stagedFiles.length > 0 ? `(${stagedFiles.length})` : ''}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
