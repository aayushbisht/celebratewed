import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { Album } from '../types';

interface VinylRecordProps {
  album: Album | null;
  isSpinning: boolean;
  isScrubbing: boolean;
  scratchBind: (...args: unknown[]) => Record<string, unknown>;
}

/**
 * A highly detailed vinyl record with realistic grooves, shine effects,
 * and a center label. Supports spinning animation and scratch gesture binding.
 */
export function VinylRecord({ album, isSpinning, isScrubbing, scratchBind }: VinylRecordProps) {
  const discRef = useRef<HTMLDivElement>(null);

  if (!album) return null;

  return (
    <div className="relative flex items-center justify-center" style={{ touchAction: 'none' }}>
      <motion.div
        ref={discRef}
        {...scratchBind()}
        className="relative rounded-full cursor-grab active:cursor-grabbing select-none"
        style={{
          width: 'min(28vw, 120px)',
          height: 'min(28vw, 120px)',
          touchAction: 'none',
        }}
        animate={
          isSpinning && !isScrubbing
            ? { rotate: 360 }
            : {}
        }
        transition={
          isSpinning && !isScrubbing
            ? {
                rotate: {
                  duration: 3,
                  ease: 'linear',
                  repeat: Infinity,
                },
              }
            : { duration: 0 }
        }
      >
        {/* Outer rim */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at center, 
              transparent 0%, 
              transparent 10%, 
              var(--vinyl-black) 10%, 
              var(--vinyl-black) 100%)`,
            boxShadow: `
              0 0 0 3px rgba(40,40,50,0.8),
              0 0 0 4px rgba(60,60,70,0.4),
              0 8px 32px rgba(0,0,0,0.6),
              inset 0 0 60px rgba(0,0,0,0.3)
            `,
          }}
        />

        {/* Groove rings */}
        <div
          className="absolute inset-0 rounded-full vinyl-grooves opacity-80"
          style={{ zIndex: 1 }}
        />

        {/* Shine sweep */}
        <div
          className="absolute inset-0 rounded-full vinyl-shine-effect opacity-30"
          style={{ zIndex: 2 }}
        />

        {/* Center label */}
        <div
          className="absolute rounded-full flex flex-col items-center justify-center"
          style={{
            width: '35%',
            height: '35%',
            top: '32.5%',
            left: '32.5%',
            background: album.coverGradient,
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px rgba(0,0,0,0.2)',
            zIndex: 3,
          }}
        >
          {/* Spindle hole */}
          <div
            className="rounded-full mb-1"
            style={{
              width: '10px',
              height: '10px',
              background: 'var(--vinyl-black)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
            }}
          />
          <span
            className="font-display text-white text-center leading-tight font-semibold"
            style={{
              fontSize: 'clamp(7px, 2.5vw, 11px)',
              maxWidth: '80%',
              textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}
          >
            {album.title}
          </span>
          <span
            className="text-white/60 text-center"
            style={{
              fontSize: 'clamp(5px, 1.8vw, 8px)',
            }}
          >
            {album.subtitle}
          </span>
        </div>

        {/* Scratch feedback glow */}
        {isScrubbing && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              zIndex: 4,
              background: `radial-gradient(circle at center, transparent 30%, ${album.coverColor}22 60%, transparent 100%)`,
              animation: 'pulse-glow 0.5s ease-in-out infinite',
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
