import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router } from 'expo-router';
import { ChevronRight, MapPin } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type Address = {
  label: string;
  detail: string;
};

interface ServiceHeaderProps {
  address?: Address;
  onChangeAddress?: () => void;
}

const CARD_HEIGHT = 78;

export function ServiceHeader({ address, onChangeAddress }: ServiceHeaderProps) {
  const { top } = useSafeAreaInsets();

  const handlePress = () => {
    if (onChangeAddress) {
      onChangeAddress();
      return;
    }
    router.push('/(tabs)/(services)/address/select-address');
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.hero, { paddingTop: top + 24 }]}>
        <View style={styles.heroDecor} />
        <View style={styles.heroDecorSmall} />
      </View>

      {/* Floating address card — overlaps hero + body */}
      <View style={styles.cardWrap}>
        <Pressable
          accessibilityRole='button'
          onPress={handlePress}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.pinWrap}>
            <MapPin size={18} color={AppColors.primary} strokeWidth={2.25} opacity={address ? 1 : 0.6} />
          </View>

          <View style={styles.addressText}>
            {address ? (
              <>
                <Text style={styles.addressLabel} numberOfLines={1}>
                  {address.label}
                </Text>
                <Text style={styles.addressDetail} numberOfLines={1}>
                  {address.detail}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.addressLabel} numberOfLines={1}>
                  Add your address
                </Text>
                <Text style={styles.addressDetail} numberOfLines={1}>
                  So we can show services available near you
                </Text>
              </>
            )}
          </View>

          <View style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>{address ? 'Change' : 'Add'}</Text>
            <ChevronRight size={14} color={AppColors.primary} strokeWidth={2.25} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: CARD_HEIGHT / 2 + 8, backgroundColor: AppColors.background },
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
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroDecorSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    bottom: -40,
    left: -30,
    backgroundColor: 'rgba(255,255,255,0.06)',
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
  addressLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  addressDetail: {
    marginTop: 2,
    fontFamily: font.regular,
    fontSize: 11,
    color: AppColors.textTertiary,
  },
  changeBtn: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  changeBtnText: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.primary },
});

export default ServiceHeader;
