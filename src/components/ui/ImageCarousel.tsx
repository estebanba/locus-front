import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import './ImageCarousel.css'

const TWEEN_FACTOR_BASE = 0.2;

// SVG strings for cursors (white stroke for visibility on dark backdrop)
const chevronLeftSVG = "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='15 18 9 12 15 6'></polyline></svg>";
const chevronRightSVG = "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'></polyline></svg>";

const cursorLeft = `url("data:image/svg+xml;utf8,${encodeURIComponent(chevronLeftSVG)}") 16 16, auto`;
const cursorRight = `url("data:image/svg+xml;utf8,${encodeURIComponent(chevronRightSVG)}") 16 16, auto`;

interface ImageCarouselProps {
  images: string[];
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

  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const prevExpandedImageRef = useRef<string | null>(null);
  const [hoveredImageHalf, setHoveredImageHalf] = useState<'left' | 'right' | null>(null);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

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

  const handleThumbnailClick = (imageSrc: string) => {
    setExpandedImage(imageSrc);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
    setHoveredImageHalf(null);
  };

  const goToNextExpandedImage = useCallback(() => {
    if (!expandedImage) return;
    const currentIndex = images.indexOf(expandedImage);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % images.length;
    setExpandedImage(images[nextIndex]);
  }, [expandedImage, images]);

  const goToPrevExpandedImage = useCallback(() => {
    if (!expandedImage) return;
    const currentIndex = images.indexOf(expandedImage);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setExpandedImage(images[prevIndex]);
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
  const isChangingImageInModal = prevExpandedImageRef.current !== null && expandedImage !== null && prevExpandedImageRef.current !== expandedImage;

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

  const getCursorStyle = () => {
    if (hoveredImageHalf === 'left') return cursorLeft;
    if (hoveredImageHalf === 'right') return cursorRight;
    return 'pointer';
  };

  return (
    <div className={`embla ${containerClassName || ''}`.trim()}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {images.map((src, index) => (
            <div className="embla__slide" key={index}>
              <motion.div
                className="embla__parallax"
                onClick={() => handleThumbnailClick(src)}
                layoutId={`image-${index}`}
              >
                <div className="embla__parallax__layer">
                  <img
                    className={`embla__slide__img embla__parallax__img ${imageClassName || ''}`.trim()}
                    src={src}
                    alt={`${altText} - image ${index + 1}`}
                  />
                </div>
              </motion.div>
            </div>
          ))}
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

      <div className="embla__controls">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={('embla__dot').concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {expandedImage && (
          <motion.div
            className="expanded-image-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseExpandedImage}
          >
            <motion.img
              key={expandedImage} 
              src={expandedImage}
              alt={`${altText} - expanded image`}
              className="expanded-image-content"
              variants={imageAnimationVariants}
              initial={currentInitial}
              animate={currentAnimate}
              exit={currentExit}
              layoutId={(isOpeningModal || isClosingModal) ? `image-${images.indexOf(expandedImage)}` : undefined}
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
    </div>
  );
}; 