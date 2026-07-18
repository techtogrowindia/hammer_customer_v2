import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

// Simple RFC-5322-ish check — good enough for a client-side sanity check;
// real validation still needs to happen server-side.
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function EditProfileScreen() {
  const { bottom } = useSafeAreaInsets();

  const [avatarUri, setAvatarUri] = useState('https://i.pravatar.cc/200?img=12');
  const [name, setName] = useState('Aswick Jothi');
  const [email, setEmail] = useState('');
  const mobileNumber = '987-654-3210';

  const [showValidation, setShowValidation] = useState(false);
  const [saving, setSaving] = useState(false);

  const changePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to change your profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const errors = {
    name: name.trim().length === 0 ? 'Name is required' : null,
    email: email.trim().length > 0 && !isValidEmail(email) ? 'Enter a valid email address' : null,
  };
  const hasErrors = Boolean(errors.name || errors.email);

  const saveProfile = async () => {
    if (hasErrors) {
      setShowValidation(true);
      return;
    }
    setSaving(true);
    // TODO: upload avatarUri (if changed) + persist { name, email } to the
    // backend here. mobileNumber is intentionally excluded — changing it
    // needs its own OTP-verification flow, not a plain text edit.
    setSaving(false);
    router.back();
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.avatarBlock}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} resizeMode='cover' />
            <Pressable
              accessibilityRole='button'
              onPress={changePhoto}
              style={({ pressed }) => [styles.avatarEditBadge, pressed && { opacity: 0.85 }]}
              hitSlop={8}
            >
              <Camera size={14} color={AppColors.white} strokeWidth={2.25} />
            </Pressable>
          </View>
          <Pressable accessibilityRole='button' onPress={changePhoto} hitSlop={8}>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </Pressable>
        </View>

        {/* Name */}
        <View style={styles.card}>
          <View style={styles.fieldLabelRow}>
            <User size={13} color={AppColors.textSecondary} strokeWidth={2.25} />
            <Text style={styles.fieldLabel}>Full name</Text>
          </View>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder='Enter your full name'
            placeholderTextColor={AppColors.textTertiary}
            style={styles.fieldInput}
          />
          {showValidation && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Mobile number — non-editable */}
        <View style={styles.card}>
          <View style={styles.fieldLabelRow}>
            <Lock size={12} color={AppColors.textTertiary} strokeWidth={2.25} />
            <Text style={styles.fieldLabel}>Mobile number</Text>
          </View>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>{mobileNumber}</Text>
          </View>
          <Text style={styles.helperText}>Your mobile number is verified and can't be changed here.</Text>
        </View>

        {/* Email — optional */}
        <View style={styles.card}>
          <View style={styles.fieldLabelRow}>
            <Mail size={13} color={AppColors.textSecondary} strokeWidth={2.25} />
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.optionalTag}>Optional</Text>
          </View>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder='you@example.com'
            placeholderTextColor={AppColors.textTertiary}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            style={styles.fieldInput}
          />
          {showValidation && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottom + 12 }]}>
        <Pressable
          accessibilityRole='button'
          onPress={saveProfile}
          disabled={saving}
          style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed, saving && { opacity: 0.7 }]}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 92;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 },

  avatarBlock: { alignItems: 'center', gap: 10, marginBottom: 28 },
  avatarWrap: { width: AVATAR_SIZE, height: AVATAR_SIZE },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: AppColors.warningLight,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderWidth: 2,
    borderColor: AppColors.background,
  },
  changePhotoText: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.primary },

  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 14,
  },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  fieldLabel: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.textPrimary },
  optionalTag: { marginLeft: 'auto', fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },

  fieldInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.background,
    fontFamily: font.medium,
    fontSize: 13,
    color: AppColors.textPrimary,
  },
  errorText: { marginTop: 6, fontFamily: font.medium, fontSize: 11, color: AppColors.error },

  readOnlyField: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: AppColors.divider,
  },
  readOnlyText: { fontFamily: font.medium, fontSize: 13, color: AppColors.textSecondary },
  helperText: { marginTop: 8, fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },

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
