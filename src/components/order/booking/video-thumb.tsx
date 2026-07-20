import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { styles } from '../../../app/(tabs)/(home,orders,services,profile)/booking/[booking-id]';

export function VideoThumb({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.pause();
  });
  return <VideoView player={player} style={styles.mediaThumb} contentFit='cover' nativeControls={false} />;
}
