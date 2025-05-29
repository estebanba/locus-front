import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the interface for a single photo item
interface Photo {
  id: string;
  src: string;
  alt: string;
  category: string;
  width?: number;
  height?: number;
}

// Props interface for the PhotoGallery component
interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
  selectedCategory?: string;
}

/**
 * PhotoGallery Component
 * 
 * A responsive photo gallery with lightbox functionality.
 * Features:
 * - Responsive grid layout
 * - Click to view full-size images
 * - Supports keyboard navigation (Escape to close, arrows to navigate)
 * - Filtering by category
 * - Smooth transitions and animations
 * - Image information always displayed below
 * - Navigation chevrons to browse through images
 * 
 * @param photos - Array of photo objects to display
 * @param className - Optional additional CSS classes
 * @param selectedCategory - Optional category filter
 */
export function PhotoGallery({ photos, className, selectedCategory }: PhotoGalleryProps) {
  // State to track the currently selected photo for the lightbox
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  // State to track the current index of the selected photo
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Filter photos by category if a category is selected
  const filteredPhotos = selectedCategory && selectedCategory !== 'All' 
    ? photos.filter(photo => photo.category === selectedCategory)
    : photos;
  
  // When a photo is selected, find its index in the filtered list
  useEffect(() => {
    if (selectedPhoto) {
      const index = filteredPhotos.findIndex(photo => photo.id === selectedPhoto.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedPhoto, filteredPhotos]);

  // Navigation functions
  const showPrevious = () => {
    const newIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setCurrentIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const showNext = () => {
    const newIndex = (currentIndex + 1) % filteredPhotos.length;
    setCurrentIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedPhoto(null);
    } else if (e.key === 'ArrowLeft') {
      showPrevious();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  };

  return (
    <div className={cn("w-full", className)} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Grid layout for the gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhotos.map((photo) => (
          <motion.div 
            key={photo.id}
            className="overflow-hidden cursor-pointer transition-all hover:opacity-90"
            onClick={() => setSelectedPhoto(photo)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto object-cover aspect-square"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox modal with AnimatePresence for smooth transitions */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedPhoto(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main container for the image and caption with positioning */}
            <div className="relative max-w-screen-lg w-full flex flex-col items-center">
              {/* Left navigation button - outside the rectangle */}
              <motion.button
                className="absolute left-0 top-1/2 -translate-y-1/2 text-white w-12 h-24 flex items-center justify-center transition-colors focus:outline-none z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevious();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
              </motion.button>
              
              {/* Right navigation button - outside the rectangle */}
              <motion.button
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white w-12 h-24 flex items-center justify-center transition-colors focus:outline-none z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-10 h-10" strokeWidth={1.5} />
              </motion.button>
              
              <div className="w-full max-w-[800px] flex flex-col">
                {/* Close button above the rectangle */}
                <motion.button 
                  className="self-end text-white hover:text-gray-200 mb-2 flex items-center justify-center transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhoto(null);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-8 h-8" strokeWidth={1.5} />
                </motion.button>
                
                {/* Semi-transparent rectangle containing the image */}
                <motion.div
                  className="bg-black/70 p-8 overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.img
                    key={selectedPhoto.id}
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    className="max-h-[65vh] max-w-full object-contain mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                
                {/* Caption area - solid black */}
                <motion.div 
                  className="p-4 bg-black text-white"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-semibold mb-2">{selectedPhoto.alt}</h3>
                  <p className="text-sm opacity-90 mb-1">Category: {selectedPhoto.category}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 