import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Banknote,
  Calendar,
  ChevronRight,
  CreditCard,
  MapPin,
  Smartphone,
  Sun,
  Sunrise,
  Sunset,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type PackageInfo = { label: string; price: number; duration: string };

const PACKAGE_MAP: Record<string, PackageInfo> = {
  basic: { label: 'Basic Clean', price: 349, duration: '2 hrs' },
  deep: { label: 'Deep Clean', price: 599, duration: '3.5 hrs' },
};

type DateOption = { id: string; day: string; date: string; isToday?: boolean };
type TimeSlot = { id: string; label: string; time: string; Icon: typeof Sun };
type PaymentMethod = { id: string; label: string; subtitle: string; Icon: typeof CreditCard };

const dateOptions: DateOption[] = [
  { id: 'd1', day: 'Today', date: '12 Jul', isToday: true },
  { id: 'd2', day: 'Sun', date: '13 Jul' },
  { id: 'd3', day: 'Mon', date: '14 Jul' },
  { id: 'd4', day: 'Tue', date: '15 Jul' },
  { id: 'd5', day: 'Wed', date: '16 Jul' },
  { id: 'd6', day: 'Thu', date: '17 Jul' },
];

const timeSlots: TimeSlot[] = [
  { id: 't1', label: 'Morning', time: '8:00 – 11:00 AM', Icon: Sunrise },
  { id: 't2', label: 'Afternoon', time: '12:00 – 3:00 PM', Icon: Sun },
  { id: 't3', label: 'Evening', time: '4:00 – 7:00 PM', Icon: Sunset },
];

