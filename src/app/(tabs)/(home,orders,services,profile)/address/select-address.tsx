import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { Address } from '@/domain/models/address/get-address-reponse';
import { useBoundStore } from '@/store/boundStore';
import { router } from 'expo-router';
import { MapPin, MapPinPlus, Pencil, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

const buildPrimaryLine = (addr: Address) => addr.address_line_1 || addr.address_line_2 || 'Address';
const buildSecondaryLine = (addr: Address) =>
  [addr.address_line_1 ? addr.address_line_2 : null, addr.city, addr.pincode].filter(Boolean).join(', ');

export default function SelectAddressScreen() {
  const { bottom } = useSafeAreaInsets();

  const { addressList, removeAddress } = useBoundStore(
    useShallow((state) => ({
      addressList: state.addressList,
      removeAddress: state.removeAddress,
    })),
  );

  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (addressList.length === 0) {
      setSelectedId(undefined);
      return;
    }
    if (!addressList.some((a) => a.id === selectedId)) {
      setSelectedId(addressList[0].id);
    }
  }, [addressList]);

  const selectAddress = (id: number) => {
    setSelectedId(id);
    router.back();
  };

  const editAddress = (addr: Address) => {
    router.push({
      pathname: '/address/add-address',
      params: {
        id: String(addr.id ?? ''),
        houseNo: addr.address_line_1 ?? '',
        street: addr.address_line_2 ?? '',
        city: addr.city ?? '',
        pincode: addr.pincode ?? '',
        state: addr.state ?? '',
        country: addr.country ?? 'India',
        lat: addr.latitude != null ? String(addr.latitude) : '',
        lng: addr.longitude != null ? String(addr.longitude) : '',
        formattedAddress: buildSecondaryLine(addr),
      },
    } as never);
  };

  const deleteAddress = (addr: Address) => {
    Alert.alert('Delete address', 'Remove this address from your saved addresses?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (addr.id == null) return;
          if (selectedId === addr.id) {
            const fallback = addressList.find((a) => a.id !== addr.id)?.id;
            setSelectedId(fallback);
          }
          removeAddress(addr.id);
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>Saved addresses</Text>
          {addressList.length > 0 && <Text style={styles.sectionCount}>{addressList.length}</Text>}
        </View>

        {addressList.map((addr) => {
          const selected = selectedId === addr.id;
          return (
            <Pressable
              key={addr.id}
              accessibilityRole='radio'
              accessibilityState={{ checked: selected }}
              onPress={() => selectAddress(addr?.id ?? 0)}
              style={({ pressed }) => [
                styles.addressCard,
                selected && styles.addressCardSelected,
                pressed && !selected && styles.addressCardPressed,
              ]}
            >
              <View style={styles.addressTopRow}>
                <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
                  <MapPin size={16} color={selected ? AppColors.white : AppColors.textSecondary} strokeWidth={2.25} />
                </View>

                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.addressPrimary} numberOfLines={1}>
                    {buildPrimaryLine(addr)}
                  </Text>
                  <Text style={styles.addressSecondary} numberOfLines={2}>
                    {buildSecondaryLine(addr)}
                  </Text>
                </View>

                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </View>

              <View style={styles.addressActions}>
                <Pressable
                  accessibilityRole='button'
                  hitSlop={8}
                  style={({ pressed }) => [styles.actionPill, pressed && styles.actionPillPressed]}
                  onPress={(e) => {
                    e.stopPropagation();
                    editAddress(addr);
                  }}
                >
                  <Pencil size={12.5} color={AppColors.textSecondary} strokeWidth={2.25} />
                  <Text style={styles.actionPillText}>Edit</Text>
                </Pressable>
                <Pressable
                  accessibilityRole='button'
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.actionPill,
                    styles.actionPillDanger,
                    pressed && styles.actionPillDangerPressed,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    deleteAddress(addr);
                  }}
                >
                  <Trash2 size={12.5} color={AppColors.error} strokeWidth={2.25} />
                  <Text style={[styles.actionPillText, { color: AppColors.error }]}>Delete</Text>
                </Pressable>
              </View>
            </Pressable>
          );
        })}

        {addressList.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <MapPin size={26} color={AppColors.primary} strokeWidth={1.75} />
            </View>
            <Text style={styles.emptyStateTitle}>No saved addresses</Text>
            <Text style={styles.emptyStateSubtext}>Add an address so we know exactly where to send help.</Text>
            <Pressable
              accessibilityRole='button'
              onPress={() => router.push('/address/select-location' as never)}
              style={({ pressed }) => [styles.emptyAddBtn, pressed && styles.addBtnPressed]}
            >
              <MapPinPlus size={16} color={AppColors.white} strokeWidth={2.25} />
              <Text style={styles.addBtnText}>Add an address</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {addressList.length > 0 && (
        <View style={[styles.footer, { paddingBottom: bottom + 12 }]}>
          <Pressable
            accessibilityRole='button'
            onPress={() => router.push('/address/select-location' as never)}
            style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
          >
            <MapPinPlus size={18} color={AppColors.white} strokeWidth={2.25} />
            <Text style={styles.addBtnText}>Add new address</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  sectionCount: {
    fontFamily: font.medium,
    fontSize: 11,
    color: AppColors.textTertiary,
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 10,
    overflow: 'hidden',
  },

  addressCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 10,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  // Accent border only — no full-card color wash, so it reads clean and the
  // action pills underneath stay legible instead of fighting a tinted bg.
  addressCardSelected: { borderColor: AppColors.primary },
  addressCardPressed: { backgroundColor: AppColors.background },

  addressTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  iconWrapSelected: { backgroundColor: AppColors.primary },

  addressPrimary: { fontFamily: font.semiBold, fontSize: 13.5, color: AppColors.textPrimary },
  addressSecondary: {
    marginTop: 2,
    fontFamily: font.regular,
    fontSize: 11.5,
    lineHeight: 15,
    color: AppColors.textSecondary,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: AppColors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: AppColors.primary },

  addressActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.divider,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: AppColors.background,
  },
  actionPillPressed: { opacity: 0.6 },
  actionPillDanger: { backgroundColor: AppColors.background },
  actionPillDangerPressed: { opacity: 0.6 },
  actionPillText: { fontFamily: font.medium, fontSize: 11.5, color: AppColors.textSecondary },

  emptyState: { alignItems: 'center', gap: 6, paddingVertical: 48, paddingHorizontal: 12 },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
    marginBottom: 6,
  },
  emptyStateTitle: { fontFamily: font.semiBold, fontSize: 15, color: AppColors.textPrimary },
  emptyStateSubtext: {
    fontFamily: font.regular,
    fontSize: 12.5,
    lineHeight: 18,
    color: AppColors.textTertiary,
    textAlign: 'center',
    marginBottom: 14,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
  },
  addBtnPressed: { backgroundColor: AppColors.primaryDark },
  addBtnText: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.white },
});
