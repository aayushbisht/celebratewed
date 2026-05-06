import type { Album } from '../types';
import { AlbumSleeve } from './AlbumSleeve';

interface CrateProps {
  albums: Album[];
  activeAlbumId: string | null;
  onDragStart: (album: Album) => void;
  onDragEnd: (album: Album, info: { point: { x: number; y: number } }) => void;
}

/**
 * The album crate — a horizontal row of circular mini-records.
 */
export function Crate({ albums, activeAlbumId, onDragStart, onDragEnd }: CrateProps) {
  return (
    <div className="w-full">
      {/* Horizontal row of circular records */}
      <div
        className="flex items-start gap-3 overflow-x-auto scrollbar-hide px-1 pb-1"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {albums.map((album, index) => (
          <AlbumSleeve
            key={album.id}
            album={album}
            isActive={album.id === activeAlbumId}
            index={index}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
