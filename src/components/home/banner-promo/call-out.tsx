import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ArrowRight } from 'lucide-react-native';
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
  backgroundColor = AppColors.primary,
}: CalloutBannerProps) {
  return (
    <Pressable
      accessibilityRole='button'
      onPress={onPress}
      style={({ pressed }) => [styles.banner, { backgroundColor }, pressed && { opacity: 0.92 }]}
    >
      <View style={styles.decor} />

      <View style={styles.leftZone}>
        <View style={styles.iconWrap}>
          <Icon size={24} color={AppColors.white} strokeWidth={2} />
        </View>
      </View>

      <View style={styles.notchTop} />
      <View style={styles.notchBottom} />
      <View style={styles.perforation} />

      <View style={styles.rightZone}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>Claim now</Text>
          <ArrowRight size={13} color={AppColors.white} strokeWidth={2.25} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 88,
    borderRadius: 20,
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
  leftZone: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  perforation: {
    width: 1,
    marginVertical: 14,
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    borderLeftColor: 'rgba(255,255,255,0.35)',
  },
  notchTop: {
    position: 'absolute',
    top: -8,
    left: 76 - 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AppColors.background,
  },
  notchBottom: {
    position: 'absolute',
    bottom: -8,
    left: 76 - 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AppColors.background,
  },
  rightZone: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: AppColors.white },
  subtitle: {
    marginTop: 3,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.white,
    opacity: 0.85,
  },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  ctaText: { fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: AppColors.white },
});

export default CalloutBanner;
