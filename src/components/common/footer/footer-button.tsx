import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import React from 'react';
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  semiBold: 'Poppins_600SemiBold',
};

export interface FooterButton {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outline';
}

interface PrimaryFooterProps {
  primaryButton: FooterButton;
  secondaryButton?: FooterButton;
  footerText?: string;
  children?: React.ReactNode;
  containerStyle?: View['props']['style'];
}

export default function PrimaryFooter({
  primaryButton,
  secondaryButton,
  footerText,
  children,
  containerStyle,
}: PrimaryFooterProps) {
  const insets = useSafeAreaInsets();

  const handlePress = (button: FooterButton) => {
    Keyboard.dismiss();
    button.onPress();
  };

  const renderButton = (button: FooterButton, flex = 1) => {
    const outline = button.variant === 'outline';

    return (
      <Pressable
        key={button.title}
        accessibilityRole='button'
        disabled={button.disabled || button.loading}
        onPress={() => handlePress(button)}
        style={({ pressed }) => [
          containerStyle,
          styles.button,
          { flex },
          outline ? styles.outlineButton : styles.filledButton,
          button.disabled && styles.disabledButton,
          pressed && !button.disabled && !button.loading && styles.buttonPressed,
        ]}
      >
        {button.loading ? (
          <ActivityIndicator color={outline ? AppColors.primary : AppColors.white} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              outline && styles.outlineButtonText,
              button.disabled && styles.disabledButtonText,
            ]}
          >
            {button.title}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      {children}

      <View style={styles.buttonRow}>
        {secondaryButton && renderButton(secondaryButton)}
        {renderButton(primaryButton)}
      </View>

      {footerText ? <Text style={styles.footerText}>{footerText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AppColors.divider,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },

  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },

  filledButton: {
    backgroundColor: AppColors.primary,
  },

  outlineButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },

  disabledButton: {
    backgroundColor: AppColors.divider,
    borderColor: AppColors.divider,
  },

  buttonText: {
    fontFamily: font.semiBold,
    fontSize: 16,
    color: AppColors.white,
  },

  outlineButtonText: {
    color: AppColors.primary,
  },

  disabledButtonText: {
    color: AppColors.placeholder,
  },

  footerText: {
    marginTop: 12,
    textAlign: 'center',
    fontFamily: font.regular,
    fontSize: 11,
    lineHeight: 16,
    color: AppColors.textSecondary,
  },
});
