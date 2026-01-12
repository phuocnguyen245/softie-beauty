/**
 * Convert image path to proper URL format
 * - Old format: /uploads/... → /api/files/...
 * - New format: /api/files/... → /api/files/...
 * - External URLs: http://... → http://...
 */
export function getImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) {
    return '';
  }

  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's old format /uploads/..., convert to /api/files/...
  if (imagePath.startsWith('/uploads/')) {
    return imagePath.replace('/uploads/', '/api/files/');
  }

  // If it's already /api/files/..., return as-is
  if (imagePath.startsWith('/api/files/')) {
    return imagePath;
  }

  // If it's a relative path without leading slash, assume it's old format
  if (!imagePath.startsWith('/')) {
    return `/api/files/${imagePath}`;
  }

  // Default: assume it's new format
  return imagePath;
}
