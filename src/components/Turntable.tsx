import type { Album } from '../types';
import { VinylRecord } from './VinylRecord';
import { Tonearm } from './Tonearm';

interface TurntableProps {
  activeAlbum: Album | null;
  isPlaying: boolean;
  isTonearmDown: boolean;
  isScrubbing: boolean;
  isDropTarget: boolean;
  scratchBind: (...args: unknown[]) => Record<string, unknown>;
  onDrop: () => void;
}

/**
 * The main turntable body containing the platter, record, and tonearm.
 * Acts as a drop zone for album sleeves.
 */
export function Turntable({
  activeAlbum,
  isPlaying,
  isTonearmDown,
  isScrubbing,
  isDropTarget,
  scratchBind,
  onDrop,
}: TurntableProps) {
  return (
    <div className="relative flex items-center justify-center" style={{ maxWidth: '180px' }}>
      {/* Turntable body */}
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          isDropTarget ? 'drop-zone-active' : ''
        }`}
        style={{
          width: 'min(38vw, 160px)',
          aspectRatio: '1 / 1',
          background: `linear-gradient(145deg, #1e1e2a 0%, var(--turntable-body) 50%, #151520 100%)`,
          boxShadow: `
            0 20px 60px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.05),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
        }}
      >
        {/* Wood grain texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(139,109,82,0.08) 2px,
              rgba(139,109,82,0.08) 4px
            )`,
          }}
        />

        {/* Platter recess */}
        <div
          className="absolute rounded-full"
          style={{
            top: '8%',
            left: '8%',
            width: '74%',
            height: '74%',
            background: `radial-gradient(circle at center, 
              var(--turntable-felt) 0%, 
              #15151f 80%, 
              #111118 100%)`,
            boxShadow: `
              inset 0 2px 15px rgba(0,0,0,0.5),
              0 0 0 3px rgba(30,30,40,0.8),
              0 0 0 4px rgba(50,50,60,0.3)
            `,
          }}
        >
          {/* Felt mat texture */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: `radial-gradient(circle at 40% 40%, 
                rgba(255,255,255,0.02) 0%, 
                transparent 50%)`,
            }}
          />

          {/* Spindle */}
          <div
            className="absolute rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '8px',
              height: '8px',
              background: 'linear-gradient(145deg, #666 0%, #444 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
              zIndex: 10,
            }}
          />

          {/* Vinyl record (when album loaded) */}
          <div className="absolute inset-4 flex items-center justify-center">
            <VinylRecord
              album={activeAlbum}
              isSpinning={isPlaying}
              isScrubbing={isScrubbing}
              scratchBind={scratchBind}
            />
          </div>
        </div>

        {/* Tonearm */}
        <Tonearm isDown={isTonearmDown} />

        {/* Power LED */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: '6%',
            left: '10%',
            width: '6px',
            height: '6px',
            background: isPlaying ? '#4ade80' : '#666',
            boxShadow: isPlaying
              ? '0 0 8px rgba(74, 222, 128, 0.6), 0 0 2px rgba(74, 222, 128, 0.8)'
              : 'none',
            transition: 'all 0.5s ease',
          }}
        />

        {/* Speed indicator dots */}
        <div
          className="absolute flex gap-2"
          style={{ bottom: '6%', right: '10%' }}
        >
          <div
            className="rounded-full"
            style={{
              width: '4px',
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
            }}
          />
          <div
            className="rounded-full"
            style={{
              width: '4px',
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
            }}
          />
          <div
            className="rounded-full"
            style={{
              width: '4px',
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
        </div>

        {/* Drop zone instruction (when no album) */}
        {!activeAlbum && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center px-4" style={{ marginTop: '-8%' }}>
              <p
                className="font-display text-white/30 font-light"
                style={{ fontSize: 'clamp(11px, 3vw, 15px)' }}
              >
                Drag a record here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
