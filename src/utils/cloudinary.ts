/**
 * Cloudinary image transformation utilities
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
 * Uses automatic format and quality optimization with a fixed width.
 * @param secureUrl The original Cloudinary image URL.
 * @param width The desired width in pixels (default: 400)
 * @returns The thumbnail URL.
 */
export const generateThumbnailUrl = (secureUrl: string, width: number = 400): string => {
  const transformation = `w_${width},f_auto,q_auto,c_fill,ar_1:1`;
  return transformCloudinaryUrl(secureUrl, transformation);
};

/**
 * Creates a medium-sized version of a Cloudinary image for lightbox previews.
 * Maintains aspect ratio with quality optimization.
 * @param secureUrl The original Cloudinary image URL.
 * @param width The desired maximum width in pixels (default: 1200)
 * @returns The medium-sized image URL.
 */
export const generateMediumUrl = (secureUrl: string, width: number = 1200): string => {
  const transformation = `w_${width},f_auto,q_auto`;
  return transformCloudinaryUrl(secureUrl, transformation);
};

/**
 * Creates a high-quality version of a Cloudinary image for full-screen viewing.
 * @param secureUrl The original Cloudinary image URL.
 * @param width The desired maximum width in pixels (default: 2048)
 * @returns The high-quality image URL.
 */
export const generateHighQualityUrl = (secureUrl: string, width: number = 2048): string => {
  const transformation = `w_${width},f_auto,q_90`;
  return transformCloudinaryUrl(secureUrl, transformation);
}; 