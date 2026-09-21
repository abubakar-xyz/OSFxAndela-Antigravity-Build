/* WAZI Civic — Privacy & Metadata Sanitization */

import type { DisclosureSettings } from './types';

/**
 * Strips EXIF metadata by re-encoding the image through an HTML5 Canvas.
 * Ensures GPS coordinates, camera hardware serials, and timestamps are purged.
 */
export async function stripExifAndCompressImage(file: File, maxDimension = 1200): Promise<{ dataUrl: string; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        // Clean render without metadata
        ctx.drawImage(img, 0, 0, width, height);

        // Quality 0.85 JPEG compression
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        // Estimate byte size from base64
        const estimatedSize = Math.round((dataUrl.length * 3) / 4);
        resolve({ dataUrl, size: estimatedSize });
      };
      img.onerror = () => reject(new Error('Failed to load image for sanitization'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Filters document disclosure text according to user privacy preferences.
 */
export function applyDisclosureToDraft(
  baseBody: string,
  settings: DisclosureSettings
): string {
  let filtered = baseBody;

  if (!settings.includeName || !settings.userName.trim()) {
    filtered = filtered.replace(/\[Complainant Name\]/g, 'Concerned Community Resident');
  } else {
    filtered = filtered.replace(/\[Complainant Name\]/g, settings.userName.trim());
  }

  if (!settings.includeContact || !settings.userContact.trim()) {
    filtered = filtered.replace(/\[Contact Telephone \/ Address\]/g, '[Contact withheld upon request for reporting privacy]');
  } else {
    filtered = filtered.replace(/\[Contact Telephone \/ Address\]/g, settings.userContact.trim());
  }

  if (!settings.includeApproxLocation) {
    filtered = filtered.replace(/\[Approximate Location: [^\]]+\]/g, '[Location details withheld]');
  }

  return filtered;
}
