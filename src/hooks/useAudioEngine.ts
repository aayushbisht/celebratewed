import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * useAudioEngine — Manages audio playback via HTML5 Audio with playbackRate
 * manipulation for the scratch effect. Falls back gracefully when Web Audio
 * context is unavailable.
 */
export function useAudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const rafRef = useRef<number>(0);
  const targetRateRef = useRef(1);
  const currentRateRef = useRef(1);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.volume = 0.7;
    audioRef.current = audio;

    const handleCanPlay = () => setIsReady(true);
    const handleEnded = () => {
      setIsPlaying(false);
      // Loop the track
      audio.currentTime = 0;
      audio.play().catch(() => {});
      setIsPlaying(true);
    };
    const handleDurationChange = () => setDuration(audio.duration || 0);

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('durationchange', handleDurationChange);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.pause();
      audio.src = '';
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Track progress via requestAnimationFrame
  useEffect(() => {
    const tick = () => {
      if (audioRef.current && isPlaying) {
        setProgress(audioRef.current.currentTime);

        // Smoothly interpolate playback rate
        const diff = targetRateRef.current - currentRateRef.current;
        if (Math.abs(diff) > 0.01) {
          currentRateRef.current += diff * 0.15;
          audioRef.current.playbackRate = Math.max(0.1, Math.min(4, currentRateRef.current));
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  const loadTrack = useCallback((url: string) => {
    if (!audioRef.current) return;
    setIsReady(false);
    setIsPlaying(false);
    setProgress(0);
    audioRef.current.pause();
    audioRef.current.src = url;
    audioRef.current.load();
    targetRateRef.current = 1;
    currentRateRef.current = 1;
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn('Audio play failed:', err);
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    targetRateRef.current = 1;
    currentRateRef.current = 1;
    audioRef.current.playbackRate = 1;
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    targetRateRef.current = rate;
    // Also directly set for immediate response during scratch
    if (audioRef.current) {
      audioRef.current.playbackRate = Math.max(0.1, Math.min(4, rate));
      currentRateRef.current = rate;
    }
  }, []);

  const resetPlaybackRate = useCallback(() => {
    targetRateRef.current = 1;
  }, []);

  return {
    loadTrack,
    play,
    pause,
    stop,
    setPlaybackRate,
    resetPlaybackRate,
    isReady,
    isPlaying,
    progress,
    duration,
  };
}
