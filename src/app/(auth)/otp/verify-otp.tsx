import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, KeyRound, Smartphone, Sparkles } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

const CODE_LENGTH = 4;
const RESEND_SECONDS = 30;

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{ mobile?: string }>();
  const mobile = params.mobile ?? '+91 98765 43210';

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const isComplete = digits.every((d) => d.length === 1);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const goBack = () => {
    router.back();
  };

  const handleChange = (text: string, index: number) => {
    const value = text.replace(/[^0-9]/g, '');

    setDigits((prev) => {
      const next = [...prev];
      next[index] = value.slice(-1);
      return next;
    });

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    // TODO: trigger resend OTP request here
    setDigits(Array(CODE_LENGTH).fill(''));
    setSecondsLeft(RESEND_SECONDS);
    inputsRef.current[0]?.focus();
  };

  const verifyOtp = () => {
    if (!isComplete) return;
    // TODO: trigger OTP verification request here
    router.replace('/profile/complete-profile');
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

        <View style={styles.content}>
          <View style={styles.headerStage}>
            <View style={styles.ringOuter}>
              <View style={styles.ringInner}>
                <KeyRound size={36} color={AppColors.primary} strokeWidth={2} />
              </View>
              <View style={[styles.orbitDot, styles.orbitDotTop]}>
                <Sparkles size={16} color={AppColors.primary} strokeWidth={2} />
              </View>
              <View style={[styles.orbitDot, styles.orbitDotRight]}>
                <CheckCircle2 size={16} color={AppColors.primary} strokeWidth={2} />
              </View>
              <View style={[styles.orbitDot, styles.orbitDotLeft]}>
                <Smartphone size={16} color={AppColors.primary} strokeWidth={2} />
              </View>
            </View>
          </View>

          <Text style={styles.title}>Verify Code</Text>
          <Text style={styles.description}>
            Please enter the code we just sent to{'\n'}
            <Text style={styles.descriptionHighlight}>{mobile}</Text>
          </Text>

          <View style={styles.codeRow}>
            {digits.map((digit, index) => (
              <View key={index} style={[styles.codeBox, digit ? styles.codeBoxFilled : null]}>
                <TextInput
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType='number-pad'
                  maxLength={1}
                  style={styles.codeInput}
                  autoFocus={index === 0}
                />
              </View>
            ))}
          </View>

          <View style={styles.resendWrap}>
            <Text style={styles.resendLabel}>Didn&apos;t receive OTP?</Text>
            <Pressable accessibilityRole='button' disabled={secondsLeft > 0} onPress={handleResend} hitSlop={8}>
              <Text style={[styles.resendAction, secondsLeft > 0 && styles.resendActionDisabled]}>
                {secondsLeft > 0 ? `Resend code in 0:${String(secondsLeft).padStart(2, '0')}` : 'Resend code'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole='button'
            disabled={!isComplete}
            onPress={verifyOtp}
            style={({ pressed }) => [
              styles.primaryButton,
              !isComplete && styles.primaryButtonDisabled,
              pressed && isComplete && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Verify</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  headerStage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
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
  descriptionHighlight: {
    fontFamily: font.semiBold,
    color: AppColors.primary,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 32,
  },
  codeBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
  },
  codeBoxFilled: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.warningLight,
  },
  codeInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontFamily: font.semiBold,
    fontSize: 24,
    color: AppColors.textPrimary,
  },
  resendWrap: {
    alignItems: 'center',
    marginTop: 28,
  },
  resendLabel: {
    fontFamily: font.regular,
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  resendAction: {
    marginTop: 6,
    fontFamily: font.semiBold,
    fontSize: 14,
    color: AppColors.primary,
    textDecorationLine: 'underline',
  },
  resendActionDisabled: {
    color: AppColors.textTertiary,
    textDecorationLine: 'none',
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
});
