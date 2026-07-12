import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { Check } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type IconType = typeof Check;

export interface PermissionPromptProps {
  Icon: IconType;
  title: string;
  description: string;
  benefits: string[];
  primaryLabel: string;
  onAllow: () => void;
  onSkip?: () => void;
  skipLabel?: string;
}

/**
 * Shared "soft-ask" permission screen — shown BEFORE the native OS
 * permission dialog, not instead of it. The reasoning: on both iOS and
 * Android, once someone denies the system prompt, getting them to
 * reconsider means sending them to app settings manually — a much
 * higher-friction recovery than just explaining the value up front and
 * asking again in-app later if they said "Not now" here. This screen's
 * "Allow" button should trigger the actual OS permission request; it
 * does not grant anything by itself.
 */
export function PermissionPrompt({
  Icon,
  title,
  description,
  benefits,
  primaryLabel,
  onAllow,
  onSkip,
  skipLabel = 'Not now',
}: PermissionPromptProps) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: top + 24, paddingBottom: bottom + 20 }]}>
      <View style={styles.content}>
        <View style={styles.iconRing}>
          <View style={styles.iconCircle}>
            <Icon size={36} color={AppColors.white} strokeWidth={1.75} />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.benefitsCard}>
          {benefits.map((benefit, index) => (
            <View key={benefit} style={[styles.benefitRow, index !== benefits.length - 1 && styles.benefitRowDivider]}>
              <View style={styles.checkWrap}>
                <Check size={12} color={AppColors.primary} strokeWidth={2.5} />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole='button'
          onPress={onAllow}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
        >
          <Text style={styles.primaryBtnText}>{primaryLabel}</Text>
        </Pressable>

        {onSkip && (
          <Pressable
            accessibilityRole='button'
            onPress={onSkip}
            style={({ pressed }) => [styles.skipBtn, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.skipBtnText}>{skipLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.white, paddingHorizontal: 24, justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  iconRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
    marginBottom: 28,
  },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
  },

  title: { fontFamily: font.bold, fontSize: 22, color: AppColors.textPrimary, textAlign: 'center' },
  description: {
    marginTop: 10,
    fontFamily: font.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: AppColors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },

  benefitsCard: {
    width: '100%',
    marginTop: 28,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    overflow: 'hidden',
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13 },
  benefitRowDivider: { borderBottomWidth: 1, borderBottomColor: AppColors.divider },
  checkWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  benefitText: { flex: 1, fontFamily: font.regular, fontSize: 12.5, color: AppColors.textPrimary },

  actions: { gap: 6 },
  primaryBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  primaryBtnPressed: { backgroundColor: AppColors.primaryDark },
  primaryBtnText: { fontFamily: font.semiBold, fontSize: 15, color: AppColors.white },
  skipBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  skipBtnText: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textTertiary },
});

export default PermissionPrompt;
