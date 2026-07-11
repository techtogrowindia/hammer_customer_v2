import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useAuthApisHelper } from '@/hooks/useAuthApisHelper';
import { Lock, MessageCircle, Smartphone, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

const COUNTRY_CODE = '+91';

export default function GenerateOtpScreen() {
  const { sendOTP } = useAuthApisHelper();
  const [mobile, setMobile] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isValid = mobile.trim().length === 10;

  const sendOtp = () => {
    if (!isValid) return;

    // TODO: trigger OTP send request here
    // router.push({ pathname: '/otp/verify-otp', params: { mobile: `${COUNTRY_CODE}${mobile}` } });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <View style={styles.headerStage}>
            <View style={styles.ringOuter}>
              <View style={styles.ringInner}>
                <Smartphone size={36} color={AppColors.primary} strokeWidth={2} />
              </View>
              <View style={[styles.orbitDot, styles.orbitDotTop]}>
                <Sparkles size={16} color={AppColors.primary} strokeWidth={2} />
              </View>
              <View style={[styles.orbitDot, styles.orbitDotRight]}>
                <Lock size={16} color={AppColors.primary} strokeWidth={2} />
              </View>
              <View style={[styles.orbitDot, styles.orbitDotLeft]}>
                <MessageCircle size={16} color={AppColors.primary} strokeWidth={2} />
              </View>
            </View>
          </View>

          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.description}>
            Enter your mobile number and we&apos;ll text you a code to verify it&apos;s really you.
          </Text>

          <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>{COUNTRY_CODE}</Text>
            </View>
            <View style={styles.inputDivider} />
            <TextInput
              value={mobile}
              onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, '').slice(0, 10))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder='98765 43210'
              placeholderTextColor={AppColors.textTertiary}
              keyboardType='number-pad'
              maxLength={10}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole='button'
            disabled={!isValid}
            onPress={sendOtp}
            style={({ pressed }) => [
              styles.primaryButton,
              !isValid && styles.primaryButtonDisabled,
              pressed && isValid && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Send Code</Text>
          </Pressable>

          <Text style={styles.terms}>By continuing, you agree to our Terms & Privacy Policy</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 64,
  },
  headerStage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  ringOuter: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  ringInner: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  orbitDot: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.divider,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  orbitDotTop: {
    top: -6,
    right: 8,
  },
  orbitDotRight: {
    bottom: 10,
    right: -8,
  },
  orbitDotLeft: {
    bottom: 10,
    left: -8,
  },
  codeBadge: {
    paddingHorizontal: 4,
  },
  codeBadgeText: {
    fontFamily: font.semiBold,
    fontSize: 15,
    color: AppColors.textPrimary,
  },
  inputDivider: {
    width: 1,
    height: 22,
    marginHorizontal: 12,
    backgroundColor: AppColors.divider,
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
    marginTop: 12,
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  inputWrap: {
    width: '100%',
    maxWidth: 330,
    height: 58,
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
  },
  inputWrapFocused: {
    borderColor: AppColors.primary,
  },
  input: {
    flex: 1,
    fontFamily: font.medium,
    fontSize: 15,
    color: AppColors.textPrimary,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 34,
    paddingBottom: 30,
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
  terms: {
    marginTop: 14,
    fontFamily: font.regular,
    fontSize: 9,
    lineHeight: 13,
    color: AppColors.textTertiary,
    textAlign: 'center',
  },
});
