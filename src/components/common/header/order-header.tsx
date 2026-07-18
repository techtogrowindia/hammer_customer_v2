import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { CalendarDays, SlidersHorizontal } from 'lucide-react-native';
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
  onDatePress?: () => void;
  activeFilterCount?: number;
}

/**
 * Single hero row, no floating card. Two actions (Filter, Date) live as a
 * grouped pill in the top-right — same translucent treatment as
 * HomeHeader's bell button, but merged into one control with a hairline
 * divider so it reads as "refine this list" rather than two disconnected
 * icon buttons.
 */
export function OrderHeader({ orderCount, onFilterPress, onDatePress, activeFilterCount = 0 }: OrderHeaderProps) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.hero}>
      <View style={[styles.heroDecor, { top: -70 + top }]} />
      <View style={[styles.heroDecorSm, { top: 30 + top }]} />

      <View style={[styles.topRow, { paddingTop: top + 14 }]}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Order history</Text>
          {/* <Text style={styles.subtitle}>
            {orderCount != null
              ? `${orderCount} ${orderCount === 1 ? 'order' : 'orders'}`
              : 'All your bookings, in one place'}
          </Text> */}
        </View>

        <View style={styles.actionGroup}>
          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Filter by date'
            onPress={onDatePress}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            hitSlop={8}
          >
            <CalendarDays size={18} color={AppColors.white} strokeWidth={2.25} />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Filter orders'
            onPress={onFilterPress}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            hitSlop={8}
          >
            <SlidersHorizontal size={18} color={AppColors.white} strokeWidth={2.25} />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingBottom: 22,
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
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroDecorSm: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    right: 90,
    // backgroundColor: 'rgba(255,255,255,0.06)',
  },

  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titleWrap: { flex: 1, paddingTop: 4 },
  title: { fontFamily: font.semiBold, fontSize: 18, color: AppColors.white, letterSpacing: 0.1 },
  subtitle: { marginTop: 4, fontFamily: font.regular, fontSize: 12.5, color: 'rgba(255,255,255,0.75)' },

  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 21,
    padding: 3,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  filterBadgeText: { fontFamily: font.semiBold, fontSize: 9, color: AppColors.primaryDark },
});

export default OrderHeader;
