import { IconType } from '@/components/home/home.types';
import { AppColors } from '@/core/theme/app-colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CircleIconProps {
  Icon: IconType;
  size?: number;
  iconSize?: number;
  iconColor?: string;
  ringColor?: string;
  innerBgColor?: string;
}

export function CircleIcon({
  Icon,
  size = 56,
  iconSize = 22,
  iconColor = AppColors.primary,
  ringColor = 'rgba(255,255,255,0.2)',
  innerBgColor = AppColors.white,
}: CircleIconProps) {
  return (
    <View style={[styles.outer, { width: size, height: size, borderRadius: size / 2, backgroundColor: ringColor }]}>
      <View
        style={[
          styles.inner,
          {
            width: size * 0.83,
            height: size * 0.83,
            borderRadius: (size * 0.83) / 2,
            backgroundColor: innerBgColor,
          },
        ]}
      >
        <Icon size={iconSize} color={iconColor} strokeWidth={1.75} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { alignItems: 'center', justifyContent: 'center' },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});

export default CircleIcon;
