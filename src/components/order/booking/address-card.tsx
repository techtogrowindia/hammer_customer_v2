import { styles } from '@/app/(tabs)/(home,orders,services,profile)/booking/[booking-id]';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { Address } from '@/domain/models/address/get-address-reponse';
import { router } from 'expo-router';
import { Check, ChevronDown, MapPin, Navigation } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

const font = {
  regular: fontTokens.fontFamily.regular,
  semiBold: 'Poppins_600SemiBold',
};

export function AddressCard({
  addressList,
  setSelectedAddressId,
  selectedAddressId,
  error,
  showValidation,
}: {
  addressList: Address[];
  setSelectedAddressId: (id: number) => void;
  selectedAddressId: number;
  error?: string | null;
  showValidation: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedAddress = addressList.find((a) => a.id === selectedAddressId);

  const addressDetail = (a?: typeof selectedAddress) =>
    a ? [a.address_line_1, a.address_line_2, a.city, a.pincode].filter(Boolean).join(', ') : 'No address selected';

  const goToCurrentLocation = () => {
    setOpen(false);

    router.push({
      pathname: '/address/select-location',
      params: {
        fromOrderFlow: 'true',
      },
    });
  };

  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.sectionLabel}>Service address</Text>

      <Pressable
        accessibilityRole='button'
        onPress={() => setOpen((prev) => !prev)}
        style={({ pressed }) => [cardStyles.addressRow, pressed && { backgroundColor: AppColors.warningLight }]}
      >
        <View style={cardStyles.addressIconWrap}>
          <MapPin size={17} color={AppColors.primary} strokeWidth={2.25} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={cardStyles.addressLabel} numberOfLines={1}>
            {addressDetail(selectedAddress)}
          </Text>
          {/* <Text style={cardStyles.addressDetail} numberOfLines={1}></Text> */}
        </View>
        <Animated.View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <ChevronDown size={16} color={AppColors.textTertiary} strokeWidth={2} />
        </Animated.View>
      </Pressable>

      {open && (
        <Animated.View layout={LinearTransition.duration(220)} style={cardStyles.dropdown}>
          {addressList.map((address) => {
            const isSelected = address.id === selectedAddress?.id;
            return (
              <Animated.View key={address.id} entering={FadeIn.duration(160)}>
                <Pressable
                  accessibilityRole='button'
                  onPress={() => {
                    setSelectedAddressId(address.id);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    cardStyles.dropdownItem,
                    isSelected && cardStyles.dropdownItemSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={cardStyles.dropdownItemLabel} numberOfLines={4}>
                      {addressDetail(address)}
                    </Text>
                  </View>
                  {isSelected && <Check size={16} color={AppColors.primary} strokeWidth={2.5} />}
                </Pressable>
              </Animated.View>
            );
          })}

          {addressList.length === 0 && <Text style={cardStyles.emptyText}>No saved addresses yet.</Text>}

          <Pressable
            accessibilityRole='button'
            onPress={goToCurrentLocation}
            style={({ pressed }) => [cardStyles.addLocationBtn, pressed && { opacity: 0.85 }]}
          >
            <Navigation size={15} color={AppColors.primaryDark ?? AppColors.primary} strokeWidth={2.25} />
            <Text style={cardStyles.addLocationText}>Add address using current location</Text>
          </Pressable>
        </Animated.View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 16,
    gap: 8,
  },
  sectionLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 12 },
  addressIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  addressLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  addressDetail: { marginTop: 2, fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  dropdown: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.background,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  dropdownItemSelected: { backgroundColor: AppColors.warningLight },
  dropdownItemLabel: { fontFamily: font.regular, fontSize: 12.5, color: AppColors.textPrimary },
  dropdownItemDetail: { marginTop: 2, fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  emptyText: {
    padding: 14,
    textAlign: 'center',
    fontFamily: font.regular,
    fontSize: 12,
    color: AppColors.textTertiary,
  },
  addLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    backgroundColor: AppColors.warningLight,
  },
  addLocationText: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.primaryDark ?? AppColors.primary },
});
