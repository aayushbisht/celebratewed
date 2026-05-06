import { motion, AnimatePresence } from 'framer-motion';
import { CircleStop, Pause, Play } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  hasAlbum: boolean;
  onPlayPause: () => void;
  onEject: () => void;
}

/**
 * Floating glassmorphism control bar with Play/Pause and Eject buttons.
 * Only visible when an album is loaded.
 */
export function Controls({ isPlaying, hasAlbum, onPlayPause, onEject }: ControlsProps) {
  return (
    <AnimatePresence>
      {hasAlbum && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 flex justify-center z-40"
          style={{
            paddingBottom: 'max(16px, var(--safe-bottom))',
          }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div
            className="glass rounded-2xl flex items-center gap-2 px-4 py-2"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {/* Play / Pause */}
            <button
              onClick={onPlayPause}
              className="touch-target rounded-xl transition-smooth"
              style={{
                background: isPlaying
                  ? 'rgba(255,255,255,0.1)'
                  : 'var(--accent-gold)',
                color: isPlaying ? 'var(--text-primary)' : '#000',
                width: '48px',
                height: '48px',
              }}
              id="btn-play-pause"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>

            {/* Eject */}
            <button
              onClick={onEject}
              className="touch-target rounded-xl transition-smooth"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-secondary)',
                width: '48px',
                height: '48px',
              }}
              id="btn-eject"
            >
              <CircleStop size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
