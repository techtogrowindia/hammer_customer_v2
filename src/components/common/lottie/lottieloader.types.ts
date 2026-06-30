import { ViewStyle, DimensionValue } from 'react-native';

export interface LottieLoaderProps {
  source: any;
  speed?: number;
  loop?: boolean;
  autoPlay?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  style?: ViewStyle;
  progress?: number;
  onAnimationFinish?: (isCancelled: boolean) => void;
  onAnimationLoop?: () => void;
  resizeMode?: 'contain' | 'cover' | 'center';
  colorFilters?: {
    keypath: string;
    color: string;
  }[];
  lottieRef?: React.Ref<LottieLoaderRef>;
  testID?: string;
  accessibilityLabel?: string;
}

export interface LottieLoaderRef {
  play: (startFrame?: number, endFrame?: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  isAnimationLoaded: () => boolean;
}
