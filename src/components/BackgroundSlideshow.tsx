import { useEffect, useRef, useState, useCallback } from 'react';

interface BackgroundSlideshowProps {
  currentUrl: string;
  prevUrl: string;
  isTransitioning: boolean;
  isActive: boolean;
}

/**
 * Full-screen background that cross-fades between two photo layers.
 * Uses the same two-step load-then-reveal approach as PhotoFrame.
 */
export function BackgroundSlideshow({
  currentUrl,
  prevUrl,
  isTransitioning,
  isActive,
}: BackgroundSlideshowProps) {
  const [activeLayer, setActiveLayer] = useState<'A' | 'B'>('A');
  const [srcA, setSrcA] = useState('');
  const [srcB, setSrcB] = useState('');
  const pendingLayerRef = useRef<'A' | 'B' | null>(null);
  const isFirstLoad = useRef(true);
  const lastUrl = useRef('');

  // Step 1: Set new URL on the hidden layer (don't reveal yet)
  useEffect(() => {
    if (!currentUrl || currentUrl === lastUrl.current) return;
    lastUrl.current = currentUrl;

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      setSrcA(currentUrl);
      pendingLayerRef.current = 'A';
      return;
    }

    if (activeLayer === 'A') {
      setSrcB(currentUrl);
      pendingLayerRef.current = 'B';
    } else {
      setSrcA(currentUrl);
      pendingLayerRef.current = 'A';
    }
  }, [currentUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 2: Reveal only when the <img> onLoad fires
  const handleLayerALoad = useCallback(() => {
    if (pendingLayerRef.current === 'A') {
      pendingLayerRef.current = null;
      setActiveLayer('A');
    }
  }, []);

  const handleLayerBLoad = useCallback(() => {
    if (pendingLayerRef.current === 'B') {
      pendingLayerRef.current = null;
      setActiveLayer('B');
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      isFirstLoad.current = true;
      lastUrl.current = '';
      pendingLayerRef.current = null;
      setSrcA('');
      setSrcB('');
    }
  }, [isActive]);

  if (!isActive) {
    return (
      <div className="fixed inset-0 z-0 bg-[var(--bg-primary)]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(212,165,116,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(176,122,161,0.1) 0%, transparent 60%)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Layer A */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
        style={{ opacity: activeLayer === 'A' ? 1 : 0 }}
      >
        {srcA && (
          <img
            src={srcA}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.75) saturate(1.2)' }}
            onLoad={handleLayerALoad}
          />
        )}
      </div>

      {/* Layer B */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
        style={{ opacity: activeLayer === 'B' ? 1 : 0 }}
      >
        {srcB && (
          <img
            src={srcB}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.75) saturate(1.2)' }}
            onLoad={handleLayerBLoad}
          />
        )}
      </div>

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.1) 40%, rgba(10,10,15,0.4) 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(10,10,15,0.5) 100%)',
        }}
      />
    </div>
  );
}
