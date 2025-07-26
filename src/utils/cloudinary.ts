/**
 * Cloudinary image transformation utilities with performance optimizations
 */

/**
 * Creates a transformed Cloudinary URL with specified transformations.
 * Injects transformation parameters before the '/upload/' part of the URL.
 * @param secureUrl The original Cloudinary image URL.
 * @param transformation The transformation string (e.g., "w_400,f_auto,q_auto")
 * @returns The transformed URL.
 */
export const transformCloudinaryUrl = (secureUrl: string, transformation: string): string => {
  if (!secureUrl || !secureUrl.includes('/upload/')) {
    return secureUrl; // Return original if not a valid Cloudinary URL
  }
  return secureUrl.replace("/upload/", `/upload/${transformation}/`);
};

/**
 * Creates a thumbnail version of a Cloudinary image optimized for gallery views.
 * Uses automatic format, quality optimization, and progressive loading.
 * @param secureUrl The original Cloudinary image URL.
 * @param width The desired width in pixels (default: 300)
 * @returns The thumbnail URL.
 */
export const generateThumbnailUrl = (secureUrl: string, width: number = 300): string => {
  const transformation = `w_${width},f_auto,q_auto,c_fill,ar_1:1,fl_progressive`;
  return transformCloudinaryUrl(secureUrl, transformation);
};

/**
 * Creates a mobile-optimized thumbnail that preserves natural aspect ratios.
 * Perfect for mobile vertical feeds where natural proportions are desired.
 * @param secureUrl The original Cloudinary image URL.
 * @param width The desired width in pixels (default: 400)
 * @returns The mobile thumbnail URL with natural aspect ratio.
 */
export const generateMobileThumbnailUrl = (secureUrl: string, width: number = 400): string => {
  const transformation = `w_${width},f_auto,q_auto,c_fit,fl_progressive`;
  return transformCloudinaryUrl(secureUrl, transformation);
};

/**
 * Creates a medium-sized version of a Cloudinary image for lightbox previews.
 * Maintains aspect ratio with optimized quality and progressive loading.
 * @param secureUrl The original Cloudinary image URL.
 * @param width The desired maximum width in pixels (default: 1200)
 * @returns The medium-sized image URL.
 */
export const generateMediumUrl = (secureUrl: string, width: number = 1200): string => {
  const transformation = `w_${width},f_auto,q_auto,fl_progressive,c_limit`;
  return transformCloudinaryUrl(secureUrl, transformation);
};

/**
 * Creates an optimized high-quality version for full-screen viewing with faster loading.
 * Uses progressive loading, optimized compression, and size limits for performance.
 * @param secureUrl The original Cloudinary image URL.
 * @param width The desired maximum width in pixels (default: 1600)
 * @returns The optimized high-quality image URL.
 */
export const generateHighQualityUrl = (secureUrl: string, width: number = 1600): string => {
  const transformation = `w_${width},f_auto,q_80,fl_progressive,c_limit,dpr_auto`;
  return transformCloudinaryUrl(secureUrl, transformation);
};

/**
 * Creates a mobile-optimized version with smaller size and better compression.
 * Perfect for mobile devices with limited bandwidth.
 * @param secureUrl The original Cloudinary image URL.
 * @param width The desired maximum width in pixels (default: 800)
 * @returns The mobile-optimized image URL.
 */
export const generateMobileOptimizedUrl = (secureUrl: string, width: number = 800): string => {
  const transformation = `w_${width},f_auto,q_70,fl_progressive,c_limit,dpr_auto`;
  return transformCloudinaryUrl(secureUrl, transformation);
}; 