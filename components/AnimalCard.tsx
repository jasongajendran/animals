'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Animal } from '@/lib/animalsData';
import { audioEngine } from '@/lib/audioEngine';
import { playAnimalCelebration } from '@/lib/animalEffects';

interface AnimalCardProps {
  animal: Animal;
  onSelect: (animal: Animal) => void;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onSelect }) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isReadingAll, setIsReadingAll] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    return audioEngine.subscribeActiveAnimal((activeId, activeMode) => {
      const isThisAnimal = activeId === animal.id;
      setIsPlayingSound(isThisAnimal && activeMode === 'sound');
      setIsReadingAll(isThisAnimal && activeMode === 'all');
    });
  }, [animal.id]);

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();

    audioEngine.playAnimalSoundWithName(animal.id, animal.name, animal.soundType);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    playAnimalCelebration(animal, { x, y });
  };

  const handlePlayFullStory = (e: React.MouseEvent) => {
    e.stopPropagation();

    audioEngine.playAnimalSoundAndFact(animal.id, animal.name, animal.soundType, animal.funFact);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    playAnimalCelebration(animal, { x, y });
  };

  const isCardActive = isPlayingSound || isReadingAll;

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
        isCardActive ? 'border-amber-400 ring-4 ring-amber-100' : 'border-slate-200 hover:border-slate-300'
      } flex flex-col`}
    >
      {/* Image container: image takes full space with face visible top-aligned */}
      <div
        onClick={handlePlaySound}
        className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100 cursor-pointer"
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover object-[center_top] transition-transform duration-300 group-hover:scale-105 ${
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
      <div className="mt-3 flex items-center gap-2">
        {/* Play Sound Button */}
        <button
          id={`btn-sound-${animal.id}`}
          onClick={handlePlaySound}
          title={`Play ${animal.name} sound`}
          aria-label={`Play sound for ${animal.name}`}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-sm font-bold transition-all active:scale-95 ${
            isPlayingSound
              ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 shadow-xs'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/70'
          }`}
        >
          {isPlayingSound ? (
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-amber-950" />
          ) : (
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
          )}
          <span>{isPlayingSound ? 'Playing...' : 'Sound'}</span>
        </button>

        {/* Dedicated icon WITHOUT text to read facts too along with animal name sound and facts */}
        <button
          id={`btn-fact-${animal.id}`}
          onClick={handlePlayFullStory}
          title={`Listen to ${animal.name} name, sound and facts`}
          aria-label={`Listen to ${animal.name} name, sound and facts`}
          className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl transition-all active:scale-95 shrink-0 ${
            isReadingAll
              ? 'bg-sky-400 text-sky-950 ring-2 ring-sky-300 shadow-xs'
              : 'bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-900 border border-sky-200/80'
          }`}
        >
          {isReadingAll ? (
            <Sparkles className="h-5 w-5 animate-spin text-sky-950" />
          ) : (
            <BookOpen className="h-5 w-5 text-sky-700" />
          )}
        </button>
      </div>
    </motion.div>
  );
};
