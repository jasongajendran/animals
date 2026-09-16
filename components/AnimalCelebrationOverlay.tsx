'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeCelebration, AnimalCelebrationData } from '@/lib/animalEffects';

interface ActiveParticle {
  id: string;
  emoji: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  rotateStart: number;
  rotateEnd: number;
  scaleStart: number;
  scalePeak: number;
  scaleEnd: number;
  duration: number;
  delay: number;
  size: number;
}

interface ActiveCelebration {
  id: string;
  data: AnimalCelebrationData;
  particles: ActiveParticle[];
  createdAt: number;
}

export const AnimalCelebrationOverlay: React.FC = () => {
  const [celebrations, setCelebrations] = useState<ActiveCelebration[]>([]);

  const handleNewCelebration = useCallback((data: AnimalCelebrationData) => {
    const celebrationId = `${data.id}-${Date.now()}-${Math.random()}`;

    const originPxX = data.origin.x * (typeof window !== 'undefined' ? window.innerWidth : 400);
    const originPxY = data.origin.y * (typeof window !== 'undefined' ? window.innerHeight : 800);

    const particles: ActiveParticle[] = data.floatingItems.map((item, idx) => {
      const angle = (idx / data.floatingItems.length) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      let dist = 100 + Math.random() * 120;
      let targetX = originPxX + Math.cos(angle) * dist;
      let targetY = originPxY + Math.sin(angle) * dist;
      let duration = 1.2 + Math.random() * 0.4;
      let delay = idx * 0.04;

      // Trajectory physics customization per animation type
      if (data.animationType === 'splash') {
        // Upward geyser spray
        targetX = originPxX + (idx % 2 === 0 ? 1 : -1) * (40 + Math.random() * 110);
        targetY = originPxY - (120 + Math.random() * 180);
      } else if (data.animationType === 'banana_hop' || data.animationType === 'spring_bounce') {
        // Bouncy spring hop upwards and outwards
        const direction = (idx % 3) - 1;
        targetX = originPxX + direction * (80 + Math.random() * 90);
        targetY = originPxY - (110 + Math.random() * 140);
      } else if (data.animationType === 'snow_fall') {
        // Arctic snowfall descending
        targetX = originPxX + (Math.random() * 160 - 80);
        targetY = originPxY + (80 + Math.random() * 140);
        duration = 1.5;
      } else if (data.animationType === 'feather_drift' || data.animationType === 'leaf_flutter') {
        // Gentle swaying float
        targetX = originPxX + (Math.random() * 180 - 90);
        targetY = originPxY - (60 + Math.random() * 120);
        duration = 1.4;
      } else if (data.animationType === 'bubble_float') {
        // Ocean bubbles rising to surface
        targetX = originPxX + (Math.random() * 100 - 50);
        targetY = originPxY - (130 + Math.random() * 150);
        duration = 1.4;
      }

      return {
        id: `${celebrationId}-p-${idx}`,
        emoji: item,
        startX: originPxX,
        startY: originPxY,
        targetX,
        targetY,
        rotateStart: (Math.random() - 0.5) * 40,
        rotateEnd: (Math.random() - 0.5) * 180,
        scaleStart: 0.3,
        scalePeak: 1.4,
        scaleEnd: 0.9,
        duration,
        delay,
        size: idx === 0 ? 56 : 46, // Prominent large icons (46-56px) for crisp phone visibility
      };
    });

    const newCelebration: ActiveCelebration = {
      id: celebrationId,
      data,
      particles,
      createdAt: Date.now(),
    };

    setCelebrations((prev) => [...prev.slice(-2), newCelebration]);

    setTimeout(() => {
      setCelebrations((prev) => prev.filter((c) => c.id !== celebrationId));
    }, 1800);
  }, []);

  useEffect(() => {
    return subscribeCelebration(handleNewCelebration);
  }, [handleNewCelebration]);

  return (
    <div
      id="animal-celebration-overlay"
      className="fixed inset-0 pointer-events-none z-90 overflow-hidden select-none"
      aria-hidden="true"
    >
      <AnimatePresence>
        {celebrations.map((celeb) => {
          const originX = celeb.data.origin.x * 100;
          const originY = celeb.data.origin.y * 100;
          // Keep banner safely away from viewport edges so full text is always visible
          const safeBannerX = Math.min(Math.max(originX, 28), 72);
          const safeBannerY = Math.max(originY, 14);

          return (
            <React.Fragment key={celeb.id}>
              {/* Radial ambient pulse at touch point */}
              <motion.div
                initial={{ scale: 0.2, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  left: `${originX}%`,
                  top: `${originY}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '160px',
                  height: '160px',
                  borderRadius: '9999px',
                  background: `radial-gradient(circle, ${celeb.data.themeColor}88 0%, transparent 70%)`,
                }}
              />

              {/* Large, High-Contrast Distinct Action Banner Tag - Centered via Flexbox Wrapper */}
              <div className="fixed top-14 sm:top-18 inset-x-0 flex justify-center items-center pointer-events-none z-90 px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.75, y: -15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -20 }}
                  transition={{ duration: 0.35, ease: 'backOut' }}
                  className="relative flex items-center justify-center gap-2.5 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-2xl border-2 border-white/95 text-white font-extrabold text-sm sm:text-base md:text-lg backdrop-blur-md min-h-[46px] sm:min-h-[52px] max-w-[92vw] overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${celeb.data.accentBg} opacity-95 -z-10 shadow-lg`}
                  />
                  <span className="text-2xl sm:text-3xl drop-shadow-md shrink-0 select-none">{celeb.data.emoji}</span>
                  <span className="tracking-wide text-white drop-shadow font-extrabold whitespace-nowrap text-center">
                    {celeb.data.tagline}
                  </span>
                </motion.div>
              </div>

              {/* High-Definition, Large Floating Visual Particles */}
              {celeb.particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{
                    x: p.startX - p.size / 2,
                    y: p.startY - p.size / 2,
                    opacity: 0,
                    scale: p.scaleStart,
                    rotate: p.rotateStart,
                  }}
                  animate={{
                    x: p.targetX - p.size / 2,
                    y: p.targetY - p.size / 2,
                    opacity: [0, 1, 1, 0],
                    scale: [p.scaleStart, p.scalePeak, p.scaleEnd, 0.4],
                    rotate: p.rotateEnd,
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    times: [0, 0.2, 0.7, 1],
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    fontSize: `${p.size}px`,
                    lineHeight: 1,
                    filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.35))',
                    transformOrigin: 'center center',
                    willChange: 'transform, opacity',
                  }}
                >
                  {p.emoji}
                </motion.div>
              ))}
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
