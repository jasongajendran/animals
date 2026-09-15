'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Volume2, Sparkles, ChevronLeft, ChevronRight, X, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Animal } from '@/lib/animalsData';
import { audioEngine } from '@/lib/audioEngine';

interface AnimalDetailModalProps {
  animal: Animal | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const AnimalDetailModal: React.FC<AnimalDetailModalProps> = ({
  animal,
  onClose,
  onPrev,
  onNext,
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isReadingFact, setIsReadingFact] = useState(false);
  const [erroredIds, setErroredIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    return () => {
      audioEngine.stopAllAudio();
    };
  }, [animal?.id]);

  if (!animal) return null;
  const hasError = !!erroredIds[animal.id];

  const handlePlaySound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlayingSound(true);
    audioEngine.playAnimalSound(animal.soundType, () => {
      setIsPlayingSound(false);
    });

    confetti({
      particleCount: 24,
      spread: 55,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
    });

    setTimeout(() => {
      setIsPlayingSound(false);
    }, 1200);
  };

  const handleSpeakName = () => {
    audioEngine.playPopSound(520);
    audioEngine.speakText(animal.name);
  };

  const handleReadFact = () => {
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div
          className="absolute inset-0"
          onClick={() => {
            audioEngine.stopAllAudio();
            onClose();
          }}
        />

        <motion.div
          id="animal-spotlight-modal"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-200 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">{animal.emoji}</span>
              <h2 className="text-2xl font-bold text-slate-900 leading-none">
                {animal.name}
              </h2>
            </div>

            <button
              id="btn-modal-close"
              onClick={() => {
                audioEngine.stopAllAudio();
                onClose();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors active:scale-95"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Image */}
            <div
              onClick={() => handlePlaySound()}
              className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 cursor-pointer group"
            >
              {hasError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                  <span className="text-6xl">{animal.emoji}</span>
                </div>
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${animal.imageUrl}`}
                  alt={animal.name}
                  fill
                  unoptimized
                  priority
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() =>
                    setErroredIds((prev) => ({ ...prev, [animal.id]: true }))
                  }
                />
              )}
            </div>

            {/* Content & Actions */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Sound button */}
                <button
                  id="btn-modal-play-sound"
                  onClick={() => handlePlaySound()}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-base font-bold shadow-xs transition-all active:scale-95 ${
                    isPlayingSound
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {isPlayingSound ? (
                    <>
                      <Sparkles className="h-5 w-5 animate-spin text-amber-950" />
                      <span>Playing Sound...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-5 w-5" />
                      <span>Play Sound</span>
                    </>
                  )}
                </button>

                {/* Pronounce button */}
                <button
                  id="btn-modal-pronounce"
                  onClick={handleSpeakName}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-4 text-sm font-semibold transition-all active:scale-95 border border-slate-200"
                >
                  <Volume2 className="h-4 w-4 text-slate-600" />
                  <span>Pronounce Name</span>
                </button>
              </div>

              {/* Fact Box */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex flex-col justify-between">
                <p className="text-base text-slate-800 leading-relaxed font-medium">
                  {animal.funFact}
                </p>

                <button
                  id="btn-modal-read-fact"
                  onClick={handleReadFact}
                  className={`mt-3.5 flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-sm font-bold transition-all active:scale-95 ${
                    isReadingFact
                      ? 'bg-sky-400 text-sky-950 ring-2 ring-sky-300'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                  }`}
                >
                  <BookOpen className="h-4 w-4 text-slate-600" />
                  <span>{isReadingFact ? 'Playing Fact...' : 'Read Fact'}</span>
                </button>
              </div>

              {/* Prev / Next controls */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  id="btn-modal-prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    audioEngine.stopAllAudio();
                    setIsPlayingSound(false);
                    setIsReadingFact(false);
                    audioEngine.playPopSound(380);
                    onPrev();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 font-bold transition-colors active:scale-95 text-sm border border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <button
                  id="btn-modal-next"
                  onClick={(e) => {
                    e.stopPropagation();
                    audioEngine.stopAllAudio();
                    setIsPlayingSound(false);
                    setIsReadingFact(false);
                    audioEngine.playPopSound(420);
                    onNext();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 font-bold transition-colors active:scale-95 text-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
