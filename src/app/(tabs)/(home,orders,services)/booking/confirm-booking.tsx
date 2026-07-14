import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { Calendar, Check, Clock, CreditCard, MapPin, Share2, Sparkles } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

const summaryRows = [
  { id: 'service', label: 'Service', value: 'Bathroom Deep Cleaning', Icon: Sparkles },
  { id: 'datetime', label: 'Date & time', value: 'Today, 12:00 – 3:00 PM', Icon: Calendar },
  { id: 'address', label: 'Address', value: 'Home · 123, 1st Main Road, Indiranagar', Icon: MapPin },
  { id: 'payment', label: 'Payment', value: 'UPI · ₹628 paid', Icon: CreditCard },
];

export default function BookingConfirmationScreen() {
  const { bottom } = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const bookingId = params.id ? `BK-${params.id.toUpperCase()}` : 'BK-8834521';

  const goToTracking = () => {
    router.push({ pathname: '/orders/[id]', params: { id: params.id ?? '' } } as never);
  };

  const goHome = () => {
    router.replace('/' as never);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Success state */}
        <View style={styles.successBlock}>
          <View style={styles.checkRing}>
            <View style={styles.checkCircle}>
              <Check size={32} color={AppColors.white} strokeWidth={3} />
            </View>
          </View>

          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your professional has been notified and will arrive at the scheduled time.
          </Text>

          <View style={styles.bookingIdChip}>
            <Text style={styles.bookingIdLabel}>Booking ID</Text>
            <Text style={styles.bookingIdValue}>{bookingId}</Text>
          </View>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          {summaryRows.map((row, index) => (
            <View
              key={row.id}
              style={[styles.summaryRow, index !== summaryRows.length - 1 && styles.summaryRowDivider]}
            >
              <View style={styles.summaryIconWrap}>
                <row.Icon size={16} color={AppColors.primary} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue} numberOfLines={2}>
                  {row.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Share */}
        <Pressable accessibilityRole='button' style={({ pressed }) => [styles.shareRow, pressed && { opacity: 0.7 }]}>
          <Share2 size={15} color={AppColors.primary} strokeWidth={2} />
          <Text style={styles.shareText}>Share booking details</Text>
        </Pressable>
      </ScrollView>

      {/* Actions */}
      <View style={[styles.actions, { paddingBottom: 16 }]}>
        <Pressable
          accessibilityRole='button'
          onPress={goToTracking}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
        >
          <Clock size={16} color={AppColors.white} strokeWidth={2.25} />
          <Text style={styles.primaryBtnText}>Track Booking</Text>
        </Pressable>

        <Pressable
          accessibilityRole='button'
          onPress={goHome}
          style={({ pressed }) => [styles.secondaryBtn, pressed && { backgroundColor: AppColors.warningLight }]}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 32 },

  // Success block
  successBlock: { alignItems: 'center', marginBottom: 28 },
  checkRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
    marginBottom: 20,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E9E5B',
  },
  successTitle: { fontFamily: font.bold, fontSize: 22, color: AppColors.textPrimary },
  successSubtitle: {
    marginTop: 8,
    fontFamily: font.regular,
    fontSize: 13,
    lineHeight: 19,
    color: AppColors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  bookingIdChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    borderStyle: 'dashed',
  },
  bookingIdLabel: { fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  bookingIdValue: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.textPrimary },

  // Summary card
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    overflow: 'hidden',
    marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  summaryRowDivider: { borderBottomWidth: 1, borderBottomColor: AppColors.divider },
  summaryIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  summaryLabel: { fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  summaryValue: { marginTop: 3, fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },

  // Share row
  shareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 10 },
  shareText: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.primary },

  // Actions
  actions: {
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 10,
    borderTopWidth: 1.5,
    borderTopColor: AppColors.divider,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  primaryBtnPressed: { backgroundColor: AppColors.primaryDark },
  primaryBtnText: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.white },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
  },
  secondaryBtnText: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textSecondary },
});
