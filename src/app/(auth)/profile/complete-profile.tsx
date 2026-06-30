import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { Camera, CheckCircle2, Mars, Transgender, User, Venus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type Gender = 'male' | 'female' | 'other';

const GENDER_OPTIONS: { key: Gender; label: string; Icon: typeof Mars }[] = [
  { key: 'male', label: 'Male', Icon: Mars },
  { key: 'female', label: 'Female', Icon: Venus },
  { key: 'other', label: 'Other', Icon: Transgender },
];

export default function CompleteProfileScreen() {
  const params = useLocalSearchParams<{ mobile?: string }>();
  const mobile = params.mobile ?? '+91 98765 43210';

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const isValid = name.trim().length > 1 && gender !== null;

  const goBack = () => {
    router.back();
  };

  const pickPhoto = () => {
    // TODO: hook up expo-image-picker here and setPhotoUri(result.assets[0].uri)
  };

  const completeProfile = () => {
    if (!isValid) return;
    router.replace('/(tabs)/(home)');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable
          accessibilityRole='button'
          onPress={goBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <Text style={styles.backIcon}>{'\u2190'}</Text>
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.description}>Add a few details so we can personalize your experience.</Text>

          <Pressable accessibilityRole='button' onPress={pickPhoto} style={styles.avatarStage}>
            <View style={styles.avatarRing}>
              <View style={styles.avatarCircle}>
                <User size={40} color={AppColors.primary} strokeWidth={1.75} />
              </View>
              <View style={styles.avatarBadge}>
                <Camera size={15} color={AppColors.white} strokeWidth={2} />
              </View>
            </View>
            <Text style={styles.avatarLabel}>{photoUri ? 'Change photo' : 'Add a profile photo'}</Text>
          </Pressable>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
              <TextInput
                value={name}
                onChangeText={setName}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder='Enter your full name'
                placeholderTextColor={AppColors.textTertiary}
                autoCapitalize='words'
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Mobile Number</Text>
            <View style={[styles.inputWrap, styles.inputWrapDisabled]}>
              <Text style={styles.disabledInputText}>{mobile}</Text>
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={14} color={AppColors.primary} strokeWidth={2} />
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map((option) => {
                const selected = gender === option.key;
                const Icon = option.Icon;
                return (
                  <Pressable
                    key={option.key}
                    accessibilityRole='button'
                    onPress={() => setGender(option.key)}
                    style={[styles.genderPill, selected && styles.genderPillSelected]}
                  >
                    <Icon size={18} color={selected ? AppColors.primary : AppColors.textSecondary} strokeWidth={2} />
                    <Text style={[styles.genderLabel, selected && styles.genderLabelSelected]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole='button'
            disabled={!isValid}
            onPress={completeProfile}
            style={({ pressed }) => [
              styles.primaryButton,
              !isValid && styles.primaryButtonDisabled,
              pressed && isValid && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Complete Profile</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  flex: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 20,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.divider,
  },
  backButtonPressed: {
    backgroundColor: AppColors.warningLight,
  },
  backIcon: {
    fontSize: 18,
    color: AppColors.textPrimary,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    maxWidth: 330,
    fontFamily: font.bold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 0,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  description: {
    maxWidth: 322,
    marginTop: 10,
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  avatarStage: {
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 8,
  },
  avatarRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderWidth: 3,
    borderColor: AppColors.white,
  },
  avatarLabel: {
    marginTop: 12,
    fontFamily: font.medium,
    fontSize: 13,
    color: AppColors.primary,
  },
  fieldGroup: {
    width: '100%',
    maxWidth: 330,
    marginTop: 22,
  },
  fieldLabel: {
    marginBottom: 8,
    fontFamily: font.medium,
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  inputWrap: {
    width: '100%',
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingHorizontal: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
  },
  inputWrapFocused: {
    borderColor: AppColors.primary,
  },
  inputWrapDisabled: {
    backgroundColor: AppColors.warningLight,
    borderColor: AppColors.warningLight,
  },
  input: {
    flex: 1,
    fontFamily: font.medium,
    fontSize: 15,
    color: AppColors.textPrimary,
  },
  disabledInputText: {
    fontFamily: font.medium,
    fontSize: 15,
    color: AppColors.textSecondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  verifiedBadgeText: {
    fontFamily: font.medium,
    fontSize: 11,
    color: AppColors.primary,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderPill: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
  },
  genderPillSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.warningLight,
  },
  genderLabel: {
    fontFamily: font.medium,
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  genderLabelSelected: {
    fontFamily: font.semiBold,
    color: AppColors.primary,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 34,
    paddingBottom: 30,
    paddingTop: 12,
  },
  primaryButton: {
    width: '100%',
    maxWidth: 306,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 9 },
    elevation: 3,
  },
  primaryButtonPressed: {
    backgroundColor: AppColors.primaryDark,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonDisabled: {
    backgroundColor: AppColors.divider,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontFamily: font.semiBold,
    fontSize: 16,
    lineHeight: 22,
    color: AppColors.white,
  },
});
