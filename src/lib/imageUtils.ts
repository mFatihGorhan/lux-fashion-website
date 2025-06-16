/**
 * Image optimization utilities for better performance
 */

// Generate a blurred placeholder data URL
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  // Create a simple gradient blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f5f5f3;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#d4b5a0;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#b8956f;stop-opacity:0.6" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" />
    </svg>
  `
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

// Get optimized image sizes for responsive images
export function getImageSizes(viewMode: 'grid' | 'list' = 'grid'): string {
  if (viewMode === 'list') {
    return '(max-width: 768px) 100px, 200px'
  }
  
  return '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
}

// Get loading priority based on index
export function getLoadingPriority(index: number): 'high' | 'low' {
  return index < 4 ? 'high' : 'low'
}

// Get loading strategy based on index
export function getLoadingStrategy(index: number): 'eager' | 'lazy' {
  return index < 4 ? 'eager' : 'lazy'
}

// Check if image should have priority
export function shouldPrioritizeImage(index: number): boolean {
  return index < 2
}

// Placeholder image URL for missing images
export const PLACEHOLDER_IMAGE = '/images/placeholder-product.svg'

// Image quality settings
export const IMAGE_QUALITY = {
  thumbnail: 60,
  medium: 75,
  high: 85,
  hero: 90
} as const

// Common image dimensions
export const IMAGE_DIMENSIONS = {
  productCard: { width: 400, height: 600 },
  productThumbnail: { width: 200, height: 300 },
  heroImage: { width: 1920, height: 1080 },
  profileAvatar: { width: 64, height: 64 }
} as const