const paymentMethods: PaymentMethod[] = [
  { id: 'upi', label: 'UPI', subtitle: 'Google Pay, PhonePe & more', Icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, Rupay', Icon: CreditCard },
  { id: 'cash', label: 'Pay after service', subtitle: 'Cash or UPI at your door', Icon: Banknote },
];

export default function BookingScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; package?: string }>();

  const packageInfo = PACKAGE_MAP[params.package ?? 'deep'] ?? PACKAGE_MAP.deep;

  const [selectedDate, setSelectedDate] = useState('d1');
  const [selectedSlot, setSelectedSlot] = useState('t2');
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const serviceFee = 29;
  const total = packageInfo.price + serviceFee;

  const confirmBooking = () => {
    router.push({ pathname: '/booking/confirm-booking' as never, params: { id: params.id ?? '' } as never });
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Selected service summary */}
        <View style={styles.serviceSummary}>
          <Text style={styles.serviceSummaryLabel}>Booking for</Text>
          <Text style={styles.serviceSummaryTitle}>{packageInfo.label} · Bathroom Deep Cleaning</Text>
          <Text style={styles.serviceSummaryDuration}>Estimated duration: {packageInfo.duration}</Text>
        </View>

        {/* Address */}
        <Text style={styles.sectionLabel}>Service address</Text>
        <Pressable
          accessibilityRole='button'
          onPress={() => router.push('/profile/addresses' as never)}
          style={({ pressed }) => [styles.addressCard, pressed && styles.addressCardPressed]}
        >
          <View style={styles.pinWrap}>
            <MapPin size={18} color={AppColors.primary} strokeWidth={2.25} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addressLabel}>Home · Indiranagar</Text>
            <Text style={styles.addressDetail} numberOfLines={1}>
              123, 1st Main Road, Chennai, Tamilnadu 660038
            </Text>
          </View>
          <ChevronRight size={16} color={AppColors.textTertiary} strokeWidth={2} />
        </Pressable>

        {/* Date */}
        <Text style={styles.sectionLabel}>Select date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {dateOptions.map((d) => {
            const selected = selectedDate === d.id;
            return (
              <Pressable
                key={d.id}
                accessibilityRole='button'
                onPress={() => setSelectedDate(d.id)}
                style={[styles.dateChip, selected && styles.dateChipSelected]}
              >
                <Text style={[styles.dateChipDay, selected && styles.dateChipTextSelected]}>{d.day}</Text>
                <Text style={[styles.dateChipDate, selected && styles.dateChipTextSelected]}>{d.date}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Time slot */}
        <Text style={styles.sectionLabel}>Select time slot</Text>
        {timeSlots.map((slot) => {
          const selected = selectedSlot === slot.id;
          return (
            <Pressable
              key={slot.id}
              accessibilityRole='button'
              onPress={() => setSelectedSlot(slot.id)}
              style={[styles.slotRow, selected && styles.slotRowSelected]}
            >
              <View style={styles.slotIconWrap}>
                <slot.Icon size={17} color={AppColors.primary} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.slotLabel}>{slot.label}</Text>
                <Text style={styles.slotTime}>{slot.time}</Text>
              </View>
              <View style={styles.radioOuter}>{selected && <View style={styles.radioInner} />}</View>
            </Pressable>
          );
        })}

        {/* Payment method */}
        <Text style={styles.sectionLabel}>Payment method</Text>
        {paymentMethods.map((method) => {
          const selected = selectedPayment === method.id;
          return (
            <Pressable
              key={method.id}
              accessibilityRole='button'
              onPress={() => setSelectedPayment(method.id)}
              style={[styles.slotRow, selected && styles.slotRowSelected]}
            >
              <View style={styles.slotIconWrap}>
                <method.Icon size={17} color={AppColors.primary} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.slotLabel}>{method.label}</Text>
                <Text style={styles.slotTime}>{method.subtitle}</Text>
              </View>
              <View style={styles.radioOuter}>{selected && <View style={styles.radioInner} />}</View>
            </Pressable>
          );
        })}

        {/* Price summary */}
        <Text style={styles.sectionLabel}>Price summary</Text>
        <View style={styles.priceSummaryCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>{packageInfo.label}</Text>
            <Text style={styles.priceRowValue}>₹{packageInfo.price}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Service fee</Text>
            <Text style={styles.priceRowValue}>₹{serviceFee}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceTotalLabel}>Total amount</Text>
            <Text style={styles.priceTotalValue}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky confirm bar */}
      <SafeAreaView edges={['bottom']} style={[styles.confirmBar, { paddingBottom: 12 }]}>
        <View>
          <Text style={styles.confirmBarLabel}>Total</Text>
          <Text style={styles.confirmBarPrice}>₹{total}</Text>
        </View>
        <Pressable
          accessibilityRole='button'
          onPress={confirmBooking}
          style={({ pressed }) => [styles.confirmBtn, pressed && styles.confirmBtnPressed]}
        >
          <Calendar size={16} color={AppColors.white} strokeWidth={2.25} />
          <Text style={styles.confirmBtnText}>Confirm Booking</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },

  serviceSummary: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 22,
  },
  serviceSummaryLabel: { fontFamily: font.regular, fontSize: 11, color: AppColors.textSecondary },
  serviceSummaryTitle: { marginTop: 4, fontFamily: font.semiBold, fontSize: 14, color: AppColors.textPrimary },
  serviceSummaryDuration: { marginTop: 4, fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },

  sectionLabel: {
    marginBottom: 12,
    fontFamily: font.semiBold,
    fontSize: 14,
    color: AppColors.textPrimary,
  },

  // Address
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 22,
  },
  addressCardPressed: { backgroundColor: AppColors.warningLight },
  pinWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  addressLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  addressDetail: { marginTop: 2, fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },

  // Date chips
  dateRow: { gap: 8, paddingBottom: 22 },
  dateChip: {
    width: 62,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  dateChipSelected: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  dateChipDay: { fontFamily: font.medium, fontSize: 11, color: AppColors.textSecondary },
  dateChipDate: { marginTop: 4, fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  dateChipTextSelected: { color: AppColors.white },

  // Slot / payment rows
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 10,
  },
  slotRowSelected: { borderColor: AppColors.primary, backgroundColor: AppColors.warningLight },
  slotIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  slotLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  slotTime: { marginTop: 2, fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: AppColors.primary },

  // Price summary
  priceSummaryCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  priceRowLabel: { fontFamily: font.regular, fontSize: 13, color: AppColors.textSecondary },
  priceRowValue: { fontFamily: font.medium, fontSize: 13, color: AppColors.textPrimary },
  priceDivider: { height: 1, backgroundColor: AppColors.border, marginVertical: 10 },
  priceTotalLabel: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.textPrimary },
  priceTotalValue: { fontFamily: font.bold, fontSize: 16, color: AppColors.primary },

  // Sticky confirm bar
  confirmBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  confirmBarLabel: { fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  confirmBarPrice: { marginTop: 2, fontFamily: font.bold, fontSize: 19, color: AppColors.textPrimary },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  confirmBtnPressed: { backgroundColor: AppColors.primaryDark },
  confirmBtnText: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.white },
});
