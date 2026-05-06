import { motion } from 'framer-motion';

interface TonearmProps {
  isDown: boolean;
}

/**
 * A stylized tonearm that pivots between resting and playing positions.
 * Rendered as layered divs for the base, arm, headshell, and cartridge.
 */
export function Tonearm({ isDown }: TonearmProps) {
  return (
    <div
      className="absolute"
      style={{
        top: '2%',
        right: '8%',
        width: '45%',
        height: '55%',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      {/* Pivot base */}
      <div
        className="absolute rounded-full"
        style={{
          top: 0,
          right: 0,
          width: '24px',
          height: '24px',
          background: 'linear-gradient(145deg, #555 0%, #333 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)',
          zIndex: 2,
        }}
      />

      {/* Arm assembly — pivots from the base */}
      <motion.div
        className="absolute"
        style={{
          top: '12px',
          right: '12px',
          transformOrigin: 'top right',
          width: '100%',
          height: '100%',
        }}
        animate={{ rotate: isDown ? 22 : -8 }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 12,
          mass: 0.8,
        }}
      >
        {/* Main arm bar */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            width: '85%',
            height: '3px',
            background: 'linear-gradient(90deg, var(--tonearm-dark) 0%, var(--tonearm-silver) 40%, var(--tonearm-silver) 100%)',
            borderRadius: '2px',
            transformOrigin: 'right center',
            transform: 'rotate(30deg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />

        {/* Counterweight (back of arm) */}
        <div
          className="absolute rounded-full"
          style={{
            top: '-5px',
            right: '-4px',
            width: '14px',
            height: '14px',
            background: 'linear-gradient(145deg, #888 0%, #555 100%)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        />

        {/* Headshell (front/needle end) */}
        <div
          style={{
            position: 'absolute',
            bottom: '28%',
            left: '2%',
            width: '20px',
            height: '6px',
            background: 'linear-gradient(180deg, var(--tonearm-silver) 0%, #777 100%)',
            borderRadius: '1px',
            transform: 'rotate(30deg)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />

        {/* Cartridge / Needle */}
        <div
          style={{
            position: 'absolute',
            bottom: '24%',
            left: '0%',
            width: '4px',
            height: '8px',
            background: 'linear-gradient(180deg, #666 0%, #333 100%)',
            borderRadius: '0 0 1px 1px',
            transform: 'rotate(30deg)',
          }}
        />

        {/* Needle tip glow when playing */}
        {isDown && (
          <motion.div
            className="absolute rounded-full"
            style={{
              bottom: '22%',
              left: '-1px',
              width: '6px',
              height: '6px',
              background: 'var(--accent-gold)',
              filter: 'blur(2px)',
              transform: 'rotate(30deg)',
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
    </div>
  );
}
