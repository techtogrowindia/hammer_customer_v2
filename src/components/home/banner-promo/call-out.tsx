import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconType } from '../home.types';

interface CalloutBannerProps {
  Icon: IconType;
  title: string;
  subtitle: string;
  onPress?: () => void;
  backgroundColor?: string;
}

export function CalloutBanner({
  Icon,
  title,
  subtitle,
  onPress,
  backgroundColor = AppColors.primaryDark,
}: CalloutBannerProps) {
  return (
    <Pressable
      accessibilityRole='button'
      onPress={onPress}
      style={({ pressed }) => [styles.banner, { backgroundColor }, pressed && { opacity: 0.92 }]}
    >
      <View style={styles.decor} />
      <View style={styles.iconWrap}>
        <Icon size={22} color={AppColors.white} strokeWidth={2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={17} color={AppColors.white} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 80,
    borderRadius: 20,
    paddingHorizontal: 18,
    marginBottom: 20,
    overflow: 'hidden',
  },
  decor: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -30,
    right: -20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  title: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: AppColors.white },
  subtitle: {
    marginTop: 3,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.white,
    opacity: 0.85,
  },
});

export default CalloutBanner;
