import { motion, AnimatePresence } from 'framer-motion';
import type { Album } from '../types';
import { Music } from 'lucide-react';

interface NowPlayingProps {
  album: Album | null;
  currentPhotoIndex: number;
  totalPhotos: number;
}

/**
 * Displays the currently playing album title, subtitle, and photo progress.
 */
export function NowPlaying({ album, currentPhotoIndex, totalPhotos }: NowPlayingProps) {
  return (
    <AnimatePresence mode="wait">
      {album && (
        <motion.div
          key={album.id}
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated music icon */}
          <motion.div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: '36px',
              height: '36px',
              background: album.coverGradient,
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Music size={16} className="text-white" />
          </motion.div>

          <div className="flex flex-col min-w-0">
            <span
              className="font-display font-semibold text-white truncate"
              style={{ fontSize: 'clamp(13px, 3.5vw, 16px)' }}
            >
              {album.title}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-white/40 font-body"
                style={{ fontSize: 'clamp(9px, 2.2vw, 11px)' }}
              >
                {album.subtitle}
              </span>
              <span
                className="text-white/20 font-body"
                style={{ fontSize: '9px' }}
              >
                {currentPhotoIndex + 1} / {totalPhotos}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
