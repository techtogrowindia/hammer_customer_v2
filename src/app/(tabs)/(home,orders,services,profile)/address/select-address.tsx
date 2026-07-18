import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router } from 'expo-router';
import { Briefcase, Check, Home, MapPin, Pencil, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type SavedAddress = {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  detail: string;
};

const TYPE_ICON = { home: Home, work: Briefcase, other: MapPin };

const savedAddresses: SavedAddress[] = [
  { id: 'a1', label: 'Home', type: 'home', detail: '123, 1st Main Road, Indiranagar, Chennai 660038' },
  { id: 'a2', label: 'Work', type: 'work', detail: 'Tower B, 4th Floor, DLF IT Park, Chennai 600096' },
  { id: 'a3', label: "Mom's place", type: 'other', detail: '45, Lake View Street, Adyar, Chennai 600020' },
];

export default function SelectAddressScreen() {
  const { bottom } = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState('a1');

  const selectAddress = (id: string) => {
    setSelectedId(id);
    router.back();
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Saved addresses</Text>
        {savedAddresses.map((addr) => {
          const selected = selectedId === addr.id;
          const TypeIcon = TYPE_ICON[addr.type];
          return (
            <Pressable
              key={addr.id}
              accessibilityRole='button'
              onPress={() => selectAddress(addr.id)}
              style={[styles.addressCard, selected && styles.addressCardSelected]}
            >
              <View style={styles.addressTopRow}>
                <View style={[styles.addressIconWrap, selected && styles.addressIconWrapSelected]}>
                  <TypeIcon size={17} color={selected ? AppColors.white : AppColors.primary} strokeWidth={2.25} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.addressLabel}>{addr.label}</Text>
                  <Text style={styles.addressDetail} numberOfLines={2}>
                    {addr.detail}
                  </Text>
                </View>

                {selected && (
                  <View style={styles.selectedCheck}>
                    <Check size={12} color={AppColors.white} strokeWidth={3} />
                  </View>
                )}
              </View>

              <View style={styles.addressActions}>
                <Pressable
                  accessibilityRole='button'
                  hitSlop={8}
                  style={styles.actionBtn}
                  onPress={() => router.push({ pathname: '/address/add-address', params: { id: addr.id } } as never)}
                >
                  <Pencil size={13} color={AppColors.textSecondary} strokeWidth={2} />
                  <Text style={styles.actionBtnText}>Edit</Text>
                </Pressable>
                <Pressable accessibilityRole='button' hitSlop={8} style={styles.actionBtn}>
                  <Trash2 size={13} color={AppColors.error} strokeWidth={2} />
                  <Text style={[styles.actionBtnText, { color: AppColors.error }]}>Delete</Text>
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottom + 12 }]}>
        <Pressable
          accessibilityRole='button'
          onPress={() => router.push('/address/select-location' as never)}
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
        >
          <Plus size={18} color={AppColors.white} strokeWidth={2.5} />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  sectionLabel: { marginBottom: 12, fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },

  addressCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 10,
  },
  addressCardSelected: { borderColor: AppColors.primary, backgroundColor: AppColors.warningLight },
  addressTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  addressIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  addressIconWrapSelected: { backgroundColor: AppColors.primary },
  addressLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  addressDetail: {
    marginTop: 3,
    fontFamily: font.regular,
    fontSize: 11.5,
    lineHeight: 16,
    color: AppColors.textSecondary,
  },
  selectedCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    marginTop: 2,
  },

  addressActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.divider,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 2 },
  actionBtnText: { fontFamily: font.medium, fontSize: 12, color: AppColors.textSecondary },

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
