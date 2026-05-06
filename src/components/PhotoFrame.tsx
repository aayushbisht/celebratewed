import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ImageIcon } from 'lucide-react';

interface PhotoFrameProps {
  currentUrl: string;
  prevUrl: string;
  isActive: boolean;
  albumTitle?: string;
  currentIndex: number;
  totalPhotos: number;
}

/**
 * A prominent, framed photo viewer with flicker-free cross-fade.
 *
 * How it works:
 * - Two layers (A and B) each hold a stable image src.
 * - The "active" layer is fully opaque; the other is transparent.
 * - When a new photo URL arrives, we load it onto the HIDDEN layer first.
 * - Only after the hidden layer's <img> fires onLoad do we toggle opacity.
 * - This guarantees no flash of an unloaded image.
 */
export function PhotoFrame({
  currentUrl,
  prevUrl,
  isActive,
  albumTitle,
  currentIndex,
  totalPhotos,
}: PhotoFrameProps) {
  // Which layer is currently visible: 'A' or 'B'
  const [activeLayer, setActiveLayer] = useState<'A' | 'B'>('A');
  const [srcA, setSrcA] = useState('');
  const [srcB, setSrcB] = useState('');
  const [readyToShow, setReadyToShow] = useState(false);
  const isFirstLoad = useRef(true);
  const lastUrl = useRef('');

  // When a new currentUrl arrives, load it onto the hidden layer
  useEffect(() => {
    if (!currentUrl || currentUrl === lastUrl.current) return;
    lastUrl.current = currentUrl;

    // On first load, just put it directly on layer A (no cross-fade needed)
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      setSrcA(currentUrl);
      setActiveLayer('A');
      setReadyToShow(true);
      return;
    }

    // Pre-load the image in JS before touching any layer src
    const img = new Image();
    img.src = currentUrl;
    const targetUrl = currentUrl; // capture in closure

    img.onload = () => {
      // Image is now cached — safe to set src on the hidden layer
      setActiveLayer((prevLayer) => {
        if (prevLayer === 'A') {
          // Layer B is hidden → set its src, then make it active
          setSrcB(targetUrl);
        } else {
          // Layer A is hidden → set its src, then make it active
          setSrcA(targetUrl);
        }
        // Toggle: the layer we just loaded onto becomes active
        return prevLayer === 'A' ? 'B' : 'A';
      });
    };
  }, [currentUrl]);

  // Reset when album changes
  useEffect(() => {
    if (!isActive) {
      isFirstLoad.current = true;
      lastUrl.current = '';
      setSrcA('');
      setSrcB('');
      setReadyToShow(false);
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
          {isActive && readyToShow ? (
            <>
              {/* Layer A — holds its src stably */}
              <div
                className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: activeLayer === 'A' ? 1 : 0 }}
              >
                {srcA && (
                  <img
                    src={srcA}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Layer B — holds its src stably */}
              <div
                className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: activeLayer === 'B' ? 1 : 0 }}
              >
                {srcB && (
                  <img
                    src={srcB}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

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
