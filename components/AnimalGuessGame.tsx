'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Volume2, RefreshCw, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Animal, ANIMALS } from '@/lib/animalsData';
import { audioEngine } from '@/lib/audioEngine';
import { playAnimalCelebration } from '@/lib/animalEffects';

function generateRound() {
  const targetIndex = Math.floor(Math.random() * ANIMALS.length);
  const target = ANIMALS[targetIndex];

  const otherAnimals = ANIMALS.filter((a) => a.id !== target.id);
  const shuffledOthers = [...otherAnimals].sort(() => 0.5 - Math.random());
  const distractors = shuffledOthers.slice(0, 2);

  const roundOptions = [target, ...distractors].sort(() => 0.5 - Math.random());
  return { target, roundOptions };
}

export const AnimalGuessGame: React.FC = () => {
  const [roundData, setRoundData] = useState(() => generateRound());
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stars, setStars] = useState(0);

  const currentAnimal = roundData.target;
  const options = roundData.roundOptions;

  const startNewRound = useCallback(() => {
    setIsAnswered(false);
    setIsCorrect(null);
    setSelectedId(null);
    const newRound = generateRound();
    setRoundData(newRound);

    setTimeout(() => {
      audioEngine.playAnimalSound(newRound.target.soundType);
    }, 400);
  }, []);

  const handlePlaySoundAgain = () => {
    if (!currentAnimal) return;
    audioEngine.playAnimalSound(currentAnimal.soundType);
  };

  const handleSelectOption = (animal: Animal) => {
    if (isAnswered) return;
    setSelectedId(animal.id);

    if (currentAnimal && animal.id === currentAnimal.id) {
      setIsAnswered(true);
      setIsCorrect(true);
      setStars((prev) => prev + 1);

      audioEngine.playCheerFanfare();
      audioEngine.speakText(`Correct! It is the ${animal.name}!`);
      playAnimalCelebration(animal, { x: 0.5, y: 0.6 });

      setTimeout(() => {
        startNewRound();
      }, 2000);
    } else {
      setIsCorrect(false);
      audioEngine.playPopSound(300);
      audioEngine.speakText(`That is the ${animal.name}. Try again!`);
    }
  };

  return (
    <div id="animal-guess-game-container" className="mx-auto max-w-3xl py-4 px-2">
      {/* Game Card */}
      <div className="rounded-2xl bg-amber-500 p-6 shadow-sm text-white text-center mb-6 relative">
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-slate-800 font-bold shadow-xs text-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
          <span>{stars}</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-1">
          Guess the Sound
        </h2>
        <p className="text-sm text-amber-100 mb-4">
          Listen to the sound and choose the matching animal.
        </p>

        <div className="flex justify-center">
          <button
            id="btn-play-mystery-sound"
            onClick={handlePlaySoundAgain}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-sm hover:bg-amber-50 transition-colors active:scale-95"
          >
            <Volume2 className="h-4 w-4 text-amber-600" />
            <span>Play Sound</span>
          </button>
        </div>
      </div>

      {/* 3 Animal Choice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isTarget = currentAnimal?.id === opt.id;

          let cardBorder = 'border-slate-200 hover:border-slate-300';
          if (isSelected && isAnswered && isCorrect) {
            cardBorder = 'border-emerald-500 ring-4 ring-emerald-100';
          } else if (isSelected && !isCorrect) {
            cardBorder = 'border-rose-400 ring-4 ring-rose-100';
          }

          return (
            <motion.div
              key={opt.id}
              id={`game-option-${opt.id}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectOption(opt)}
              className={`relative cursor-pointer overflow-hidden rounded-2xl bg-white p-3 shadow-xs transition-all duration-200 border ${cardBorder} flex flex-col items-center text-center`}
            >
              {isAnswered && isTarget && (
                <div className="absolute top-3 right-3 z-20 rounded-full bg-emerald-500 p-1 text-white shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}

              <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100 mb-2.5">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${opt.imageUrl}`}
                  alt={opt.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-[center_top]"
                />
              </div>

              <div className="flex items-center gap-1.5 py-1">
                <span className="text-lg select-none">{opt.emoji}</span>
                <h3 className="text-base font-bold text-slate-900">{opt.name}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Next round control */}
      <div className="mt-6 flex items-center justify-center">
        <button
          id="btn-next-round"
          onClick={() => {
            audioEngine.playPopSound(460);
            startNewRound();
          }}
          className="flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors active:scale-95 shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Next</span>
        </button>
      </div>
    </div>
  );
};
