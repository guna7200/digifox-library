import heic2any from 'heic2any';

const heicCache = new Map<string, string>();

export async function convertHeicToJpegUrl(src: string): Promise<string> {
  if (!src) return src;
  if (heicCache.has(src)) return heicCache.get(src)!;

  const isHeic =
    /\.(heic|heif)($|\?)/i.test(src) ||
    src.startsWith('data:image/heic') ||
    src.startsWith('data:image/heif') ||
    src.includes('AAAANGZ0eXBoZWlj') ||
    src.includes('AAAAGGZ0eXBtaWYx') ||
    src.includes('ftypheic');

  if (!isHeic) return src;

  try {
    const res = await fetch(src);
    const blob = await res.blob();

    const converted = await heic2any({
      blob,
      toType: 'image/jpeg',
      quality: 0.85,
    });

    const resultBlob = Array.isArray(converted) ? converted[0] : converted;
    const objectUrl = URL.createObjectURL(resultBlob);
    heicCache.set(src, objectUrl);
    return objectUrl;
  } catch (err) {
    console.warn('On-the-fly HEIC conversion fallback:', err);
    return src;
  }
}
