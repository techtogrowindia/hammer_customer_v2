import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Briefcase, Crosshair, Home, MapPin, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type LabelOption = { id: 'home' | 'work' | 'other'; label: string; Icon: typeof Home };

const labelOptions: LabelOption[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'work', label: 'Work', Icon: Briefcase },
  { id: 'other', label: 'Other', Icon: MapPin },
];

export default function AddAddressScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(params.id);

  const [query, setQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<'home' | 'work' | 'other'>('home');
  const [customLabel, setCustomLabel] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const useCurrentLocation = () => {
    // Would trigger expo-location + reverse geocoding, then prefill the
    // fields below with the resolved address.
  };

  const saveAddress = () => {
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
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Address' : 'Add New Address'}</Text>
          <View style={{ width: 38 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search + GPS detection live here, not on the select screen */}
        <View style={styles.searchBar}>
          <Search size={17} color={AppColors.textTertiary} strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Search for area, street name...'
            placeholderTextColor={AppColors.textTertiary}
            style={styles.searchInput}
          />
        </View>

        <Pressable
          accessibilityRole='button'
          onPress={useCurrentLocation}
          style={({ pressed }) => [styles.currentLocationRow, pressed && { backgroundColor: AppColors.warningLight }]}
        >
          <View style={styles.currentLocationIconWrap}>
            <Crosshair size={17} color={AppColors.primary} strokeWidth={2.25} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.currentLocationText}>Use current location</Text>
            <Text style={styles.currentLocationSubtext}>Detect using GPS</Text>
          </View>
        </Pressable>

        {/* Manual address form */}
        <Text style={styles.sectionLabel}>Address details</Text>

        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>House / Flat / Floor No.</Text>
          <TextInput
            value={houseNo}
            onChangeText={setHouseNo}
            placeholder='e.g. Flat 302, Block C'
            placeholderTextColor={AppColors.textTertiary}
            style={styles.fieldInput}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Street / Area</Text>
          <TextInput
            value={street}
            onChangeText={setStreet}
            placeholder='e.g. 1st Main Road, Indiranagar'
            placeholderTextColor={AppColors.textTertiary}
            style={styles.fieldInput}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Landmark (optional)</Text>
          <TextInput
            value={landmark}
            onChangeText={setLandmark}
            placeholder='e.g. Near City Hospital'
            placeholderTextColor={AppColors.textTertiary}
            style={styles.fieldInput}
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>City</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder='Chennai'
              placeholderTextColor={AppColors.textTertiary}
              style={styles.fieldInput}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Pincode</Text>
            <TextInput
              value={pincode}
              onChangeText={setPincode}
              placeholder='600038'
              placeholderTextColor={AppColors.textTertiary}
              keyboardType='number-pad'
              maxLength={6}
              style={styles.fieldInput}
            />
          </View>
        </View>

        {/* Save as label */}
        <Text style={styles.sectionLabel}>Save address as</Text>
        <View style={styles.labelRow}>
          {labelOptions.map((opt) => {
            const selected = selectedLabel === opt.id;
            return (
              <Pressable
                key={opt.id}
                accessibilityRole='button'
                onPress={() => setSelectedLabel(opt.id)}
                style={[styles.labelChip, selected && styles.labelChipSelected]}
              >
                <opt.Icon size={14} color={selected ? AppColors.white : AppColors.textSecondary} strokeWidth={2.25} />
                <Text style={[styles.labelChipText, selected && styles.labelChipTextSelected]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {selectedLabel === 'other' && (
          <View style={[styles.formGroup, { marginTop: 12 }]}>
            <Text style={styles.fieldLabel}>Custom label</Text>
            <TextInput
              value={customLabel}
              onChangeText={setCustomLabel}
              placeholder="e.g. Mom's place"
              placeholderTextColor={AppColors.textTertiary}
              style={styles.fieldInput}
            />
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 12 }]}>
        <Pressable
          accessibilityRole='button'
          onPress={saveAddress}
          style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
        >
          <Text style={styles.saveBtnText}>{isEditing ? 'Save Changes' : 'Save Address'}</Text>
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

  scrollContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontFamily: font.medium, fontSize: 13, color: AppColors.textPrimary },

  currentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    marginBottom: 24,
  },
  currentLocationIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  currentLocationText: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.primary },
  currentLocationSubtext: { marginTop: 2, fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },

  sectionLabel: { marginBottom: 12, fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },

  formGroup: { marginBottom: 14 },
  formRow: { flexDirection: 'row', gap: 12 },
  fieldLabel: { marginBottom: 6, fontFamily: font.medium, fontSize: 11.5, color: AppColors.textSecondary },
  fieldInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    fontFamily: font.medium,
    fontSize: 13,
    color: AppColors.textPrimary,
  },

  // Label chips
  labelRow: { flexDirection: 'row', gap: 8 },
  labelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
  },
  labelChipSelected: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  labelChipText: { fontFamily: font.medium, fontSize: 12, color: AppColors.textSecondary },
  labelChipTextSelected: { color: AppColors.white },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: AppColors.divider,
  },
  saveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
  },
  saveBtnPressed: { backgroundColor: AppColors.primaryDark },
  saveBtnText: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.white },
});
