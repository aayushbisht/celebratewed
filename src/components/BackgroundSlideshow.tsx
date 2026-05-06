import { useEffect, useRef, useState } from 'react';

interface BackgroundSlideshowProps {
  currentUrl: string;
  prevUrl: string;
  isTransitioning: boolean;
  isActive: boolean;
}

/**
 * Full-screen background that cross-fades between two photo layers.
 * Uses stable src per layer — only toggles opacity after image is pre-loaded.
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
  const isFirstLoad = useRef(true);
  const lastUrl = useRef('');

  useEffect(() => {
    if (!currentUrl || currentUrl === lastUrl.current) return;
    lastUrl.current = currentUrl;

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      setSrcA(currentUrl);
      setActiveLayer('A');
      return;
    }

    const img = new Image();
    img.src = currentUrl;
    const targetUrl = currentUrl;

    img.onload = () => {
      setActiveLayer((prev) => {
        if (prev === 'A') {
          setSrcB(targetUrl);
        } else {
          setSrcA(targetUrl);
        }
        return prev === 'A' ? 'B' : 'A';
      });
    };
  }, [currentUrl]);

  useEffect(() => {
    if (!isActive) {
      isFirstLoad.current = true;
      lastUrl.current = '';
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
