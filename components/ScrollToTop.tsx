'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioEngine } from '@/lib/audioEngine';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 240) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    audioEngine.playPopSound(640);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="btn-scroll-to-top"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          aria-label="Scroll to top"
          title="Back to top"
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-amber-500 text-amber-950 font-bold shadow-lg shadow-amber-500/25 border-2 border-amber-300/80 hover:bg-amber-400 hover:border-amber-200 transition-colors focus:outline-hidden focus:ring-4 focus:ring-amber-200"
        >
          <ArrowUp className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.75]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
