'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Gamepad2, Compass } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';

interface HeaderProps {
  currentMode: 'gallery' | 'game';
  onModeChange: (mode: 'gallery' | 'game') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
    if (!nextMuted) {
      audioEngine.playPopSound(580);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div
          onClick={() => {
            audioEngine.playPopSound(500);
            onModeChange('gallery');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-2xl shadow-sm group-hover:scale-105 transition-transform text-white">
            🦁
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Kids Zoo</span>
            </h1>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher */}
          <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
            <button
              id="btn-mode-gallery"
              onClick={() => {
                audioEngine.playPopSound(440);
                onModeChange('gallery');
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                currentMode === 'gallery'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="h-4 w-4 text-amber-600" />
              <span>Animals</span>
            </button>

            <button
              id="btn-mode-game"
              onClick={() => {
                audioEngine.playPopSound(520);
                onModeChange('game');
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                currentMode === 'game'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gamepad2 className="h-4 w-4 text-rose-500" />
              <span>Sound Quiz</span>
            </button>
          </div>

          {/* Sound Mute Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all active:scale-95 ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
