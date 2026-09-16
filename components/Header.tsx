'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Gamepad2, Compass, Maximize, Minimize, Sun, SunMedium } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';
import { useScreenControls } from '@/lib/screenManager';

interface HeaderProps {
  currentMode: 'gallery' | 'game';
  onModeChange: (mode: 'gallery' | 'game') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange }) => {
  const [isMuted, setIsMuted] = useState(false);
  const { isFullscreen, toggleFullscreen, isWakeLockActive, toggleWakeLock } = useScreenControls();

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
    if (!nextMuted) {
      audioEngine.playPopSound(580);
    }
  };

  const handleFullscreen = () => {
    audioEngine.playPopSound(540);
    toggleFullscreen();
  };

  const handleWakeLock = async () => {
    audioEngine.playPopSound(560);
    await toggleWakeLock();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-3 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Brand */}
        <div
          onClick={() => {
            audioEngine.playPopSound(500);
            onModeChange('gallery');
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-amber-500 text-xl sm:text-2xl shadow-sm group-hover:scale-105 transition-transform text-white">
            🦁
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Kids Zoo</span>
            </h1>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mode Switcher */}
          <div className="flex rounded-2xl bg-slate-100 p-0.5 sm:p-1 border border-slate-200">
            <button
              id="btn-mode-gallery"
              onClick={() => {
                audioEngine.playPopSound(440);
                onModeChange('gallery');
              }}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-bold transition-all ${
                currentMode === 'gallery'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
              <span>Animals</span>
            </button>

            <button
              id="btn-mode-game"
              onClick={() => {
                audioEngine.playPopSound(520);
                onModeChange('game');
              }}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-bold transition-all ${
                currentMode === 'game'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gamepad2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-500" />
              <span>Sound Quiz</span>
            </button>
          </div>

          {/* Always-On Screen (Wake Lock) Toggle */}
          <button
            id="btn-toggle-wake-lock"
            onClick={handleWakeLock}
            title={isWakeLockActive ? 'Always-On Screen: Active (No sleep)' : 'Always-On Screen: Inactive'}
            aria-label={isWakeLockActive ? 'Disable keep screen on' : 'Enable keep screen on'}
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border transition-all active:scale-95 shrink-0 ${
              isWakeLockActive
                ? 'bg-amber-100 border-amber-300 text-amber-900 ring-2 ring-amber-200/60 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {isWakeLockActive ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 animate-spin-slow" />
            ) : (
              <SunMedium className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>

          {/* Full Screen Mode Toggle */}
          <button
            id="btn-toggle-fullscreen"
            onClick={handleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
            aria-label={isFullscreen ? 'Exit full screen mode' : 'Enter full screen mode'}
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border transition-all active:scale-95 shrink-0 ${
              isFullscreen
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 ring-2 ring-indigo-200/60 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>

          {/* Sound Mute Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={toggleMute}
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border transition-all active:scale-95 shrink-0 ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
