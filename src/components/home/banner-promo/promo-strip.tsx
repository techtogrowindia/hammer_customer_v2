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

/**
 * ALTERNATIVE DESIGN — "Dashed outline"
 * No fill at all — a transparent card with a dashed border in the
 * accent color, icon sitting in a small filled circle as the only
 * solid shape. Reads as a "special offer to claim" rather than a
 * generic info row, since dashed borders carry that connotation
 * (coupons, vouchers). Lightest-weight visually of all the variants —
 * good when the surrounding page already has a lot of filled cards
 * and this one shouldn't add to the visual noise.
 */
export function PromoStrip({
  Icon,
  title,
  subtitle,
  onPress,
  backgroundColor = AppColors.warningLight,
  iconWrapColor = AppColors.primary,
  iconColor = AppColors.white,
  style,
}: PromoStripProps) {
  return (
    <Pressable
      accessibilityRole='button'
      onPress={onPress}
      style={({ pressed }) => [styles.banner, style, pressed && { backgroundColor }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconWrapColor }]}>
        <Icon size={18} color={iconColor} strokeWidth={2} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <ChevronRight size={17} color={iconWrapColor} strokeWidth={2.25} />
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
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: AppColors.primary,
    backgroundColor: 'transparent',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
