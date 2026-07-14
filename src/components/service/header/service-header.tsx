import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ChevronRight, MapPin } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ServicesHeroProps {
  topInset: number;
  title: string;
  subtitle?: string;
  addressLabel: string;
  addressDetail: string;
  onChangeAddressPress?: () => void;
  onNotificationPress?: () => void;
  hasUnreadNotification?: boolean;
}

/**
 * Services tab hero — the floating card now leads with the delivery
 * location (label like "Home", full address underneath, explicit
 * "Change" action on the right) instead of filter pills. This is the
 * pattern most on-demand service apps lead with, since which address
 * you're booking for matters more upfront than a top-rated/nearby
 * sort — and it's something the user genuinely needs to check and
 * correct before browsing, not just a nice-to-have shortcut.
 * A small notification bell sits in the hero's top row for tab parity
 * with Home; nothing else competes with the address card for attention.
 */
export function ServicesHero({
  topInset,
  title,
  subtitle = 'What do you need help with?',
  addressLabel,
  addressDetail,
  onChangeAddressPress,
  onNotificationPress,
  hasUnreadNotification = false,
}: ServicesHeroProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.hero, { paddingTop: topInset + 14 }]}>
        <View style={styles.heroDecor} />

        {/* <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <Pressable
            accessibilityRole='button'
            onPress={onNotificationPress}
            style={({ pressed }) => [styles.bellButton, pressed && { opacity: 0.8 }]}
            hitSlop={8}
          >
            <Bell size={17} color={AppColors.secondary} strokeWidth={2} />
            {hasUnreadNotification && <View style={styles.bellDot} />}
          </Pressable>
        </View> */}
      </View>

      {/* Floating address card — overlaps hero + body */}
      <View style={styles.cardWrap}>
        <Pressable
          accessibilityRole='button'
          onPress={onChangeAddressPress}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.pinWrap}>
            <MapPin size={18} color={AppColors.primary} strokeWidth={2.25} />
          </View>

          <View style={styles.addressText}>
            <Text style={styles.addressLabel} numberOfLines={1}>
              {addressLabel}
            </Text>
            <Text style={styles.addressDetail} numberOfLines={1}>
              {addressDetail}
            </Text>
          </View>

          <View style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>Change</Text>
            <ChevronRight size={14} color={AppColors.primary} strokeWidth={2.25} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const CARD_HEIGHT = 68;

const styles = StyleSheet.create({
  wrap: { marginBottom: CARD_HEIGHT / 2 + 8 },
  hero: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -70,
    right: -50,
  },

  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  title: { fontFamily: 'Poppins_600SemiBold', fontSize: 22, color: AppColors.textPrimary },
  subtitle: {
    marginTop: 4,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AppColors.error,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },

  // Floating card
  cardWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: -CARD_HEIGHT / 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: CARD_HEIGHT,
    borderRadius: 18,
    paddingHorizontal: 14,
    backgroundColor: AppColors.white,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardPressed: { backgroundColor: AppColors.warningLight },
  pinWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  addressText: { flex: 1 },
  addressLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: AppColors.textPrimary },
  addressDetail: {
    marginTop: 2,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.textTertiary,
  },
  changeBtn: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  changeBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: AppColors.primary },
});

export default ServicesHero;
