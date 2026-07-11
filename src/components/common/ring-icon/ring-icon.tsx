import { AppColors } from '@/core/theme/app-colors';
import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';

interface OrbitItem {
  icon: ReactNode;
}

interface RingIconProps {
  centerIcon: ReactNode;
  orbitItems: OrbitItem[];
  animated?: boolean;
  /** Angle (in degrees) of the first item, measured clockwise from the top. Default: 0 (top). */
  startAngle?: number;
  /** Outer diameter of the ring. Must match styles.ringOuter width/height. */
  ringSize?: number;
  /** Diameter of each orbit dot. Must match styles.orbitDot width/height. */
  dotSize?: number;
}

export default function RingIcon({
  centerIcon,
  orbitItems,
  animated = true,
  startAngle = 0,
  ringSize = 132,
  dotSize = 36,
}: RingIconProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) {
      return;
    }

    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [animated, rotateAnim]);

  const rotate = useMemo(
    () =>
      rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    [rotateAnim],
  );

  // Compute an evenly-spaced position for each orbit item, on the circle
  // whose radius is half the ring size, centered on the ring.
  const orbitPositions = useMemo<ViewStyle[]>(() => {
    const count = orbitItems.length;
    if (count === 0) {
      return [];
    }

    const center = ringSize / 2;
    const radius = ringSize / 2;
    const step = 360 / count;

    return orbitItems.map((_, index) => {
      const angleDeg = startAngle + step * index;
      const angleRad = (angleDeg * Math.PI) / 180;

      // 0deg = top, going clockwise
      const x = radius * Math.sin(angleRad);
      const y = -radius * Math.cos(angleRad);

      return {
        position: 'absolute',
        left: center + x - dotSize / 2,
        top: center + y - dotSize / 2,
      };
    });
  }, [orbitItems.length, ringSize, dotSize, startAngle]);

  return (
    <View style={[styles.ringOuter, { width: ringSize, height: ringSize, borderRadius: ringSize / 2 }]}>
      <View style={styles.ringInner}>{centerIcon}</View>

      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          animated && {
            transform: [{ rotate }],
          },
        ]}
      >
        {orbitItems.map((item, index) => (
          <View
            key={index}
            style={[
              styles.orbitDot,
              { width: dotSize, height: dotSize, borderRadius: dotSize / 2 },
              orbitPositions[index],
            ]}
          >
            {item.icon}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ringOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },

  ringInner: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },

  orbitDot: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.divider,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },
});
