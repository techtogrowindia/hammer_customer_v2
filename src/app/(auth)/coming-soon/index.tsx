import RingIcon from '@/components/common/ring-icon/ring-icon';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useBoundStore } from '@/store/boundStore';
import { router } from 'expo-router';
import { Bell, Clock3, Sparkles, SprayCan } from 'lucide-react-native';
import React from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

export default function ComingSoonScreen() {
  const clearUserInfo = useBoundStore(useShallow((state) => state.clearUserInfo));
  const goHome = async () => {
    await clearUserInfo();
    router.replace('/(auth)/otp/generate-otp');
  };

  const notifyMe = () => {};

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <View style={styles.content}>
        <View style={styles.headerStage}>
          <RingIcon
            centerIcon={<SprayCan size={36} color={AppColors.primary} strokeWidth={2} />}
            orbitItems={[
              {
                icon: <Sparkles size={16} color={AppColors.primary} strokeWidth={2} />,
              },
              {
                icon: <Bell size={16} color={AppColors.primary} strokeWidth={2} />,
              },
              {
                icon: <Clock3 size={16} color={AppColors.primary} strokeWidth={2} />,
              },
            ]}
          />
        </View>

        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.description}>
          We&apos;re polishing things up.{'\n'}
          <Text style={styles.descriptionHighlight}>Home cleaning bookings</Text> will be available right here shortly.
        </Text>
      </View>

      <View style={styles.footer}>
        {/* <Pressable
          accessibilityRole='button'
          onPress={notifyMe}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonText}>Notify Me</Text>
        </Pressable> */}

        <Pressable accessibilityRole='button' onPress={goHome} hitSlop={8} style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
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
  primaryButtonText: {
    fontFamily: font.semiBold,
    fontSize: 16,
    lineHeight: 22,
    color: AppColors.white,
  },
  secondaryAction: {
    marginTop: 16,
  },
  secondaryActionText: {
    fontFamily: font.semiBold,
    fontSize: 14,
    color: AppColors.textSecondary,
    textDecorationLine: 'underline',
  },
});
