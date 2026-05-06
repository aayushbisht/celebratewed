import { useState, useCallback, useRef } from 'react';
import type { Album } from './types';
import { albums } from './data/albums';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useSlideshow } from './hooks/useSlideshow';
import { useScratchGesture } from './hooks/useScratchGesture';
import { PhotoFrame } from './components/PhotoFrame';
import { Turntable } from './components/Turntable';
import { Crate } from './components/Crate';
import { Controls } from './components/Controls';
import { NowPlaying } from './components/NowPlaying';

function App() {
  // ---- State ----
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTonearmDown, setIsTonearmDown] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [draggingAlbum, setDraggingAlbum] = useState<Album | null>(null);

  // ---- Hooks ----
  const audio = useAudioEngine();
  const slideshow = useSlideshow(activeAlbum?.photoUrls || [], 4000);
  const vinylRef = useRef<HTMLDivElement>(null);

  const scratch = useScratchGesture(vinylRef, {
    onScratchStart: () => {
      setIsScrubbing(true);
      slideshow.pause();
    },
    onScratchEnd: () => {
      setIsScrubbing(false);
      audio.resetPlaybackRate();
      if (isPlaying) {
        slideshow.play();
      }
    },
    onScratchForward: () => {
      slideshow.next();
    },
    onScratchBackward: () => {
      slideshow.prev();
    },
    onAngleChange: (delta) => {
      const rate = 1 + delta * 0.03;
      audio.setPlaybackRate(Math.max(0.2, Math.min(3, rate)));
    },
  });

  // ---- Album loading flow ----
  const loadAlbum = useCallback(
    (album: Album) => {
      audio.loadTrack(album.audioTrackUrl);
      slideshow.reset();
      setActiveAlbum(album);

      setTimeout(() => {
        setIsTonearmDown(true);
        setTimeout(() => {
          audio.play();
          setIsPlaying(true);
          slideshow.play();
        }, 800);
      }, 600);
    },
    [audio, slideshow]
  );

  const ejectAlbum = useCallback(() => {
    setIsTonearmDown(false);
    setIsPlaying(false);
    setIsScrubbing(false);
    audio.stop();
    slideshow.reset();
    setTimeout(() => {
      setActiveAlbum(null);
    }, 500);
  }, [audio, slideshow]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      audio.pause();
      slideshow.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      slideshow.play();
      setIsPlaying(true);
    }
  }, [isPlaying, audio, slideshow]);

  // ---- Drag handlers ----
  const handleDragStart = useCallback((album: Album) => {
    setDraggingAlbum(album);
    setIsDropTarget(true);
  }, []);

  const handleDragEnd = useCallback(
    (album: Album, info: { point: { x: number; y: number } }) => {
      setIsDropTarget(false);
      setDraggingAlbum(null);

      const turntableZone = document.getElementById('turntable-zone');
      if (turntableZone) {
        const rect = turntableZone.getBoundingClientRect();
        const { x, y } = info.point;
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          if (activeAlbum?.id !== album.id) {
            if (activeAlbum) {
              ejectAlbum();
              setTimeout(() => loadAlbum(album), 600);
            } else {
              loadAlbum(album);
            }
          }
        }
      }
    },
    [activeAlbum, ejectAlbum, loadAlbum]
  );

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none flex flex-col"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* ===== TOP: Photo Frame (takes up most of the screen) ===== */}
      <div
        className="flex-1 min-h-0 px-3 pt-3 pb-2"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
      >
        {/* Now Playing header */}
        <div className="mb-2 px-1">
          <NowPlaying
            album={activeAlbum}
            currentPhotoIndex={slideshow.currentIndex}
            totalPhotos={slideshow.totalPhotos}
          />
        </div>

        {/* The photo frame */}
        <div className="w-full h-[calc(100%-40px)]">
          <PhotoFrame
            currentUrl={slideshow.currentUrl}
            prevUrl={slideshow.prevUrl}
            isActive={!!activeAlbum}
            albumTitle={activeAlbum?.title}
            currentIndex={slideshow.currentIndex}
            totalPhotos={slideshow.totalPhotos}
          />
        </div>
      </div>

      {/* ===== BOTTOM: Turntable + Crate (compact) ===== */}
      <div
        className="flex-shrink-0 px-3 pb-2"
        style={{ paddingBottom: activeAlbum ? '70px' : 'max(8px, var(--safe-bottom))' }}
      >
        {/* Turntable + Crate row */}
        <div className="flex items-center gap-3">
          {/* Mini Turntable */}
          <div
            id="turntable-zone"
            className="flex-shrink-0"
            ref={vinylRef}
          >
            <Turntable
              activeAlbum={activeAlbum}
              isPlaying={isPlaying}
              isTonearmDown={isTonearmDown}
              isScrubbing={isScrubbing}
              isDropTarget={isDropTarget}
              scratchBind={scratch.bind}
              onDrop={() => {}}
            />
          </div>

          {/* Circular records row */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <Crate
              albums={albums}
              activeAlbumId={activeAlbum?.id || null}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
        </div>

        {/* Smart interaction hint */}
        {activeAlbum && isPlaying && (
          <div
            className="flex items-center justify-center gap-1.5 mt-2"
            style={{
              animation: 'fadeInUp 0.6s ease forwards',
            }}
          >
            <span className="text-white/20" style={{ fontSize: '13px' }}>☝️</span>
            <span
              className="text-white/25 font-body italic"
              style={{ fontSize: '10px',  color: 'white', fontWeight: 'bold' }}
            >
              Spin the record to flip through photos
            </span>
          </div>
        )}

        {/* Drag hint when idle */}
        {!activeAlbum && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span
              className="text-white/20 font-body"
              style={{ fontSize: '10px' }}
            >
              Drag a record onto the turntable to begin
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <Controls
        isPlaying={isPlaying}
        hasAlbum={!!activeAlbum}
        onPlayPause={togglePlayPause}
        onEject={ejectAlbum}
      />
    </div>
  );
}

export default App;
