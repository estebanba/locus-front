import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getItemImageUrls } from '@/services/api';

/**
 * Creates a transformed Cloudinary URL for a thumbnail.
 * Injects transformation parameters before the '/upload/' part of the URL.
 * @param secureUrl The original Cloudinary image URL.
 * @returns The transformed URL for a smaller, optimized image.
 */
const generateThumbnailUrl = (secureUrl: string): string => {
  // Transformation: width=400, format=auto, quality=auto
  const transformation = "w_400,f_auto,q_auto";
  return secureUrl.replace("/upload/", `/upload/${transformation}/`);
};

interface CardWrapperProps {
  /**
   * The URL to navigate to when the card is clicked
   */
  to: string;
  /**
   * Content to render inside the clickable card
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes to apply to the wrapper
   */
  className?: string;
  /**
   * Whether this is the last card in a list (removes bottom border)
   */
  isLast?: boolean;
  /**
   * Image configuration for tooltip
   */
  imageConfig?: {
    /**
     * Direct image URL (for blog posts with socialImage)
     */
    directImageUrl?: string;
    /**
     * Cloudinary configuration (for work/projects)
     */
    cloudinary?: {
      imagesPath: string;
      name: string;
    };
    /**
     * Alt text for the image
     */
    alt: string;
  };
}

/**
 * CardWrapper component - Provides consistent clickable and hoverable behavior
 * for all card types across the application. Supports optional image tooltips
 * with preloading for better user experience.
 */
export const CardWrapper: React.FC<CardWrapperProps> = ({
  to,
  children,
  className = "",
  isLast = false,
  imageConfig
}) => {
  const [tooltipImageUrl, setTooltipImageUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [randomIndex] = useState(() => Math.random()); // Generate once on mount

  // Preload image when component mounts
  useEffect(() => {
    const loadImage = async () => {
      if (!imageConfig) return;

      try {
        let imageUrl: string | null = null;

        if (imageConfig.directImageUrl) {
          // For blog posts with direct socialImage URL
          imageUrl = imageConfig.directImageUrl;
        } else if (imageConfig.cloudinary) {
          // For work/projects with Cloudinary images
          const { imagesPath, name } = imageConfig.cloudinary;
          const cloudinaryImages = await getItemImageUrls(`${imagesPath}${name}`);
          if (cloudinaryImages.length > 0) {
            // Use pre-generated random index to avoid flickering but ensure randomness between visits
            const imageIndex = Math.floor(randomIndex * cloudinaryImages.length);
            imageUrl = cloudinaryImages[imageIndex].secure_url;
          }
        }

        if (imageUrl) {
          const thumbnailUrl = generateThumbnailUrl(imageUrl);
          // Preload the image
          const img = new Image();
          img.onload = () => {
            setTooltipImageUrl(thumbnailUrl);
            setImageLoaded(true);
          };
          img.onerror = () => {
            console.warn('Failed to load tooltip image:', thumbnailUrl);
          };
          img.src = thumbnailUrl;
        }
      } catch (error) {
        console.warn('Error loading tooltip image:', error);
      }
    };

    loadImage();
  }, [imageConfig, randomIndex]);

  const cardContent = (
    <Link 
      to={to}
      className={`
        block py-4 border-b border-border hover:bg-accent/50 transition-colors px-2 -mx-2
        ${isLast ? 'border-b-0' : ''}
        ${className}
      `}
    >
      {children}
    </Link>
  );

  // Always return consistent structure with TooltipProvider
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        {/* Only show tooltip content if we have a loaded image */}
        {imageConfig && tooltipImageUrl && imageLoaded && (
          <TooltipContent 
            side="left" 
            align="start"
            sideOffset={20}
            className="p-0 border-0 bg-transparent shadow-lg"
          >
            <img 
              src={tooltipImageUrl} 
              alt={imageConfig.alt}
              className="w-72 sm:w-80 lg:w-96 object-cover rounded-md shadow-lg"
            />
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}; 