import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const DEFAULT_URL =
  'postgresql://neondb_owner:npg_tiGx2FhNW4Yz@ep-flat-boat-beqzbeyy-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';

function getSql() {
  const connectionString = process.env.DATABASE_URL || DEFAULT_URL;
  return neon(connectionString);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sql = getSql();

  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT * FROM media_items ORDER BY date_added DESC
      `;

      const mapped = rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        url: r.url,
        thumbnail: r.thumbnail,
        aspectRatio: r.aspect_ratio ? parseFloat(r.aspect_ratio) : 1.5,
        width: r.width || 1920,
        height: r.height || 1080,
        fileSize: r.file_size || '0 MB',
        fileSizeBytes: r.file_size_bytes ? parseInt(r.file_size_bytes, 10) : 0,
        dateAdded: r.date_added,
        dateTaken: r.date_taken || r.date_added,
        isFavorite: Boolean(r.is_favorite),
        rating: r.rating || 5,
        tags: Array.isArray(r.tags) ? r.tags : [],
        albumId: r.album_id || undefined,
        videoDuration: r.video_duration || undefined,
        isCustomUpload: Boolean(r.is_custom_upload),
        exif: typeof r.exif === 'object' && r.exif !== null ? r.exif : {},
      }));

      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      const payload = req.body;
      const items = Array.isArray(payload) ? payload : [payload];

      for (const item of items) {
        if (!item || !item.id) continue;

        await sql`
          INSERT INTO media_items (
            id, title, type, url, thumbnail, aspect_ratio, width, height,
            file_size, file_size_bytes, date_added, date_taken, is_favorite,
            rating, tags, album_id, video_duration, is_custom_upload, exif
          )
          VALUES (
            ${item.id},
            ${item.title || 'Untitled'},
            ${item.type || 'photo'},
            ${item.url || ''},
            ${item.thumbnail || ''},
            ${item.aspectRatio || 1.5},
            ${item.width || 1920},
            ${item.height || 1080},
            ${item.fileSize || ''},
            ${item.fileSizeBytes || 0},
            ${item.dateAdded || new Date().toISOString()},
            ${item.dateTaken || new Date().toISOString()},
            ${Boolean(item.isFavorite)},
            ${item.rating || 5},
            ${JSON.stringify(item.tags || [])}::jsonb,
            ${item.albumId || null},
            ${item.videoDuration || null},
            ${Boolean(item.isCustomUpload)},
            ${JSON.stringify(item.exif || {})}::jsonb
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            type = EXCLUDED.type,
            url = EXCLUDED.url,
            thumbnail = EXCLUDED.thumbnail,
            is_favorite = EXCLUDED.is_favorite,
            rating = EXCLUDED.rating,
            tags = EXCLUDED.tags,
            album_id = EXCLUDED.album_id;
        `;
      }

      return res.status(200).json({ success: true, count: items.length });
    }

    if (req.method === 'PATCH') {
      const { id, isFavorite, rating, albumId } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });

      if (typeof isFavorite === 'boolean') {
        await sql`UPDATE media_items SET is_favorite = ${isFavorite} WHERE id = ${id}`;
      }
      if (typeof rating === 'number') {
        await sql`UPDATE media_items SET rating = ${rating} WHERE id = ${id}`;
      }
      if (albumId !== undefined) {
        await sql`UPDATE media_items SET album_id = ${albumId || null} WHERE id = ${id}`;
      }

      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const ids: string[] = req.body?.ids || (req.query.id ? [String(req.query.id)] : []);
      if (!ids || ids.length === 0) {
        return res.status(400).json({ error: 'Missing ids' });
      }

      for (const id of ids) {
        await sql`DELETE FROM media_items WHERE id = ${id}`;
      }

      return res.status(200).json({ success: true, deleted: ids.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API media error:', error);
    return res.status(500).json({ error: error.message || 'Database error' });
  }
}
