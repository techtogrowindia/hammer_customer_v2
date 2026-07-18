import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { Briefcase, ChevronRight, Home, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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

type RouteParams = {
  id?: string;
  lat?: string;
  lng?: string;
  street?: string;
  city?: string;
  pincode?: string;
  formattedAddress?: string;
};

export default function AddAddressScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const params = useLocalSearchParams<RouteParams>();
  const isEditing = Boolean(params.id);

  // Pre-filled from SelectLocationScreen's Places result where available —
  // still editable, since Google's parsing isn't always exact for Indian
  // addresses (e.g. apartment/floor numbers never come from Places).
  const [selectedLabel, setSelectedLabel] = useState<'home' | 'work' | 'other'>('home');
  const [customLabel, setCustomLabel] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState(params.street ?? '');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState(params.city ?? '');
  const [pincode, setPincode] = useState(params.pincode ?? '');

  const hasLocation = Boolean(params.lat && params.lng);

  const changeLocation = () => {
    router.back();
  };

  const saveAddress = () => {
    // TODO: persist { houseNo, street, landmark, city, pincode, label,
    // lat: params.lat, lng: params.lng } to the backend/store here.
    router.dismissAll();
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Location</Text>
        <Pressable
          accessibilityRole='button'
          onPress={changeLocation}
          style={({ pressed }) => [styles.locationCard, pressed && { backgroundColor: AppColors.warningLight }]}
        >
          <View style={styles.locationIconWrap}>
            <MapPin size={17} color={AppColors.primary} strokeWidth={2.25} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationLabel}>{hasLocation ? 'Pinned location' : 'No location selected'}</Text>
            <Text style={styles.locationValue} numberOfLines={2}>
              {params.formattedAddress || 'Tap to pick a location on the map'}
            </Text>
          </View>
          <View style={styles.changeChip}>
            <Text style={styles.changeChipText}>Change</Text>
            <ChevronRight size={14} color={AppColors.primary} strokeWidth={2.25} />
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

      <View style={[styles.footer, { paddingBottom: bottom + 12 }]}>
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
  screen: { flex: 1, backgroundColor: AppColors.background },

  scrollContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24 },

  sectionLabel: { marginBottom: 12, fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },

  // Location summary card
  locationCard: {
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
  locationIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  locationLabel: { fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  locationValue: { marginTop: 3, fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  changeChip: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  changeChipText: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.primary },

  formGroup: { marginBottom: 14 },
  formRow: { flexDirection: 'row', gap: 12 },
  fieldLabel: { marginBottom: 6, fontFamily: font.medium, fontSize: 11.5, color: AppColors.textSecondary },
  fieldInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
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
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  labelChipSelected: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  labelChipText: { fontFamily: font.medium, fontSize: 12, color: AppColors.textSecondary },
  labelChipTextSelected: { color: AppColors.white },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.surface,
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
