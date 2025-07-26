import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CarouselSkeleton from '@/components/ui/CarouselSkeleton';
import { ImageLightbox, LightboxImage } from '@/components/ui/ImageLightbox';

// Types
export interface Photo {
  id: string;
  src: string;
  fullSrc: string;
  alt: string;
  year?: string;
  topic?: string;
  folder?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
}

interface ThumbnailProps {
  photo: Photo;
  onPhotoClick: (photo: Photo) => void;
  index: number;
}

// Configuration
const IMAGES_PER_BATCH = 20; // Load 20 images at a time
const PRELOAD_THRESHOLD = 0.5; // Start loading when 50% visible

const PhotoThumbnail: React.FC<ThumbnailProps> = ({ photo, onPhotoClick, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(true);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
    // Start fade-out after a short delay for smooth effect
    setTimeout(() => setSkeletonVisible(false), 200);
  };

  // Reset loading state when src changes
  useEffect(() => {
    setImageLoaded(false);
    setSkeletonVisible(true);
  }, [photo.src]);

  return (
    <motion.div 
      className="relative overflow-hidden cursor-pointer rounded-lg group"
      onClick={() => onPhotoClick(photo)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.3, 
        delay: (index % IMAGES_PER_BATCH) * 0.05, // Stagger within batch
        ease: "easeOut" 
      }}
      layout
      whileHover={{ scale: 1.02 }}
    >
      {/* Dark skeleton overlay */}
      {skeletonVisible && (
        <div
          className="absolute inset-0 z-10 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #4a4a4a 0%, #2d2d2d 100%)',
            transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
            opacity: imageLoaded ? 0 : 1,
          }}
        >
          <CarouselSkeleton className="w-full h-full rounded-lg" />
        </div>
      )}
      
      {/* Actual image with zoom effect */}
      <motion.img
        src={photo.src}
        alt={photo.alt}
        className="w-full h-auto object-cover aspect-square rounded-lg transition-transform duration-300 ease-out group-hover:scale-105"
        loading="lazy"
        onLoad={handleImageLoad}
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      
      {/* Subtle overlay on hover for better visual feedback */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-lg" />
    </motion.div>
  );
};

// Loading indicator component
const LoadingTrigger: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <motion.div 
      className="col-span-full flex justify-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span>Loading more photos...</span>
      </div>
    </motion.div>
  );
};

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, className }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_BATCH);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get currently visible photos
  const visiblePhotos = photos.slice(0, visibleCount);
  const hasMorePhotos = visibleCount < photos.length;

  // Load more photos function
  const loadMorePhotos = useCallback(() => {
    if (isLoading || !hasMorePhotos) return;
    
    setIsLoading(true);
    
    // Simulate slight delay for better UX (optional)
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + IMAGES_PER_BATCH, photos.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMorePhotos, photos.length]);

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    if (!loadingTriggerRef.current || !hasMorePhotos) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMorePhotos();
        }
      },
      {
        threshold: PRELOAD_THRESHOLD,
        rootMargin: '100px', // Start loading 100px before the trigger is visible
      }
    );

    if (loadingTriggerRef.current) {
      observerRef.current.observe(loadingTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMorePhotos, hasMorePhotos]);

  // Reset visible count when photos change (e.g., filtering)
  useEffect(() => {
    setVisibleCount(IMAGES_PER_BATCH);
  }, [photos]);

  // Handle photo click
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  // Convert Photo to LightboxImage format
  const convertToLightboxImage = (photo: Photo): LightboxImage => ({
    id: photo.id,
    src: photo.fullSrc,
    alt: photo.alt,
    title: photo.alt,
  });

  // Convert all photos to lightbox format
  const lightboxImages = photos.map(convertToLightboxImage);
  
  // Find current lightbox image
  const currentLightboxImage = selectedPhoto ? convertToLightboxImage(selectedPhoto) : null;

  // Handle lightbox image change
  const handleLightboxImageChange = (lightboxImage: LightboxImage) => {
    const originalPhoto = photos.find(p => p.id === lightboxImage.id);
    if (originalPhoto) {
      setSelectedPhoto(originalPhoto);
    }
  };

  return (
    <div className={className}>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {visiblePhotos.map((photo, index) => (
            <PhotoThumbnail
              key={`photo-${photo.id}`}
              photo={photo}
              onPhotoClick={handlePhotoClick}
              index={index}
            />
          ))}
          
          {/* Loading trigger element */}
          {hasMorePhotos && (
            <div
              key="loading-trigger"
              ref={loadingTriggerRef}
              className="col-span-full h-4"
              aria-hidden="true"
            />
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <LoadingTrigger key="loading-indicator" isLoading={isLoading} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      {selectedPhoto && (
        <ImageLightbox
          image={currentLightboxImage}
          images={lightboxImages}
          onClose={() => setSelectedPhoto(null)}
          onImageChange={handleLightboxImageChange}
          altText="Photography"
          showNavigationHints={true}
        />
      )}
    </div>
  );
};

export default PhotoGallery; 