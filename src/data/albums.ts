import type { Album } from '../types';

// =============================================================================
// ALBUM DATA
// =============================================================================
// To customize: Replace photoUrls with paths to your photos in /public/photos/
// e.g. "/photos/wedding/001.jpg"
// Replace audioTrackUrl with your own mp3 files in /public/audio/
// e.g. "/audio/wedding.mp3"
// =============================================================================

export const albums: Album[] = [
  {
    id: 'the-wedding',
    title: 'The Wedding',
    subtitle: 'The Big Day',
    coverColor: '#d4a574',
    coverGradient: 'linear-gradient(135deg, #d4a574 0%, #8b6f47 50%, #c9956b 100%)',
    audioTrackUrl: '/audio/mehendi.mp3',
    photoUrls: [
      '/photos/wedding/wed1.png',
      '/photos/wedding/wed2.png',
      '/photos/wedding/wed3.png',
      '/photos/wedding/wed4.png',
      '/photos/wedding/wed5.png',
    ],
  },
  {
    id: 'building-a-foundation',
    title: 'Building a Foundation',
    subtitle: 'Figuring It All Out',
    coverColor: '#7ba89e',
    coverGradient: 'linear-gradient(135deg, #7ba89e 0%, #4a7c6f 50%, #92c4b8 100%)',
    audioTrackUrl: '/audio/aashiyan.mp3',
    photoUrls: [
      '/photos/foundation/found1.png',
      '/photos/foundation/found2.png',
      '/photos/foundation/found3.png',
      '/photos/foundation/found4.png',
    ],
  },
  {
    id: 'the-family-years',
    title: 'The Family Years',
    subtitle: 'Chaotic & Beautiful',
    coverColor: '#b07aa1',
    coverGradient: 'linear-gradient(135deg, #b07aa1 0%, #7d4f71 50%, #c995b8 100%)',
    audioTrackUrl: '/audio/lyz.mp3',
    photoUrls: [
      '/photos/family/lat1.png',
      '/photos/family/lat2.png',
      '/photos/family/lat3.png',
      '/photos/family/lat4.png',
      '/photos/family/lat5.png',
      '/photos/family/lat6.png',
      '/photos/family/lat7.png',
    ],
  },
  // {
  //   id: 'the-next-chapter',
  //   title: 'The Next Chapter',
  //   subtitle: 'Enjoying Life Together',
  //   coverColor: '#8b9dc3',
  //   coverGradient: 'linear-gradient(135deg, #8b9dc3 0%, #5a6f96 50%, #a4b5d4 100%)',
  //   audioTrackUrl: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3eb83.mp3',
  //   photoUrls: [
  //     'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80',
  //     'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
  //     'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1200&q=80',
  //     'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80',
  //     'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
  //     'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
  //   ],
  // },
];
