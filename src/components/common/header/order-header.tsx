import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { CalendarDays, FunnelPlus } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

interface OrderHeaderProps {
  orderCount?: number;
  onFilterPress?: () => void;
  activeFilterCount?: number;
}

/**
 * Single hero row, no floating card — with just one action (Filter) a
 * split two-button card overlapping the hero was doing a lot of visual
 * work for one button. Filter sits directly in the hero's top row, same
 * treatment as HomeHeader's bell button (translucent circle + small badge).
 */
export function OrderHeader({ orderCount, onFilterPress, activeFilterCount = 0 }: OrderHeaderProps) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.hero}>
      <View style={[styles.heroDecor, { top: -70 + top }]} />

      <View style={[styles.topRow, { paddingTop: top + 14 }]}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Order history</Text>
        </View>

        <Pressable
          accessibilityRole='button'
          onPress={onFilterPress}
          style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.8 }]}
          hitSlop={8}
        >
          <FunnelPlus size={18} color={AppColors.black} strokeWidth={2.25} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
        <Pressable
          accessibilityRole='button'
          onPress={onFilterPress}
          style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.8 }]}
          hitSlop={8}
        >
          <CalendarDays size={18} color={AppColors.black} strokeWidth={2.25} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroDecor: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -50,
    // backgroundColor: 'rgba(255,255,255,0.08)',
  },

  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titleWrap: { flex: 1 },
  title: { fontFamily: font.semiBold, fontSize: 20, color: AppColors.textPrimary },
  subtitle: { marginTop: 4, fontFamily: font.regular, fontSize: 12, color: AppColors.textSecondary },

  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 3,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  filterBadgeText: { fontFamily: font.semiBold, fontSize: 9.5, color: AppColors.primaryDark },
});

export default OrderHeader;
