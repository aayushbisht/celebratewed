export interface Album {
  id: string;
  title: string;
  subtitle: string;
  coverColor: string;
  coverGradient: string;
  audioTrackUrl: string;
  photoUrls: string[];
}

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused';
