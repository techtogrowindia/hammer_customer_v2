import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderAction {
  icon: React.ReactNode;
  onPress: () => void;
}

interface HeaderWithTitleProps {
  title: string;
  onBack?: () => void;
  backgroundColor?: string;
  leftIcon?: React.ReactNode;
  rightActions?: HeaderAction[];
}

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

export function HeaderWithTitle({
  title,
  onBack,
  backgroundColor = AppColors.primary,
  leftIcon,
  rightActions = [],
}: HeaderWithTitleProps) {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: top + 12,
        },
      ]}
    >
      <View style={styles.decor} />

      <View style={styles.row}>
        <Pressable
          accessibilityRole='button'
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}
        >
          {leftIcon ?? <ArrowLeft size={19} color={AppColors.white} strokeWidth={2.25} />}
        </Pressable>

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <View style={styles.actions}>
          {rightActions.length > 0 ? (
            rightActions.map((action, index) => (
              <Pressable
                key={index}
                accessibilityRole='button'
                hitSlop={8}
                onPress={action.onPress}
                style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}
              >
                {action.icon}
              </Pressable>
            ))
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    // borderBottomLeftRadius: 28,
    // borderBottomRightRadius: 28,
    overflow: 'hidden',
  },

  decor: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -90,
    right: -60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    marginHorizontal: 12,
    textAlign: 'center',
    color: AppColors.white,
    fontFamily: font.semiBold,
    fontSize: 16,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    minWidth: 36,
    justifyContent: 'flex-end',
  },

  placeholder: {
    width: 36,
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  iconPressed: {
    opacity: 0.75,
  },
});

export default HeaderWithTitle;
