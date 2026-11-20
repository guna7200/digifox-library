import type { VercelRequest, VercelResponse } from '@vercel/node';
import decode from 'heic-decode';
import jpeg from 'jpeg-js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64 } = req.body || {};
    if (!base64) {
      return res.status(400).json({ error: 'Missing base64 data' });
    }

    const rawBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const buffer = Buffer.from(rawBase64, 'base64');

    const { width, height, data } = await decode({ buffer });
    const jpegData = jpeg.encode({ data, width, height }, 85);
    const jpegBase64 = `data:image/jpeg;base64,${jpegData.data.toString('base64')}`;

    return res.status(200).json({
      success: true,
      jpegUrl: jpegBase64,
      width,
      height,
    });
  } catch (error: any) {
    console.error('Server HEIC convert error:', error);
    return res.status(500).json({ error: error.message || 'HEIC decode failed' });
  }
}
