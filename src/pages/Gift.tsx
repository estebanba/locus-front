import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Images to reveal (relative to public/img)
const images = [
  '/img/01 Large.png',
  '/img/02 Large.png',
  '/img/03 Large.png',
];

// Unicode birthday cake icon
const cakeIcon = '🎂';

// Mindful Boho color palette
const bohoBg = 'bg-[#F8F6F2]'; // soft off-white
const bohoCard = [
  'bg-[#E1A247]', // FEATHER
  'bg-[#7DAE99]', // FREE SPIRIT
  'bg-[#B6564C]', // GODDESS
];

// Font families (make sure to add Google Fonts in index.html)
// Header: Cormorant Garamond, Numbers/Footer: Quicksand

export default function Gift() {
  // Track which card is expanded (null = none)
  const [expanded, setExpanded] = useState<number | null>(null);

  // Handler for clicking a card
  const handleClick = (idx: number) => {
    setExpanded(idx);
  };

  // Handler for closing fullscreen
  const handleClose = () => {
    setExpanded(null);
  };

  return (
    <div className={`min-h-screen flex flex-col ${bohoBg}`}>
      {/* Header (fixed height, no shrink) */}
      <header className="flex flex-col items-center py-6 flex-shrink-0">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-[#2d2a32]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Feliz Cumple Mami!</h1>
          <span className="text-5xl ml-2" aria-label="Birthday cake" role="img">{cakeIcon}</span>
        </div>
        <span className="text-xl font-bold mb-2 tracking-tight text-[#2d2a32]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Revela tus sorpresas</span>
      </header>

      {/* Main: 3 stacked rectangles, grid layout, fill each cell */}
      <main className="flex-1 grid grid-rows-3 gap-4 px-4 w-full h-full">
        {[0, 1, 2].map((idx) => (
          <motion.div
            key={idx}
            layoutId={`gift-card-${idx}`}
            className={`relative w-full h-full rounded-2xl shadow-xl ${bohoCard[idx]} transition-shadow duration-300 cursor-pointer`}
            onClick={() => expanded === null && handleClick(idx)}
            whileHover={{ scale: expanded === null ? 1.03 : 1 }}
            whileTap={{ scale: expanded === null ? 0.97 : 1 }}
            style={{ zIndex: expanded === idx ? 50 : 1 }}
          >
            {/* Show number only if not expanded */}
            {expanded !== idx && (
              <div
                className={`flex items-center justify-center w-full h-full p-6 md:p-10 font-extrabold text-[8rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] tracking-tight select-none`}
                style={{ lineHeight: 1, fontFamily: 'Quicksand, sans-serif', color: '#F8F6F2' }}
              >
                {idx + 1}
              </div>
            )}
          </motion.div>
        ))}
        {/* Fullscreen overlay for expanded card */}
        <AnimatePresence>
          {expanded !== null && (
            <motion.div
              key="fullscreen"
              layoutId={`gift-card-${expanded}`}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 cursor-zoom-out"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
            >
              <motion.img
                src={images[expanded]}
                alt={`Regalo ${expanded + 1}`}
                className="object-contain w-full h-full rounded-2xl"
                draggable={false}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              />
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-lg bg-black/60 rounded px-3 py-1 font-['Quicksand',sans-serif]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Toca para cerrar</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer dedication - larger text, no shrink */}
      <footer className="text-center text-lg text-[#2d2a32] py-6 mt-8 font-semibold flex-shrink-0" style={{ fontFamily: 'Quicksand, sans-serif' }}>
        Con Amor de Nikita y Esteban 💜
      </footer>
    </div>
  );
} 