import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './ImageCarousel.css'; // Import existing styles

// Generic image interface that works with both CloudinaryImage and Photo
export interface LightboxImage {
  id: string;
  src: string; // Full resolution image
  thumbnailSrc?: string; // Thumbnail for blur backdrop
  alt: string;
  width?: number;
  height?: number;
  [key: string]: unknown; // Allow additional properties
}

interface ImageLightboxProps {
  image: LightboxImage | null;
  images: LightboxImage[];
  onClose: () => void;
  onImageChange?: (image: LightboxImage) => void;
  altText?: string;
  showNavigationHints?: boolean;
}

// SVG strings for cursors (same as ImageCarousel)
const chevronLeftSVG = "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='15 18 9 12 15 6'></polyline></svg>";
const chevronRightSVG = "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'></polyline></svg>";

const cursorLeft = `url("data:image/svg+xml;utf8,${encodeURIComponent(chevronLeftSVG)}") 16 16, auto`;
const cursorRight = `url("data:image/svg+xml;utf8,${encodeURIComponent(chevronRightSVG)}") 16 16, auto`;

/**
 * Unified ImageLightbox component for displaying images in a modal overlay.
 * Can be used by both ImageCarousel and PhotoGallery for consistent behavior.
 * Uses thumbnail as blur backdrop while full-res image loads.
 */
export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  image,
  images,
  onClose,
  onImageChange,
  altText = 'Image',
  showNavigationHints = true
}) => {
  const [hoveredImageHalf, setHoveredImageHalf] = useState<'left' | 'right' | null>(null);
  const [fullResLoaded, setFullResLoaded] = useState(false);
  const prevImageRef = useRef<LightboxImage | null>(null);

  // Track previous image for animation variants
  useEffect(() => {
    prevImageRef.current = image;
  }, [image]);

  // Reset loading state when image changes
  useEffect(() => {
    setFullResLoaded(false);
  }, [image?.id]);

  const goToNextImage = useCallback(() => {
    if (!image || images.length <= 1) return;
    const currentIndex = images.findIndex(img => img.id === image.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % images.length;
    const nextImage = images[nextIndex];
    onImageChange?.(nextImage);
  }, [image, images, onImageChange]);

  const goToPrevImage = useCallback(() => {
    if (!image || images.length <= 1) return;
    const currentIndex = images.findIndex(img => img.id === image.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const prevImage = images[prevIndex];
    onImageChange?.(prevImage);
  }, [image, images, onImageChange]);

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    const target = event.target as HTMLImageElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const midpoint = rect.width / 2;

    if (clickX < midpoint) {
      goToPrevImage();
    } else {
      goToNextImage();
    }
  };

  const handleImageMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!showNavigationHints || images.length <= 1) return;
    
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const midpoint = rect.width / 2;
    if (hoverX < midpoint) {
      setHoveredImageHalf('left');
    } else {
      setHoveredImageHalf('right');
    }
  };

  const handleImageMouseLeave = () => {
    setHoveredImageHalf(null);
  };

  const getCursorStyle = () => {
    if (!showNavigationHints || images.length <= 1) return 'default';
    if (hoveredImageHalf === 'left') return cursorLeft;
    if (hoveredImageHalf === 'right') return cursorRight;
    return 'pointer';
  };

  // Animation variants (same as ImageCarousel)
  const isOpeningModal = prevImageRef.current === null && image !== null;
  const isClosingModal = prevImageRef.current !== null && image === null;
  const isChangingImageInModal = prevImageRef.current !== null && image !== null && prevImageRef.current.id !== image.id;

  const imageAnimationVariants = {
    openScale: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closedScale: { scale: 0.8, opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    fadeIn: { opacity: 1, transition: { duration: 0.5 } },
    fadeOut: { opacity: 0, transition: { duration: 0.5 } },
  };

  let currentInitial: string = "closedScale";
  let currentAnimate: string = "openScale";
  let currentExit: string = "closedScale";

  if (isChangingImageInModal) {
    currentInitial = "fadeOut";
    currentAnimate = "fadeIn";
    currentExit = "fadeOut";
  }

  if (!image) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="expanded-image-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Image container with relative positioning for absolute children */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Blurred thumbnail backdrop - absolute positioned */}
          {image.thumbnailSrc && (
            <motion.img
              src={image.thumbnailSrc}
              alt=""
              className="absolute max-w-full max-h-full object-contain"
              style={{ 
                filter: 'blur(20px) brightness(0.7)',
                zIndex: 1
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: fullResLoaded ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Full resolution image - absolute positioned on top */}
          <motion.img
            key={image.id}
            src={image.src}
            alt={image.alt || `${altText} - expanded image`}
            className="absolute max-w-full max-h-full object-contain"
            variants={imageAnimationVariants}
            initial={currentInitial}
            animate={currentAnimate}
            exit={currentExit}
            layoutId={(isOpeningModal || isClosingModal) ? `image-${image.id}` : undefined}
            onClick={handleImageClick}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={handleImageMouseLeave}
            onLoad={() => setFullResLoaded(true)}
            style={{
              cursor: getCursorStyle(),
              opacity: fullResLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              zIndex: 2
            }}
          />
        </div>
        
        {/* Loading indicator while full-res loads */}
        {!fullResLoaded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 3 }}
          >
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
        
        <motion.button
          className="expanded-image-close-button"
          onClick={onClose}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
          exit={{ opacity: 0, scale: 0.5 }}
          style={{ zIndex: 4 }}
        >
          <X size={32} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}; 