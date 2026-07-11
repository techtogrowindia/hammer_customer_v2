import PrimaryFooter from '@/components/common/footer/footer-button';
import RingIcon from '@/components/common/ring-icon/ring-icon';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useAuthApisHelper } from '@/hooks/useAuthApisHelper';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, KeyRound, Smartphone, Sparkles } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const params = useLocalSearchParams<{ mobile?: string; temp_id?: string }>();
  const mobile = params.mobile ?? '+91 98765 43210';
  const { sendOTP, verifyOTP } = useAuthApisHelper();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef<(TextInput | null)[]>([]);

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

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    try {
      await sendOTP({ mobileNumber: mobile, isFromReSend: true });
      setDigits(Array(CODE_LENGTH).fill(''));
      setSecondsLeft(RESEND_SECONDS);
      inputsRef.current[0]?.focus();
    } catch (error) {}
  };

  const verifyOtp = async () => {
    if (!isComplete) return;
    await verifyOTP({ otp: digits.join(''), temp_id: params.temp_id ?? '' });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable
        accessibilityRole='button'
        onPress={goBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
      >
        <Text style={styles.backIcon}>{'\u2190'}</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.headerStage}>
          <RingIcon
            animated={false}
            centerIcon={<KeyRound size={36} color={AppColors.primary} strokeWidth={2} />}
            orbitItems={[
              {
                icon: <Sparkles size={16} color={AppColors.primary} strokeWidth={2} />,
              },
              {
                icon: <CheckCircle2 size={16} color={AppColors.primary} strokeWidth={2} />,
              },
              {
                icon: <Smartphone size={16} color={AppColors.primary} strokeWidth={2} />,
              },
            ]}
          />
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

      <PrimaryFooter
        containerStyle={{ marginHorizontal: 16 }}
        primaryButton={{
          title: 'Verify',
          onPress: verifyOtp,
          disabled: !isComplete,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.white,
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
});
