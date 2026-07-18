import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router } from 'expo-router';
import { Pencil, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ProfileHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={styles.wrap}>
      <View style={[styles.hero, { paddingTop: top + 14 }]}>
        <View style={styles.heroDecor} />
      </View>

      <View style={styles.cardWrap}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: 'https://i.pravatar.cc/200?img=12',
              }}
              style={styles.avatarImage}
              resizeMode='cover'
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {'ASWICK JOTHI'}
            </Text>
            <View style={styles.badgeRow}>
              <Text style={styles.mobile}>{'987-654-3210'}</Text>
              {true && (
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={10} color={AppColors.primary} strokeWidth={2.25} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>

          <Pressable
            accessibilityRole='button'
            onPress={() => {
              router.push('/(tabs)/(profile)/edit-profile');
            }}
            style={({ pressed }) => [styles.editButton, pressed && { opacity: 0.7 }]}
            hitSlop={8}
          >
            <Pencil size={15} color={AppColors.primary} strokeWidth={2.25} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const CARD_HEIGHT = 84;

const styles = StyleSheet.create({
  wrap: { marginBottom: CARD_HEIGHT / 2 + 8 },
  hero: {
    height: 108,
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
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
    // backgroundColor: 'rgba(255,255,255,0.08)',
  },
  eyebrow: {
    fontFamily: fontTokens.fontFamily.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },

  //  card
  cardWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: -CARD_HEIGHT / 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: AppColors.warningLight,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: CARD_HEIGHT,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: AppColors.white,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  info: { flex: 1 },
  name: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: AppColors.textPrimary },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 },
  mobile: { fontFamily: fontTokens.fontFamily.regular, fontSize: 12, color: AppColors.textSecondary },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: AppColors.warningLight,
  },
  verifiedText: { fontFamily: fontTokens.fontFamily.medium, fontSize: 10, color: AppColors.primary },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
});

export default ProfileHeader;
