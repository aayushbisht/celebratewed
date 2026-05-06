import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useSlideshow — Manages a cycling slideshow through an array of photo URLs
 * with configurable interval, pause/resume, and manual prev/next.
 */
export function useSlideshow(photoUrls: string[], defaultInterval = 4000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalMs = useRef(defaultInterval);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    if (isPaused || photoUrls.length <= 1) return;

    intervalRef.current = setTimeout(() => {
      setPrevIndex((prev) => {
        // Use functional update to avoid stale closure
        return currentIndex;
      });
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % photoUrls.length);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 2000);
    }, intervalMs.current);
  }, [isPaused, photoUrls.length, currentIndex, clearTimer]);

  // Auto-advance
  useEffect(() => {
    if (!isPaused && photoUrls.length > 1) {
      scheduleNext();
    }
    return clearTimer;
  }, [isPaused, currentIndex, photoUrls.length, scheduleNext, clearTimer]);

  const next = useCallback(() => {
    setPrevIndex(currentIndex);
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % photoUrls.length);
    setTimeout(() => setIsTransitioning(false), 2000);
  }, [currentIndex, photoUrls.length]);

  const prev = useCallback(() => {
    setPrevIndex(currentIndex);
    setIsTransitioning(true);
    setCurrentIndex((p) => (p - 1 + photoUrls.length) % photoUrls.length);
    setTimeout(() => setIsTransitioning(false), 2000);
  }, [currentIndex, photoUrls.length]);

  const play = useCallback(() => {
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsPaused(true);
    clearTimer();
    setCurrentIndex(0);
    setPrevIndex(-1);
    setIsTransitioning(false);
    intervalMs.current = defaultInterval;
  }, [clearTimer, defaultInterval]);

  const setInterval_ = useCallback((ms: number) => {
    intervalMs.current = Math.max(500, ms);
  }, []);

  const speedUp = useCallback(() => {
    intervalMs.current = Math.max(500, intervalMs.current * 0.6);
  }, []);

  const slowDown = useCallback(() => {
    intervalMs.current = Math.min(8000, intervalMs.current * 1.5);
  }, []);

  return {
    currentUrl: photoUrls[currentIndex] || '',
    prevUrl: prevIndex >= 0 ? photoUrls[prevIndex] || '' : '',
    currentIndex,
    isTransitioning,
    isPaused,
    next,
    prev,
    play,
    pause,
    reset,
    setInterval: setInterval_,
    speedUp,
    slowDown,
    totalPhotos: photoUrls.length,
  };
}
