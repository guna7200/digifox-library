import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sql = getSql();

  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT * FROM albums ORDER BY date_created DESC
      `;

      const mapped = rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        description: r.description || '',
        coverUrl: r.cover_url || '',
        itemCount: r.item_count || 0,
        dateCreated: r.date_created,
      }));

      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      const album = req.body;
      if (!album || !album.id || !album.title) {
        return res.status(400).json({ error: 'Missing album id or title' });
      }

      await sql`
        INSERT INTO albums (id, title, description, cover_url, item_count, date_created)
        VALUES (
          ${album.id},
          ${album.title},
          ${album.description || ''},
          ${album.coverUrl || ''},
          ${album.itemCount || 0},
          ${album.dateCreated || new Date().toISOString().split('T')[0]}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          cover_url = EXCLUDED.cover_url;
      `;

      return res.status(200).json({ success: true, album });
    }

    if (req.method === 'PUT') {
      const album = req.body;
      if (!album || !album.id) {
        return res.status(400).json({ error: 'Missing album id' });
      }

      await sql`
        UPDATE albums
        SET
          title = ${album.title},
          description = ${album.description || ''},
          cover_url = ${album.coverUrl || ''}
        WHERE id = ${album.id};
      `;

      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const albumId = req.body?.id || req.query.id;
      if (!albumId) {
        return res.status(400).json({ error: 'Missing album id' });
      }

      // Unlink media items from this album
      await sql`UPDATE media_items SET album_id = NULL WHERE album_id = ${String(albumId)}`;
      // Delete album
      await sql`DELETE FROM albums WHERE id = ${String(albumId)}`;

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API albums error:', error);
    return res.status(500).json({ error: error.message || 'Database error' });
  }
}
