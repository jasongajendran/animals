'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useScreenControls() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [isWakeLockSupported] = useState(() => typeof window !== 'undefined' && 'wakeLock' in navigator);
  const wakeLockSentinelRef = useRef<any>(null);

  // Monitor fullscreen change events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFullscreenChange = () => {
      const isDocFull = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isDocFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Request Wake Lock
  const requestWakeLock = useCallback(async () => {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) return false;

    try {
      const sentinel = await (navigator as any).wakeLock.request('screen');
      wakeLockSentinelRef.current = sentinel;
      setIsWakeLockActive(true);

      sentinel.addEventListener('release', () => {
        setIsWakeLockActive(false);
        wakeLockSentinelRef.current = null;
      });

      return true;
    } catch (err) {
      console.warn('Screen Wake Lock request failed:', err);
      setIsWakeLockActive(false);
      return false;
    }
  }, []);

  // Release Wake Lock
  const releaseWakeLock = useCallback(async () => {
    if (wakeLockSentinelRef.current) {
      try {
        await wakeLockSentinelRef.current.release();
      } catch (err) {
        console.warn('Screen Wake Lock release failed:', err);
      }
      wakeLockSentinelRef.current = null;
    }
    setIsWakeLockActive(false);
  }, []);

  // Toggle Wake Lock
  const toggleWakeLock = useCallback(async () => {
    if (isWakeLockActive) {
      await releaseWakeLock();
      return false;
    } else {
      return await requestWakeLock();
    }
  }, [isWakeLockActive, releaseWakeLock, requestWakeLock]);

  // Re-acquire Wake Lock when window gains focus/visibility
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isWakeLockActive && !wakeLockSentinelRef.current) {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isWakeLockActive, requestWakeLock]);

  // Auto-acquire wake lock on first user touch/click interaction
  useEffect(() => {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) return;

    let hasInteracted = false;
    const handleFirstInteraction = async () => {
      if (hasInteracted) return;
      hasInteracted = true;
      await requestWakeLock();
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [requestWakeLock]);

  // Prevent page zooming (pinch zoom, trackpad pinch, gestures, and zoom keyboard shortcuts)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Prevent Safari gesture zoom
    const handleGesture = (e: Event) => {
      e.preventDefault();
    };

    // 2. Prevent trackpad pinch zoom (Ctrl + Mouse Wheel)
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // 3. Prevent multi-touch pinch to zoom
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // 4. Prevent keyboard zoom shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
      }
    };

    // 5. Prevent double-tap to zoom
    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        // Prevent default if not on an interactive form control
        const target = e.target as HTMLElement | null;
        if (!target?.matches('input, textarea, select')) {
          e.preventDefault();
        }
      }
      lastTouchEnd = now;
    };

    document.addEventListener('gesturestart', handleGesture, { passive: false } as any);
    document.addEventListener('gesturechange', handleGesture, { passive: false } as any);
    document.addEventListener('gestureend', handleGesture, { passive: false } as any);
    window.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', handleGesture);
      document.removeEventListener('gesturechange', handleGesture);
      document.removeEventListener('gestureend', handleGesture);
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;

    try {
      const doc = document as any;
      const docEl = document.documentElement as any;

      if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
        // Request fullscreen
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed (may be constrained in certain iFrames):', err);
    }
  }, []);

  return {
    isFullscreen,
    toggleFullscreen,
    isWakeLockActive,
    isWakeLockSupported,
    toggleWakeLock,
  };
}
