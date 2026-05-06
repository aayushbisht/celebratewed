import { motion } from 'framer-motion';
import type { Album } from '../types';

interface AlbumSleeveProps {
  album: Album;
  isActive: boolean;
  index: number;
  onDragStart: (album: Album) => void;
  onDragEnd: (album: Album, info: { point: { x: number; y: number } }) => void;
}

/**
 * A circular draggable mini-record. Shows the album's gradient color
 * with vinyl grooves and a tiny center label.
 */
export function AlbumSleeve({
  album,
  isActive,
  index,
  onDragStart,
  onDragEnd,
}: AlbumSleeveProps) {
  const size = 'min(20vw, 80px)';

  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <motion.div
        className={`relative rounded-full overflow-hidden cursor-grab active:cursor-grabbing select-none ${
          isActive ? 'opacity-30 pointer-events-none' : ''
        }`}
        style={{
          width: size,
          height: size,
          touchAction: 'none',
        }}
        drag
        dragSnapToOrigin
        dragElastic={0.6}
        dragMomentum={false}
        onDragStart={() => onDragStart(album)}
        onDragEnd={(_e, info) => onDragEnd(album, info)}
        whileDrag={{
          scale: 1.15,
          zIndex: 50,
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        }}
        whileTap={{ scale: 0.94 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isActive ? 0.3 : 1,
          scale: 1,
          transition: { delay: index * 0.08, duration: 0.35, type: 'spring' },
        }}
        layout
      >
        {/* Vinyl base */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at center, 
              transparent 0%, 
              transparent 18%, 
              var(--vinyl-black) 18%, 
              var(--vinyl-black) 100%)`,
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.05),
              0 4px 12px rgba(0,0,0,0.4),
              inset 0 0 20px rgba(0,0,0,0.3)
            `,
          }}
        />

        {/* Grooves */}
        <div className="absolute inset-0 rounded-full vinyl-grooves opacity-60" />

        {/* Shine */}
        <div className="absolute inset-0 rounded-full vinyl-shine-effect opacity-20" />

        {/* Center label with album color */}
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: '42%',
            height: '42%',
            top: '29%',
            left: '29%',
            background: album.coverGradient,
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          {/* Spindle dot */}
          <div
            className="rounded-full"
            style={{
              width: '5px',
              height: '5px',
              background: 'var(--vinyl-black)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
            }}
          />
        </div>

        {/* Active ring glow */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 12px ${album.coverColor}44, inset 0 0 8px ${album.coverColor}22`,
            }}
          />
        )}
      </motion.div>

      {/* Title below the disc */}
      <span
        className={`font-display text-center leading-tight ${
          isActive ? 'text-white/30' : 'text-white/60'
        }`}
        style={{
          fontSize: '9px',
          maxWidth: size,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {album.title}
      </span>
    </div>
  );
}
