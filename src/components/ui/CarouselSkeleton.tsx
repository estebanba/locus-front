import React from 'react';

interface CarouselSkeletonProps {
  className?: string; // Will now primarily control width and responsive height e.g. "w-full h-[32vh] md:h-[48vh]"
}

// A sleek, modern circular spinner
const SleekSpinner: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
      {/* 
        The animate-spin utility from Tailwind CSS handles the rotation keyframes.
        If custom speed or easing is needed, a custom keyframe definition like 
        the one used for PacMan could be added here.
      */}
    </>
  );
};

const CarouselSkeleton: React.FC<CarouselSkeletonProps> = ({ className }) => {
  return (
    <div
      // Using a lighter gray background and a soft pulse animation.
      // Height and width are driven by the className prop from the parent.
      // Increased border radius to rounded-2xl for more pronounced corners.
      className={`relative bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse ${className}`}
      role="status"
      aria-label="Loading image carousel"
    >
      <SleekSpinner />
      <span className="sr-only">Loading images...</span>
    </div>
  );
};

export default CarouselSkeleton; 