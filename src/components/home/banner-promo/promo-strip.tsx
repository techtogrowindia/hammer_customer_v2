import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { IconType } from '../home.types';

interface PromoStripProps {
  Icon: IconType;
  title: string;
  subtitle: string;
  onPress?: () => void;
  backgroundColor?: string;
  iconWrapColor?: string;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function PromoStrip({
  Icon,
  title,
  subtitle,
  onPress,
  backgroundColor = AppColors.warningLight,
  iconWrapColor = AppColors.white,
  iconColor = AppColors.primary,
  style,
}: PromoStripProps) {
  return (
    <Pressable
      accessibilityRole='button'
      onPress={onPress}
      style={({ pressed }) => [styles.banner, { backgroundColor }, style, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconWrapColor }]}>
        <Icon size={18} color={iconColor} strokeWidth={2} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={17} color={AppColors.textTertiary} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 62,
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: AppColors.textPrimary },
  subtitle: {
    marginTop: 2,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.textSecondary,
  },
});

export default PromoStrip;
