'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Animal } from '@/lib/animalsData';
import { audioEngine } from '@/lib/audioEngine';

interface AnimalCardProps {
  animal: Animal;
  onSelect: (animal: Animal) => void;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onSelect }) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isReadingFact, setIsReadingFact] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingSound(true);

    audioEngine.playAnimalSound(animal.soundType, () => {
      setIsPlayingSound(false);
    });

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 20,
      spread: 45,
      origin: { x, y },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      ticks: 50,
      gravity: 1.2,
      scalar: 0.8,
    });

    setTimeout(() => {
      setIsPlayingSound(false);
    }, 1200);
  };

  const handleReadFact = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReadingFact(true);

    audioEngine.speakFunFact(
      animal.funFact,
      () => {
        setIsReadingFact(true);
      },
      () => {
        setIsReadingFact(false);
      }
    );
  };

  return (
    <motion.div
      id={`animal-card-${animal.id}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => {
        audioEngine.playPopSound(440);
        onSelect(animal);
      }}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-3.5 shadow-sm transition-all duration-200 hover:shadow-md border ${
        isPlayingSound ? 'border-amber-400 ring-4 ring-amber-100' : 'border-slate-200 hover:border-slate-300'
      } flex flex-col`}
    >
      {/* Image container */}
      <div
        onClick={handlePlaySound}
        className="relative aspect-[3/2] sm:aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 cursor-pointer"
      >
        {(!imageLoaded || hasError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 z-0">
            <span className="text-4xl select-none animate-pulse">{animal.emoji}</span>
          </div>
        )}
        {!hasError && (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${animal.imageUrl}`}
            alt={animal.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setHasError(true)}
          />
        )}
      </div>

      {/* Animal Name */}
      <div className="mt-3 flex items-center justify-between px-0.5">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight flex items-center gap-1.5">
          <span>{animal.name}</span>
        </h3>
        <span className="text-2xl sm:text-3xl select-none">{animal.emoji}</span>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          id={`btn-sound-${animal.id}`}
          onClick={handlePlaySound}
          aria-label={`Sound for ${animal.name}`}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-bold transition-all active:scale-95 ${
            isPlayingSound
              ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
          }`}
        >
          {isPlayingSound ? (
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-amber-950" />
          ) : (
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
          )}
          <span>Sound</span>
        </button>

        <button
          id={`btn-fact-${animal.id}`}
          onClick={handleReadFact}
          aria-label={`Fact for ${animal.name}`}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-bold transition-all active:scale-95 ${
            isReadingFact
              ? 'bg-sky-400 text-sky-950 ring-2 ring-sky-300'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
          <span>{isReadingFact ? 'Playing...' : 'Fact'}</span>
        </button>
      </div>
    </motion.div>
  );
};
