export type MediaType = 'photo' | 'video' | 'drone' | 'raw';

export interface ExifData {
  camera: string;
  lens: string;
  iso: number;
  shutter: string;
  aperture: string;
  focalLength: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  colorSpace?: string;
  bitDepth?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnail: string;
  aspectRatio: number; // width / height
  width: number;
  height: number;
  fileSize: string; // e.g., '14.2 MB'
  fileSizeBytes: number;
  dateAdded: string; // ISO string
  dateTaken: string; // Human or ISO
  isFavorite: boolean;
  rating: number; // 0 - 5
  tags: string[];
  albumId?: string;
  videoDuration?: string; // e.g. '02:45'
  isCustomUpload?: boolean;
  exif: ExifData;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  itemCount: number;
  dateCreated: string;
  isSmartAlbum?: boolean;
}

export type SortField = 'dateAdded' | 'dateTaken' | 'fileSize' | 'title' | 'rating';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  mediaType: 'all' | 'photo' | 'video' | 'drone' | 'raw';
  favoritesOnly: boolean;
  selectedAlbumId: string | null;
  selectedTag: string | null;
  sortField: SortField;
  sortDirection: SortDirection;
}
