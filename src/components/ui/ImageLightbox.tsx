import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './ImageCarousel.css'; // Import existing styles

// Generic image interface that works with both CloudinaryImage and Photo
export interface LightboxImage {
  id: string;
  src: string;
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
  const prevImageRef = useRef<LightboxImage | null>(null);

  // Track previous image for animation variants
  useEffect(() => {
    prevImageRef.current = image;
  }, [image]);

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
        <motion.img
          key={image.id}
          src={image.src}
          alt={image.alt || `${altText} - expanded image`}
          className="expanded-image-content"
          variants={imageAnimationVariants}
          initial={currentInitial}
          animate={currentAnimate}
          exit={currentExit}
          layoutId={(isOpeningModal || isClosingModal) ? `image-${image.id}` : undefined}
          onClick={handleImageClick}
          onMouseMove={handleImageMouseMove}
          onMouseLeave={handleImageMouseLeave}
          style={{ cursor: getCursorStyle() }}
        />
        
        <motion.button
          className="expanded-image-close-button"
          onClick={onClose}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <X size={32} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}; 