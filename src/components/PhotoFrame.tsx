import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ImageIcon, Loader2 } from 'lucide-react';

interface PhotoFrameProps {
  currentUrl: string;
  prevUrl: string;
  isActive: boolean;
  albumTitle?: string;
  currentIndex: number;
  totalPhotos: number;
}

/**
 * Flicker-free, load-safe cross-fade photo viewer.
 *
 * Strategy:
 * 1. Two img layers (A and B) — each keeps a STABLE src.
 * 2. When a new URL arrives, we set it on the HIDDEN layer's src.
 * 3. We do NOT toggle opacity yet — the hidden layer is still transparent.
 * 4. The hidden layer's <img onLoad> fires once the browser has decoded it.
 * 5. Only THEN do we toggle activeLayer to cross-fade.
 *
 * This means: no black frames, no flicker. If the image is slow to load,
 * the current photo stays visible until the next one is fully ready.
 */
export function PhotoFrame({
  currentUrl,
  prevUrl,
  isActive,
  albumTitle,
  currentIndex,
  totalPhotos,
}: PhotoFrameProps) {
  const [activeLayer, setActiveLayer] = useState<'A' | 'B'>('A');
  const [srcA, setSrcA] = useState('');
  const [srcB, setSrcB] = useState('');
  const [readyToShow, setReadyToShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Track which layer we're "preparing" (loading onto but not showing yet)
  const pendingLayerRef = useRef<'A' | 'B' | null>(null);
  const lastUrl = useRef('');
  const isFirstLoad = useRef(true);

  // Step 1: When a new URL arrives, put it on the hidden layer (don't toggle yet)
  useEffect(() => {
    if (!currentUrl || currentUrl === lastUrl.current) return;
    lastUrl.current = currentUrl;

    if (isFirstLoad.current) {
      // First photo — load onto layer A, show loading state until it loads
      isFirstLoad.current = false;
      setSrcA(currentUrl);
      pendingLayerRef.current = 'A';
      setIsLoading(true);
      return;
    }

    // Determine the hidden layer and set its src
    if (activeLayer === 'A') {
      // Layer B is hidden — load new image there
      setSrcB(currentUrl);
      pendingLayerRef.current = 'B';
    } else {
      // Layer A is hidden — load new image there
      setSrcA(currentUrl);
      pendingLayerRef.current = 'A';
    }
    setIsLoading(true);
  }, [currentUrl]); // eslint-disable-line react-hooks/exhaustive-deps
  // intentionally not depending on activeLayer to avoid re-trigger loops

  // Step 2: Called when a layer's <img> finishes loading in the DOM
  const handleLayerALoad = useCallback(() => {
    if (pendingLayerRef.current === 'A') {
      pendingLayerRef.current = null;
      setActiveLayer('A');
      setReadyToShow(true);
      setIsLoading(false);
    }
  }, []);

  const handleLayerBLoad = useCallback(() => {
    if (pendingLayerRef.current === 'B') {
      pendingLayerRef.current = null;
      setActiveLayer('B');
      setReadyToShow(true);
      setIsLoading(false);
    }
  }, []);

  // Reset when album deactivates
  useEffect(() => {
    if (!isActive) {
      isFirstLoad.current = true;
      lastUrl.current = '';
      pendingLayerRef.current = null;
      setSrcA('');
      setSrcB('');
      setReadyToShow(false);
      setIsLoading(false);
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      {/* Outer frame border glow */}
      <div
        className="absolute -inset-[1px] rounded-2xl z-0"
        style={{
          background: isActive
            ? 'linear-gradient(135deg, rgba(212,165,116,0.3), rgba(176,122,161,0.2), rgba(139,157,195,0.3))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          padding: '1px',
        }}
      />

      {/* Inner frame */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-primary)',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
        }}
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <>
              {/* Layer A */}
              <div
                className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: activeLayer === 'A' && readyToShow ? 1 : 0 }}
              >
                {srcA && (
                  <img
                    src={srcA}
                    alt=""
                    className="w-full h-full object-cover"
                    onLoad={handleLayerALoad}
                  />
                )}
              </div>

              {/* Layer B */}
              <div
                className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: activeLayer === 'B' && readyToShow ? 1 : 0 }}
              >
                {srcB && (
                  <img
                    src={srcB}
                    alt=""
                    className="w-full h-full object-cover"
                    onLoad={handleLayerBLoad}
                  />
                )}
              </div>

              {/* Loading indicator — shows while waiting for first/next photo */}
              {isLoading && !readyToShow && (
                <div className="absolute inset-0 flex items-center justify-center z-5">
                  <Loader2
                    size={24}
                    className="text-white/20 animate-spin"
                  />
                </div>
              )}

              {/* Subtle bottom gradient for text readability */}
              <div
                className="absolute inset-x-0 bottom-0 h-24 z-10"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
                }}
              />

              {/* Photo counter */}
              <div className="absolute bottom-3 right-3 z-20">
                <div
                  className="glass rounded-full px-3 py-1 flex items-center gap-1.5"
                  style={{ fontSize: '10px' }}
                >
                  <ImageIcon size={10} className="text-white/60" />
                  <span className="text-white/70 font-body">
                    {currentIndex + 1} / {totalPhotos}
                  </span>
                </div>
              </div>

              {/* Album title overlay */}
              {albumTitle && (
                <div className="absolute bottom-3 left-3 z-20">
                  <span
                    className="font-display text-white/80 font-medium"
                    style={{
                      fontSize: '13px',
                      textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {albumTitle}
                  </span>
                </div>
              )}
            </>
          ) : (
            /* Placeholder when no album is playing */
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at 40% 40%, rgba(212,165,116,0.06) 0%, transparent 60%), radial-gradient(ellipse at 60% 70%, rgba(176,122,161,0.05) 0%, transparent 60%)',
                }}
              />

              <Heart
                size={28}
                className="text-[var(--accent-rose)] mb-3"
                fill="var(--accent-rose)"
                style={{ opacity: 0.4 }}
              />
              <p
                className="font-display text-white/25 font-light text-center px-8"
                style={{ fontSize: 'clamp(13px, 3.5vw, 16px)' }}
              >
                Our Story
              </p>
              <p
                className="text-white/15 font-body text-center mt-1 px-10"
                style={{ fontSize: '11px' }}
              >
                Pick a record to start the memories
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
