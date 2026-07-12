import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router } from 'expo-router';
import { ArrowLeft, Briefcase, Check, Home, MapPin, Pencil, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
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

/**
 * SIMPLIFIED: dropped the search bar and "use current location" row —
 * those belong to the *add new address* flow (you're creating a new
 * pin/entry there), not here. This screen's only job is picking among
 * addresses you already have saved, so it's just the list + a way to
 * add another one. Header is a plain colored bar (no floating card),
 * since there's no search action for it to house anymore.
 */
export default function SelectAddressScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState('a1');

  const selectAddress = (id: string) => {
    setSelectedId(id);
    router.back();
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle='light-content' backgroundColor={AppColors.primary} translucent={false} />

      <View style={[styles.hero, { paddingTop: top + 12 }]}>
        <View style={styles.heroDecor} />
        <View style={styles.heroTopRow}>
          <Pressable
            accessibilityRole='button'
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            hitSlop={8}
          >
            <ArrowLeft size={19} color={AppColors.white} strokeWidth={2.25} />
          </Pressable>
          <Text style={styles.headerTitle}>Select Address</Text>
          <View style={{ width: 38 }} />
        </View>
      </View>

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
              <View style={[styles.addressIconWrap, selected && styles.addressIconWrapSelected]}>
                <TypeIcon size={17} color={selected ? AppColors.white : AppColors.primary} strokeWidth={2.25} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.addressLabel}>{addr.label}</Text>
                <Text style={styles.addressDetail} numberOfLines={2}>
                  {addr.detail}
                </Text>
              </View>

              <View style={styles.addressActions}>
                {selected && (
                  <View style={styles.selectedCheck}>
                    <Check size={12} color={AppColors.white} strokeWidth={3} />
                  </View>
                )}
                <Pressable
                  accessibilityRole='button'
                  hitSlop={8}
                  style={styles.actionIconBtn}
                  onPress={() => router.push({ pathname: '/address/add-address', params: { id: addr.id } } as never)}
                >
                  <Pencil size={14} color={AppColors.textTertiary} strokeWidth={2} />
                </Pressable>
                <Pressable accessibilityRole='button' hitSlop={8} style={styles.actionIconBtn}>
                  <Trash2 size={14} color={AppColors.textTertiary} strokeWidth={2} />
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 12 }]}>
        <Pressable
          accessibilityRole='button'
          onPress={() => router.push('/address/add-address' as never)}
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
  screen: { flex: 1, backgroundColor: AppColors.white },

  hero: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingBottom: 18,
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
    // backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  headerTitle: { fontFamily: font.semiBold, fontSize: 16, color: AppColors.white },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  sectionLabel: { marginBottom: 12, fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },

  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    marginBottom: 10,
  },
  addressCardSelected: { borderColor: AppColors.primary, backgroundColor: AppColors.warningLight },
  addressIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
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
  addressActions: { alignItems: 'center', gap: 8 },
  selectedCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
  },
  actionIconBtn: { padding: 2 },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: AppColors.divider,
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
