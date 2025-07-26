import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType
} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import './ImageCarousel.css'
import { CloudinaryImage } from '../../services/api'
import CarouselSkeleton from './CarouselSkeleton'
import { ImageLightbox, type LightboxImage } from './ImageLightbox'

const TWEEN_FACTOR_BASE = 0.2;

interface ImageCarouselProps {
  images: CloudinaryImage[];
  altText: string;
  options?: EmblaOptionsType;
  containerClassName?: string;
  imageClassName?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = (props) => {
  const { images, altText, options, containerClassName, imageClassName } = props;

  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const [expandedImage, setExpandedImage] = useState<CloudinaryImage | null>(null);
  
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  // State to track loading
  const loadedCountRef = useRef(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(true);

  // Reset loading state when images prop changes
  useEffect(() => {
    console.log('[ImageCarousel] useEffect reset loading', { images });
    loadedCountRef.current = 0;
  }, [images]);

  // When the first image loads, start the fade-out transition
  useEffect(() => {
    if (firstImageLoaded) {
      const timeout = setTimeout(() => setSkeletonVisible(false), 500);
      return () => clearTimeout(timeout);
    } else {
      setSkeletonVisible(true);
    }
  }, [firstImageLoaded, images]);

  // Handler for each image's onLoad event
  const handleImageLoad = (index?: number) => {
    loadedCountRef.current += 1;
    if (index === 0) {
      setFirstImageLoaded(true);
    }
  };

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__parallax__layer') as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === 'scroll';

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
          const tweenNode = tweenNodes.current[slideIndex];
          if (tweenNode) {
            tweenNode.style.transform = `translateX(${translate}%)`;
          }
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax);
  }, [emblaApi, setTweenNodes, setTweenFactor, tweenParallax]);

  const handleThumbnailClick = (image: CloudinaryImage) => {
    setExpandedImage(image);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };

  // Convert CloudinaryImages to LightboxImages
  const lightboxImages: LightboxImage[] = images.map(image => ({
    id: image.public_id,
    src: image.secure_url,
    alt: `${altText} - ${image.public_id}`,
    width: image.width,
    height: image.height,
    // Include original CloudinaryImage data for reference
    originalImage: image,
  }));

  // Find the current lightbox image
  const currentLightboxImage = expandedImage 
    ? lightboxImages.find(img => (img.originalImage as CloudinaryImage).public_id === expandedImage.public_id) || null
    : null;

  // Handle lightbox image change
  const handleLightboxImageChange = (lightboxImage: LightboxImage) => {
    const originalImage = (lightboxImage.originalImage as CloudinaryImage);
    setExpandedImage(originalImage);
  };

  const uniquePhotographers = useMemo(() => {
    if (!images || images.length === 0) {
      return [];
    }
    const photographerSet = new Set<string>();
    images.forEach(image => {
      if (image.metadata && image.metadata.photographer && typeof image.metadata.photographer === 'string') {
        photographerSet.add(image.metadata.photographer);
      }
    });
    return Array.from(photographerSet);
  }, [images]);

  // Memoize the sorted images to avoid sorting on every render
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      const aNumber = parseInt(a.public_id.split("_")[1]);
      const bNumber = parseInt(b.public_id.split("_")[1]);
      return aNumber - bNumber;
    });
  }, [images]);

  return (
    <div className={`embla ${containerClassName || ''}`.trim()} style={{ position: 'relative' }}>
      <div className="embla__viewport" ref={emblaRef} style={{ position: 'relative' }}>
        {/* Overlay the skeleton with a smooth fade-out effect only */}
        {skeletonVisible && images.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              borderRadius: '1.5rem',
              transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
              opacity: firstImageLoaded ? 0 : 1,
              background: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
            }}
          >
            <CarouselSkeleton className="w-full h-[32vh] md:h-[48vh] rounded-2xl" />
          </div>
        )}
        <div className="embla__container">
          {sortedImages.map((image, index) => {
            if (!image || !image.secure_url) {
              return null;
            }
            return (
              <div className="embla__slide" key={image.public_id || `slide-${index}`}>
                <motion.div
                  className="embla__parallax"
                  onClick={() => handleThumbnailClick(image)}
                  layoutId={`image-${image.public_id || `layout-${index}`}`}
                >
                  <div className="embla__parallax__layer">
                    <img
                      className={`embla__slide__img embla__parallax__img ${imageClassName || ''}`.trim()}
                      src={image.secure_url}
                      alt={`${altText} - image ${index + 1}`}
                      onLoad={() => {
                        handleImageLoad(index);
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <PrevButton 
        onClick={onPrevButtonClick} 
        disabled={prevBtnDisabled} 
        className="embla__button--prev-side"
      />
      <NextButton 
        onClick={onNextButtonClick} 
        disabled={nextBtnDisabled} 
        className="embla__button--next-side"
      />

      {/* Unified ImageLightbox component */}
      <ImageLightbox
        image={currentLightboxImage}
        images={lightboxImages}
        onClose={handleCloseExpandedImage}
        onImageChange={handleLightboxImageChange}
        altText={altText}
        showNavigationHints={true}
      />

      {uniquePhotographers.length > 0 && (
        <p style={{ textAlign: 'left', fontStyle: 'italic', marginTop: '0.5rem', marginBottom: '1rem', color: 'lightgray' }}>
          Photographs by {
            uniquePhotographers.length === 1
              ? uniquePhotographers[0]
              : uniquePhotographers.slice(0, -1).join(', ') + ' and ' + uniquePhotographers[uniquePhotographers.length - 1]
          }
        </p>
      )}
    </div>
  );
}; 