import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType
} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import './ImageCarousel.css'
import { CloudinaryImage } from '../../services/api'
import CarouselSkeleton from './CarouselSkeleton'

const TWEEN_FACTOR_BASE = 0.2;

// SVG strings for cursors (white stroke for visibility on dark backdrop)
const chevronLeftSVG = "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='15 18 9 12 15 6'></polyline></svg>";
const chevronRightSVG = "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'></polyline></svg>";

const cursorLeft = `url("data:image/svg+xml;utf8,${encodeURIComponent(chevronLeftSVG)}") 16 16, auto`;
const cursorRight = `url("data:image/svg+xml;utf8,${encodeURIComponent(chevronRightSVG)}") 16 16, auto`;

interface ImageCarouselProps {
  images: CloudinaryImage[];
  altText: string;
  options?: EmblaOptionsType;
  containerClassName?: string;
  imageClassName?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = (props) => {
  const { images, altText, options, containerClassName, imageClassName } = props;
  // Debug: Log on every render
  console.log('[ImageCarousel] render', { images, allImagesLoaded: undefined }); // allImagesLoaded will be defined below

  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const [expandedImage, setExpandedImage] = useState<CloudinaryImage | null>(null);
  const prevExpandedImageRef = useRef<CloudinaryImage | null>(null);
  const [hoveredImageHalf, setHoveredImageHalf] = useState<'left' | 'right' | null>(null);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  // State to track if all images are loaded
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  // Ref to track how many images have loaded, avoids unnecessary re-renders
  const loadedCountRef = useRef(0);
  // State to track if the first image is loaded (for smooth transition)
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  // State to trigger the fade-out animation
  const [skeletonVisible, setSkeletonVisible] = useState(true);

  // Debug: Log after state is defined
  console.log('[ImageCarousel] after state', { images, allImagesLoaded });

  // Reset loading state when images prop changes
  useEffect(() => {
    console.log('[ImageCarousel] useEffect reset loading', { images });
    setAllImagesLoaded(false);
    loadedCountRef.current = 0;
  }, [images]);

  // When the first image loads, start the fade-out transition
  useEffect(() => {
    if (firstImageLoaded) {
      // Start fade-out after a short delay for effect
      const timeout = setTimeout(() => setSkeletonVisible(false), 500); // 500ms fade
      return () => clearTimeout(timeout);
    } else {
      setSkeletonVisible(true); // Reset if images change
    }
  }, [firstImageLoaded, images]);

  // Handler for each image's onLoad event
  const handleImageLoad = (index?: number) => {
    loadedCountRef.current += 1;
    // When all images are loaded, set allImagesLoaded to true
    if (loadedCountRef.current >= images.length) {
      setAllImagesLoaded(true);
    }
    // When the first image is loaded, trigger the transition
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

  useEffect(() => {
    prevExpandedImageRef.current = expandedImage;
  }, [expandedImage]);

  const handleThumbnailClick = (image: CloudinaryImage) => {
    setExpandedImage(image);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
    setHoveredImageHalf(null);
  };

  const goToNextExpandedImage = useCallback(() => {
    if (!expandedImage) return;
    const currentIndex = images.findIndex(img => img.public_id === expandedImage.public_id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % images.length;
    const nextImage = images[nextIndex];
    setExpandedImage(nextImage);
  }, [expandedImage, images]);

  const goToPrevExpandedImage = useCallback(() => {
    if (!expandedImage) return;
    const currentIndex = images.findIndex(img => img.public_id === expandedImage.public_id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const prevImage = images[prevIndex];
    setExpandedImage(prevImage);
  }, [expandedImage, images]);

  const handleExpandedImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    const target = event.target as HTMLImageElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const midpoint = rect.width / 2;

    if (clickX < midpoint) {
      goToPrevExpandedImage();
    } else {
      goToNextExpandedImage();
    }
  };

  const handleExpandedImageMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
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

  const handleExpandedImageMouseLeave = () => {
    setHoveredImageHalf(null);
  };

  const isOpeningModal = prevExpandedImageRef.current === null && expandedImage !== null;
  const isClosingModal = prevExpandedImageRef.current !== null && expandedImage === null;
  const isChangingImageInModal = prevExpandedImageRef.current !== null && expandedImage !== null && prevExpandedImageRef.current.public_id !== expandedImage.public_id;

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

  const getCursorStyle = () => {
    if (hoveredImageHalf === 'left') return cursorLeft;
    if (hoveredImageHalf === 'right') return cursorRight;
    return 'pointer';
  };

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
          {images.map((image, index) => {
            if (!image || !image.secure_url) {
              console.error("Skipping rendering of an image due to missing data:", image);
              return null;
            }
            // Debug: Log each image being rendered
            console.log("Rendering image", { index, src: image.secure_url, public_id: image.public_id });
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
                      // Attach onLoad to track when each image finishes loading
                      onLoad={() => {
                        console.log('Image loaded', { index, src: image.secure_url, public_id: image.public_id });
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

      <AnimatePresence mode="wait">
        {expandedImage && expandedImage.secure_url && (
          <motion.div
            className="expanded-image-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseExpandedImage}
          >
            <motion.img
              key={expandedImage.public_id || 'expanded-image'}
              src={expandedImage.secure_url}
              alt={`${altText} - expanded image`}
              className="expanded-image-content"
              variants={imageAnimationVariants}
              initial={currentInitial}
              animate={currentAnimate}
              exit={currentExit}
              layoutId={(isOpeningModal || isClosingModal) ? `image-${expandedImage.public_id || 'expanded-layout'}` : undefined}
              onClick={handleExpandedImageClick}
              onMouseMove={handleExpandedImageMouseMove}
              onMouseLeave={handleExpandedImageMouseLeave}
              style={{ cursor: getCursorStyle() }}
            />
            <motion.button
              className="expanded-image-close-button"
              onClick={handleCloseExpandedImage}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <X size={32} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

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