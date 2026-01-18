import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price to Vietnamese Dong (VNĐ)
 * @param price - Price in VNĐ
 * @returns Formatted price string in VNĐ
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0 ₫';
  
  // Format with thousand separators (price is already in VND)
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
}

/**
 * Get the base URL for the application
 * Works in both server-side and client-side contexts
 * Priority:
 * 1. NEXT_PUBLIC_BASE_URL (explicit config)
 * 2. VERCEL_URL (Vercel deployment)
 * 3. NEXT_PUBLIC_VERCEL_URL (Vercel public URL)
 * 4. localhost:3000 (development fallback)
 * 
 * @param request - Optional Request for server-side context
 * @returns Absolute base URL (e.g., https://example.com)
 */
export function getBaseUrl(request?: Request): string {
  // Server-side: Check environment variables first
  if (typeof window === 'undefined') {
    // Priority 1: Explicit base URL config
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // Priority 2: Vercel URL (server-side only)
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    // Priority 3: Vercel public URL
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }

    // Priority 4: Extract from request headers (server-side)
    if (request) {
      const protocol = request.headers.get('x-forwarded-proto') || 'https';
      const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
      if (host) {
        return `${protocol}://${host}`;
      }
    }
  }

  // Client-side: Check NEXT_PUBLIC_BASE_URL
  if (typeof window !== 'undefined') {
    // Use NEXT_PUBLIC_BASE_URL if available
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // Fallback to current origin (works in browser)
    if (window.location.origin) {
      return window.location.origin;
    }
  }

  // Final fallback: localhost for development
  return process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' // Should never reach here in production
    : 'http://localhost:3000';
}