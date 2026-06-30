import LottieView from 'lottie-react-native';
import React, { memo, useImperativeHandle, useMemo, useRef } from 'react';
import { View } from 'react-native';
import styles from './lottieloader.styles';
import { LottieLoaderProps } from './lottieloader.types';

const LottieLoader = memo(
  ({
    source,
    speed = 1,
    loop = true,
    autoPlay = true,
    width = 100,
    height = 100,
    style,
    progress,
    onAnimationFinish,
    onAnimationLoop,
    resizeMode = 'contain',
    colorFilters,
    lottieRef,
    testID,
    accessibilityLabel,
  }: LottieLoaderProps) => {
    const animationRef = useRef<LottieView>(null);

    const imperativeHandle = useMemo(
      () => ({
        play: (startFrame?: number, endFrame?: number) => {
          animationRef.current?.play(startFrame, endFrame);
        },
        pause: () => {
          animationRef.current?.pause();
        },
        resume: () => {
          animationRef.current?.resume();
        },
        reset: () => {
          animationRef.current?.reset();
        },
        isAnimationLoaded: () => Boolean(animationRef.current),
      }),
      [],
    );

    useImperativeHandle(lottieRef, () => imperativeHandle, [imperativeHandle]);

    const containerStyle = useMemo(() => [styles.container, { width, height }, style], [width, height, style]);

    return (
      <View
        style={containerStyle}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessible={accessibilityLabel ? true : undefined}
      >
        <LottieView
          ref={animationRef}
          source={source}
          speed={speed}
          loop={loop}
          autoPlay={autoPlay}
          progress={progress}
          onAnimationFinish={onAnimationFinish}
          onAnimationLoop={onAnimationLoop}
          resizeMode={resizeMode}
          colorFilters={colorFilters}
          style={styles.animation}
        />
      </View>
    );
  },
);

LottieLoader.displayName = 'LottieLoader';

export default LottieLoader;
