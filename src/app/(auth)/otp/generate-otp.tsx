import PrimaryFooter from '@/components/common/footer/footer-button';
import { FormikTextInput } from '@/components/common/form/formik-text-input';
import RingIcon from '@/components/common/ring-icon/ring-icon';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useAuthApisHelper } from '@/hooks/useAuthApisHelper';
import { Formik, FormikProps } from 'formik';
import { Lock, MessageCircle, Smartphone, Sparkles } from 'lucide-react-native';
import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

const COUNTRY_CODE = '+91';

interface MobileFormValues {
  mobile: string;
}

const mobileValidationSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit number')
    .required('Mobile number is required'),
});

export default function GenerateOtpScreen() {
  const { sendOTP } = useAuthApisHelper();
  const formikRef = useRef<FormikProps<MobileFormValues>>(null);

  const handleSendOtp = async (values: MobileFormValues) => {
    await sendOTP({ mobileNumber: values.mobile, isFromReSend: false });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Formik<MobileFormValues>
          innerRef={formikRef}
          initialValues={{ mobile: '' }}
          validationSchema={mobileValidationSchema}
          onSubmit={handleSendOtp}
        >
          {({ handleSubmit, isValid, dirty, isSubmitting }) => (
            <>
              <View style={styles.content}>
                <View style={styles.headerStage}>
                  <RingIcon
                    centerIcon={<Smartphone size={36} color={AppColors.primary} strokeWidth={2} />}
                    orbitItems={[
                      {
                        icon: <Sparkles size={16} color={AppColors.primary} strokeWidth={2} />,
                      },
                      {
                        icon: <Lock size={16} color={AppColors.primary} strokeWidth={2} />,
                      },
                      {
                        icon: <MessageCircle size={16} color={AppColors.primary} strokeWidth={2} />,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.title}>Verify Your Number</Text>
                <Text style={styles.description}>
                  Enter your mobile number and we&apos;ll text you a code to verify it&apos;s really you.
                </Text>

                <FormikTextInput
                  name='mobile'
                  wrapperStyle={styles.inputWrap}
                  placeholder='98765 43210'
                  keyboardType='number-pad'
                  maxLength={10}
                  formatter={(text) => text.replace(/[^0-9]/g, '').slice(0, 10)}
                  left={
                    <>
                      <View style={styles.codeBadge}>
                        <Text style={styles.codeBadgeText}>{COUNTRY_CODE}</Text>
                      </View>
                      <View style={styles.inputDivider} />
                    </>
                  }
                />
              </View>
              <PrimaryFooter
                containerStyle={{ marginHorizontal: 16 }}
                primaryButton={{
                  title: 'Send Code',
                  onPress: handleSubmit,
                  disabled: !(isValid && dirty) || isSubmitting,
                }}
                footerText='By continuing, you agree to our Terms & Privacy Policy.'
              />
            </>
          )}
        </Formik>
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
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  description: {
    maxWidth: 322,
    marginTop: 12,
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 22,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  inputWrap: {
    marginTop: 32,
  },
});
