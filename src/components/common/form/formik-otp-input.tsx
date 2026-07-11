import PrimaryFooter from '@/components/common/footer/footer-button';
import FormikOtpInput from '@/components/common/formik-otp-input/formik-otp-input';
import RingIcon from '@/components/common/ring-icon/ring-icon';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useAuthApisHelper } from '@/hooks/useAuthApisHelper';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik, FormikProps } from 'formik';
import { CheckCircle2, KeyRound, Smartphone, Sparkles } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

const CODE_LENGTH = 4;
const RESEND_SECONDS = 30;

interface OtpFormValues {
  otp: string;
}

const otpValidationSchema = Yup.object().shape({
  otp: Yup.string().length(CODE_LENGTH, 'Enter the complete code').required('Enter the complete code'),
});

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{ mobile?: string; temp_id?: string }>();
  const mobile = params.mobile ?? '+91 98765 43210';
  const { sendOTP, verifyOTP } = useAuthApisHelper();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const formikRef = useRef<FormikProps<OtpFormValues>>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const goBack = () => {
    router.back();
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    try {
      await sendOTP({ mobileNumber: mobile, isFromReSend: true });
      formikRef.current?.resetForm();
      setSecondsLeft(RESEND_SECONDS);
    } catch (error) {}
  };

  const handleVerify = async (values: OtpFormValues) => {
    await verifyOTP({ otp: values.otp, temp_id: params.temp_id ?? '' });
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

      <Formik<OtpFormValues>
        innerRef={formikRef}
        initialValues={{ otp: '' }}
        validationSchema={otpValidationSchema}
        onSubmit={handleVerify}
      >
        {({ handleSubmit, isValid, dirty, isSubmitting }) => (
          <>
            <View style={styles.content}>
              <View style={styles.headerStage}>
                <RingIcon
                  centerIcon={<KeyRound size={36} color={AppColors.primary} strokeWidth={2} />}
                  orbitItems={[
                    {
                      position: 'top',
                      icon: <Sparkles size={16} color={AppColors.primary} strokeWidth={2} />,
                    },
                    {
                      position: 'right',
                      icon: <CheckCircle2 size={16} color={AppColors.primary} strokeWidth={2} />,
                    },
                    {
                      position: 'left',
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

              <FormikOtpInput name='otp' length={CODE_LENGTH} wrapperStyle={styles.otpWrapper} autoFocus />

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
              primaryButton={{
                title: 'Verify',
                onPress: handleSubmit,
                disabled: !(isValid && dirty) || isSubmitting,
              }}
            />
          </>
        )}
      </Formik>
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
  otpWrapper: {
    marginTop: 32,
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
